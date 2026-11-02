<?php

/**
 * AskPias browser installer — single-file setup wizard (CodeCanyon style).
 *
 * URL: https://<api-domain>/install.php  (this file lives in backend/public)
 *
 * Installs the Laravel admin/API: requirements check, .env, app key, database,
 * migrations, optional demo content, admin account, storage link and caches.
 * The Node site still needs a shell build — the final screen prints the command.
 *
 * Locks itself with backend/storage/installed.lock. Delete that file to re-run.
 */
declare(strict_types=1);

$root = dirname(__DIR__);
$envFile = $root.'/.env';
$envExample = $root.'/.env.example';
$lockFile = $root.'/storage/installed.lock';
$installed = is_file($lockFile);

function h(mixed $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function cliPhp(): ?string
{
    if (! function_exists('shell_exec')) {
        return null;
    }

    $candidates = array_merge(
        glob('/www/server/php/*/bin/php') ?: [],
        ['/usr/local/lsws/lsphp83/bin/php', '/usr/bin/php8.3', '/usr/local/bin/php', PHP_BINDIR.'/php', PHP_BINARY],
    );

    rsort($candidates);

    foreach ($candidates as $bin) {
        if (! is_string($bin) || ! is_file($bin) || ! is_executable($bin)) {
            continue;
        }

        $version = trim((string) @shell_exec(escapeshellarg($bin).' -r "echo PHP_VERSION;"'));

        if ($version !== '' && version_compare($version, '8.3.0', '>=')) {
            return $bin;
        }
    }

    return null;
}

function composerPath(): ?string
{
    foreach (['/usr/local/bin/composer', '/usr/bin/composer'] as $candidate) {
        if (is_file($candidate)) {
            return $candidate;
        }
    }

    if (function_exists('shell_exec')) {
        $found = trim((string) @shell_exec('command -v composer 2>/dev/null'));

        if ($found !== '' && is_file($found)) {
            return $found;
        }
    }

    return null;
}

/**
 * @param  array<int, string>  $command
 * @return array{0: int, 1: string}
 */
function runStep(array $command, string $cwd): array
{
    if (! function_exists('proc_open')) {
        return [127, 'proc_open() is disabled on this server.'];
    }

    $descriptors = [1 => ['pipe', 'w'], 2 => ['pipe', 'w']];
    $process = @proc_open($command, $descriptors, $pipes, $cwd);

    if (! is_resource($process)) {
        return [127, 'Could not start the process.'];
    }

    $stdout = (string) stream_get_contents($pipes[1]);
    fclose($pipes[1]);
    $stderr = (string) stream_get_contents($pipes[2]);
    fclose($pipes[2]);

    return [proc_close($process), trim($stdout."\n".$stderr)];
}

$php = cliPhp();

$checks = [
    ['PHP '.PHP_VERSION.' on the web server', version_compare(PHP_VERSION, '8.3.0', '>='), 'Need PHP 8.3 or newer'],
];

foreach (['pdo_mysql', 'mbstring', 'openssl', 'fileinfo', 'curl', 'tokenizer', 'xml', 'ctype', 'zip', 'json', 'gd'] as $extension) {
    $checks[] = ['PHP extension: '.$extension, extension_loaded($extension), 'Enable it in the PHP 8.3 profile'];
}

$checks[] = ['PHP 8.3+ CLI binary', $php !== null, 'Set the CLI binary in aaPanel → PHP 8.3'];
$checks[] = ['backend/.env.example', is_file($envExample), 'Upload the full package'];
$checks[] = ['backend/ writable', is_writable($root), 'chown www:www backend'];
$checks[] = ['storage/ writable', is_writable($root.'/storage'), 'chown -R www:www storage'];
$checks[] = ['bootstrap/cache writable', is_writable($root.'/bootstrap/cache'), 'chown -R www:www bootstrap/cache'];

$allOk = ! in_array(false, array_column($checks, 1), true);

/** @var array<int, array{label: string, ok: bool, output: string}> $log */
$log = [];
$errors = [];
$done = false;

$field = static function (string $key, string $default = ''): string {
    $value = $_POST[$key] ?? $default;

    return is_string($value) ? trim($value) : $default;
};

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST' && ! $installed) {
    $siteUrl = rtrim($field('site_url', 'https://askpias.com'), '/');
    $apiUrl = rtrim($field('api_url', 'https://api.askpias.com'), '/');
    $dbHost = $field('db_host', '127.0.0.1');
    $dbPort = $field('db_port', '3306');
    $dbName = $field('db_name', 'askpias');
    $dbUser = $field('db_user', 'askpias');
    $dbPass = (string) ($_POST['db_pass'] ?? '');
    $rootUser = $field('mysql_root_user', 'root');
    $rootPass = (string) ($_POST['mysql_root_pass'] ?? '');
    $adminName = $field('admin_name', 'Admin');
    $adminEmail = $field('admin_email', '');
    $adminPass = (string) ($_POST['admin_password'] ?? '');
    $seedDemo = isset($_POST['seed_demo']);

    if (! $php) {
        $errors[] = 'No PHP 8.3+ CLI binary found. Without it the installer cannot run artisan.';
    }
    if ($siteUrl === '' || $apiUrl === '') {
        $errors[] = 'Site URL and API URL are required.';
    }
    if (! preg_match('/^[A-Za-z0-9_]+$/', $dbName) || ! preg_match('/^[A-Za-z0-9_]+$/', $dbUser)) {
        $errors[] = 'Database name and user may only contain letters, digits and underscores.';
    }
    if (! filter_var($adminEmail, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Enter a valid admin email address.';
    }
    if (strlen($adminPass) < 8) {
        $errors[] = 'The admin password must be at least 8 characters.';
    }

    // Database: create it with the MySQL root account when one is supplied.
    if ($errors === [] && $rootPass !== '') {
        try {
            $server = new PDO("mysql:host={$dbHost};port={$dbPort}", $rootUser, $rootPass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
            $server->exec("CREATE DATABASE IF NOT EXISTS `{$dbName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            $server->exec("CREATE USER IF NOT EXISTS '{$dbUser}'@'localhost' IDENTIFIED BY ".$server->quote($dbPass));
            $server->exec("GRANT ALL PRIVILEGES ON `{$dbName}`.* TO '{$dbUser}'@'localhost'");
            $server->exec('FLUSH PRIVILEGES');
            $log[] = ['label' => 'Database + user created', 'ok' => true, 'output' => "{$dbName} / {$dbUser}"];
        } catch (Throwable $exception) {
            $errors[] = 'MySQL root login failed: '.$exception->getMessage();
        }
    }

    if ($errors === []) {
        try {
            new PDO("mysql:host={$dbHost};port={$dbPort};dbname={$dbName}", $dbUser, $dbPass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
            $log[] = ['label' => 'Database connection', 'ok' => true, 'output' => 'Connected'];
        } catch (Throwable $exception) {
            $errors[] = 'Cannot connect with those database credentials: '.$exception->getMessage();
        }
    }

    // .env
    if ($errors === [] && ! is_file($envFile) && ! @copy($envExample, $envFile)) {
        $errors[] = 'Could not create backend/.env — make the backend folder writable by the web user.';
    }

    if ($errors === [] && $php) {
        $pairs = [
            'APP_NAME=AskPias',
            'APP_ENV=production',
            'APP_DEBUG=false',
            'APP_URL='.$apiUrl,
            'APP_VERSION=1.0.0',
            'APP_BRANCH=main',
            'FRONTEND_URL='.$siteUrl,
            'FRONTEND_URLS='.$siteUrl,
            'DB_CONNECTION=mysql',
            'DB_HOST='.$dbHost,
            'DB_PORT='.$dbPort,
            'DB_DATABASE='.$dbName,
            'DB_USERNAME='.$dbUser,
            'DB_PASSWORD='.$dbPass,
            'MAIL_MAILER=log',
        ];

        [$code, $output] = runStep(array_merge([$php, $root.'/scripts/set-env.php', $envFile], $pairs), $root);
        $log[] = ['label' => 'Writing .env', 'ok' => $code === 0, 'output' => $output];

        if ($code !== 0) {
            $errors[] = 'Writing .env failed.';
        }
    }

    if ($errors === [] && $php) {
        $env = (string) @file_get_contents($envFile);

        if (preg_match('/^APP_KEY=\s*$/m', $env) === 1) {
            [$code, $output] = runStep([$php, 'artisan', 'key:generate', '--force'], $root);
            $log[] = ['label' => 'Application key', 'ok' => $code === 0, 'output' => $output];
            $code !== 0 && $errors[] = 'key:generate failed.';
        } else {
            $log[] = ['label' => 'Application key', 'ok' => true, 'output' => 'Already set — kept'];
        }
    }

    if ($errors === [] && $php && ! is_file($root.'/vendor/autoload.php')) {
        $composer = composerPath();

        if (! $composer) {
            $errors[] = 'Composer is not installed on the server — run "composer install" manually.';
        } else {
            [$code, $output] = runStep([$php, $composer, 'install', '--no-dev', '--optimize-autoloader', '--no-interaction'], $root);
            $log[] = ['label' => 'Composer dependencies', 'ok' => $code === 0, 'output' => $output];
            $code !== 0 && $errors[] = 'composer install failed.';
        }
    }

    if ($errors === [] && $php) {
        $steps = [
            'Migrations' => ['artisan', 'migrate', '--force'],
            'Admin account' => ['artisan', 'app:create-admin', $adminEmail, '--name='.$adminName, '--password='.$adminPass],
            'Caching config' => ['artisan', 'optimize'],
        ];

        if ($seedDemo) {
            $steps = ['Migrations' => ['artisan', 'migrate', '--force']]
                + ['Demo content' => ['artisan', 'db:seed', '--force']]
                + array_slice($steps, 1, null, true);
        }

        foreach ($steps as $label => $command) {
            [$code, $output] = runStep(array_merge([$php], $command), $root);
            $log[] = ['label' => $label, 'ok' => $code === 0, 'output' => $output];

            if ($code !== 0) {
                $errors[] = $label.' failed — see the output below.';
                break;
            }
        }
    }

    if ($errors === [] && $php) {
        [$code, $output] = runStep([$php, 'artisan', 'storage:link'], $root);
        $log[] = ['label' => 'Upload storage link', 'ok' => true, 'output' => $output];
    }

    // Website: write its .env, build it with Node, then start it.
    if ($errors === [] && $php) {
        $appRoot = dirname($root);

        @file_put_contents(
            $appRoot.'/.env',
            "VITE_API_URL={$apiUrl}/api\nVITE_ADMIN_URL={$apiUrl}/admin\nVITE_GTM_ID=\n",
        );
        $log[] = ['label' => 'Website configuration', 'ok' => true, 'output' => "API: {$apiUrl}"];

        if (! is_file($appRoot.'/.output/server/index.mjs')) {
            $build = 'cd '.escapeshellarg($appRoot).' && '
                .'{ command -v bun >/dev/null 2>&1 && bun install --frozen-lockfile && bun run build '
                .'|| npm install && npm run build; }';

            [$code, $output] = runStep(['bash', '-lc', $build], $appRoot);
            $log[] = ['label' => 'Website build (Node)', 'ok' => $code === 0, 'output' => $output];

            if ($code !== 0) {
                $errors[] = 'The website build failed. Install Node.js 20+ and PM2, then run: bash install.sh --frontend-only';
            }
        } else {
            $log[] = ['label' => 'Website build (Node)', 'ok' => true, 'output' => 'Already built'];
        }
    }

    if ($errors === [] && $php) {
        $appRoot = dirname($root);
        $start = 'cd '.escapeshellarg($appRoot).' && { '
            .'command -v pm2 >/dev/null 2>&1 && { pm2 describe askpias-web >/dev/null 2>&1 '
            .'&& PORT=3000 pm2 restart askpias-web --update-env '
            .'|| PORT=3000 pm2 start .output/server/index.mjs --name askpias-web --update-env; } '
            .'|| { command -v node >/dev/null 2>&1 && nohup node .output/server/index.mjs '
            .'> storage/logs/site.log 2>&1 < /dev/null & }; }';

        [$code, $output] = runStep(['bash', '-lc', $start], $appRoot);
        $log[] = ['label' => 'Website started on 127.0.0.1:3000', 'ok' => $code === 0, 'output' => $output];
    }

    if ($errors === []) {
        @file_put_contents($lockFile, date('c')."\n");
        $done = true;
        $installed = true;
    }
}
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>AskPias installer</title>
<style>
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body { margin: 0; padding: 32px 16px 64px; background: #fdfaf3; color: #101012;
        font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.55; }
    .wrap { max-width: 720px; margin: 0 auto; }
    .brand { font-size: 12px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #0141c5; }
    h1 { margin: 6px 0 4px; font-size: 26px; letter-spacing: -.02em; }
    p.lead { margin: 0 0 22px; color: #5b5b66; font-size: 14px; }
    .card { background: #fff; border: 1px solid rgba(16,16,18,.1); border-radius: 10px; padding: 18px; margin-bottom: 16px; }
    .card h2 { margin: 0 0 12px; font-size: 14px; text-transform: uppercase; letter-spacing: .07em; color: #6b6b76; }
    .row { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
    label { display: block; font-size: 12px; font-weight: 700; color: #3c3c46; margin-bottom: 4px; }
    input[type=text], input[type=password], input[type=email], input[type=number] {
        width: 100%; padding: 9px 11px; font: inherit; font-size: 14px; color: #101012;
        background: #fff; border: 1px solid rgba(16,16,18,.16); border-radius: 6px; }
    input:focus { outline: 2px solid #0141c5; outline-offset: 1px; border-color: #0141c5; }
    .hint { margin-top: 4px; font-size: 11px; color: #7a7a85; }
    button { display: inline-flex; align-items: center; gap: 8px; margin-top: 4px; padding: 11px 18px;
        font: inherit; font-size: 14px; font-weight: 700; color: #fff; background: #0141c5;
        border: 0; border-radius: 7px; cursor: pointer; }
    button:disabled { opacity: .5; cursor: not-allowed; }
    ul.checks { list-style: none; margin: 0; padding: 0; font-size: 13px; }
    ul.checks li { display: flex; justify-content: space-between; gap: 12px; padding: 5px 0; border-bottom: 1px solid rgba(16,16,18,.07); }
    ul.checks li:last-child { border-bottom: 0; }
    .ok { color: #16794a; font-weight: 700; }
    .bad { color: #b42318; font-weight: 700; }
    pre { margin: 6px 0 0; padding: 10px 12px; background: #0f1013; color: #d6dbe6; border-radius: 7px;
        font-size: 11.5px; line-height: 1.5; overflow: auto; max-height: 240px; white-space: pre-wrap; word-break: break-word; }
    .alert { border: 1px solid rgba(180,35,24,.25); background: #fff5f4; color: #b42318; border-radius: 8px; padding: 12px 14px; font-size: 13px; margin-bottom: 14px; }
    .success { border: 1px solid rgba(22,121,74,.25); background: #f2fbf6; color: #16794a; border-radius: 8px; padding: 12px 14px; font-size: 13px; margin-bottom: 14px; }
    code { background: rgba(16,16,18,.06); border-radius: 4px; padding: 1px 5px; font-size: 12px; }
    a { color: #0141c5; }
    .muted { color: #6b6b76; font-size: 12px; }
</style>
</head>
<body>
<div class="wrap">
    <div class="brand">AskPias</div>
    <h1><?= $done ? 'Installed' : ($installed ? 'Already installed' : 'Install AskPias') ?></h1>
    <p class="lead">
        <?= $done
            ? 'The admin and API are ready. One step left: build and start the website.'
            : ($installed
                ? 'This server is already installed. Delete backend/storage/installed.lock to run the installer again.'
                : 'Sets up the Laravel admin, API, database and your admin account. Takes about a minute.') ?>
    </p>

    <?php if ($errors !== []): ?>
        <div class="alert">
            <strong>Could not finish.</strong>
            <ul style="margin: 8px 0 0; padding-left: 18px;">
                <?php foreach ($errors as $error): ?><li><?= h($error) ?></li><?php endforeach; ?>
            </ul>
        </div>
    <?php endif; ?>

    <?php if ($log !== []): ?>
        <div class="card">
            <h2>Install log</h2>
            <?php foreach ($log as $entry): ?>
                <div style="font-size: 13px; margin-bottom: 8px;">
                    <span class="<?= $entry['ok'] ? 'ok' : 'bad' ?>"><?= $entry['ok'] ? 'OK' : 'FAILED' ?></span>
                    — <?= h($entry['label']) ?>
                    <?php if ($entry['output'] !== ''): ?><pre><?= h($entry['output']) ?></pre><?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>

    <?php if ($done): ?>
        <div class="success">
            Installation complete — admin at <a href="/admin">/admin</a>,
            website at <a href="<?= h($field('site_url', 'https://askpias.com')) ?>"><?= h($field('site_url', 'https://askpias.com')) ?></a>
        </div>

        <div class="card">
            <h2>If the website shows 503</h2>
            <p style="margin: 0; font-size: 13px;">
                The Node process isn't reachable on port 3000. Point the website's domain at
                <code>http://127.0.0.1:3000</code> (reverse proxy), and start it with
                <code>pm2 start askpias-web</code> if the process stopped.
            </p>
        </div>
    <?php elseif ($installed): ?>
        <div class="card"><a href="/admin">Go to the admin panel →</a></div>
    <?php else: ?>
        <div class="card">
            <h2>Requirements</h2>
            <ul class="checks">
                <?php foreach ($checks as [$label, $pass, $hint]): ?>
                    <li>
                        <span><?= h($label) ?></span>
                        <span class="<?= $pass ? 'ok' : 'bad' ?>"><?= $pass ? 'OK' : 'MISSING' ?></span>
                    </li>
                <?php endforeach; ?>
            </ul>
            <?php if (! $allOk): ?>
                <p class="hint" style="margin-top: 10px;">Fix the MISSING lines above before installing.</p>
            <?php endif; ?>
        </div>

        <form method="post" autocomplete="off">
            <div class="card">
                <h2>Site</h2>
                <div class="row">
                    <div>
                        <label for="site_url">Public site URL</label>
                        <input id="site_url" name="site_url" type="text" value="<?= h($field('site_url', 'https://askpias.com')) ?>">
                    </div>
                    <div>
                        <label for="api_url">Admin / API URL</label>
                        <input id="api_url" name="api_url" type="text" value="<?= h($field('api_url', 'https://api.askpias.com')) ?>">
                        <div class="hint">Where this installer is running.</div>
                    </div>
                </div>
            </div>

            <div class="card">
                <h2>Database</h2>
                <div class="row">
                    <div>
                        <label for="db_host">Host</label>
                        <input id="db_host" name="db_host" type="text" value="<?= h($field('db_host', '127.0.0.1')) ?>">
                    </div>
                    <div>
                        <label for="db_port">Port</label>
                        <input id="db_port" name="db_port" type="text" value="<?= h($field('db_port', '3306')) ?>">
                    </div>
                    <div>
                        <label for="db_name">Database name</label>
                        <input id="db_name" name="db_name" type="text" value="<?= h($field('db_name', 'askpias')) ?>">
                    </div>
                    <div>
                        <label for="db_user">Database user</label>
                        <input id="db_user" name="db_user" type="text" value="<?= h($field('db_user', 'askpias')) ?>">
                    </div>
                    <div>
                        <label for="db_pass">Database password</label>
                        <input id="db_pass" name="db_pass" type="password" value="<?= h((string) ($_POST['db_pass'] ?? '')) ?>">
                    </div>
                </div>
                <div class="row" style="margin-top: 12px;">
                    <div>
                        <label for="mysql_root_user">MySQL root user</label>
                        <input id="mysql_root_user" name="mysql_root_user" type="text" value="<?= h($field('mysql_root_user', 'root')) ?>">
                    </div>
                    <div>
                        <label for="mysql_root_pass">MySQL root password</label>
                        <input id="mysql_root_pass" name="mysql_root_pass" type="password" value="">
                        <div class="hint">Leave blank if the database and user already exist.</div>
                    </div>
                </div>
            </div>

            <div class="card">
                <h2>Admin account</h2>
                <div class="row">
                    <div>
                        <label for="admin_name">Name</label>
                        <input id="admin_name" name="admin_name" type="text" value="<?= h($field('admin_name', 'Pias Ahmed')) ?>">
                    </div>
                    <div>
                        <label for="admin_email">Email</label>
                        <input id="admin_email" name="admin_email" type="email" value="<?= h($field('admin_email', '')) ?>">
                    </div>
                    <div>
                        <label for="admin_password">Password</label>
                        <input id="admin_password" name="admin_password" type="password" value="">
                        <div class="hint">At least 8 characters.</div>
                    </div>
                </div>
                <label style="display: flex; align-items: center; gap: 8px; margin-top: 14px; font-weight: 400;">
                    <input type="checkbox" name="seed_demo" value="1" <?= isset($_POST['seed_demo']) || $_SERVER['REQUEST_METHOD'] !== 'POST' ? 'checked' : '' ?>>
                    <span style="font-size: 13px;">Install demo content (4 notes, 3 case studies, 3 testimonials, 3 projects, 1 book)</span>
                </label>
            </div>

            <button type="submit" <?= $allOk ? '' : 'disabled' ?>>Install now</button>
            <?php if (! $allOk): ?>
                <p class="hint">Resolve the missing requirements above first.</p>
            <?php endif; ?>
        </form>
    <?php endif; ?>

    <p class="muted" style="margin-top: 18px;">
        This file locks itself after a successful install. You can delete
        <code>backend/public/install.php</code> afterwards.
    </p>
</div>
</body>
</html>
