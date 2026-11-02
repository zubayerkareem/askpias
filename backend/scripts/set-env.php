<?php

/**
 * Safe .env key writer used by install.sh and update.sh.
 *
 * Usage: php scripts/set-env.php /path/to/.env KEY=value KEY2=value2 ...
 *
 * Values are passed as separate argv entries, so spaces, quotes, $ and # survive
 * bash untouched; the file gets quotes only where .env requires them.
 */
$file = $argv[1] ?? null;

if (! $file || ! is_file($file)) {
    fwrite(STDERR, "Missing env file: {$file}\n");
    exit(1);
}

$pairs = [];

foreach (array_slice($argv, 2) as $pair) {
    if (! str_contains($pair, '=')) {
        continue;
    }

    [$key, $value] = explode('=', $pair, 2);

    if (! preg_match('/^[A-Z0-9_]+$/', $key)) {
        fwrite(STDERR, "Invalid env key: {$key}\n");
        exit(1);
    }

    $pairs[$key] = $value;
}

if ($pairs === []) {
    fwrite(STDERR, "No KEY=value pairs given.\n");
    exit(1);
}

$format = static function (string $value): string {
    if ($value === '') {
        return '';
    }

    if (strpbrk($value, " \t\n\r#\"'\\$") !== false) {
        return '"'.addcslashes($value, "\"\\$").'"';
    }

    return $value;
};

$lines = preg_split('/\r\n|\n|\r/', (string) file_get_contents($file)) ?: [];
$seen = [];

foreach ($lines as $index => $line) {
    foreach ($pairs as $key => $value) {
        if (preg_match('/^\s*#?\s*'.preg_quote((string) $key, '/').'\s*=/', $line)) {
            $lines[$index] = $key.'='.$format((string) $value);
            $seen[$key] = true;
            break;
        }
    }
}

foreach ($pairs as $key => $value) {
    if (! isset($seen[$key])) {
        $lines[] = $key.'='.$format((string) $value);
    }
}

file_put_contents($file, implode("\n", $lines)."\n");

echo 'env updated: '.implode(', ', array_keys($pairs))."\n";
