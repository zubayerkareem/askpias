<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CreateAdmin extends Command
{
    protected $signature = 'app:create-admin
                            {email : Admin email address}
                            {--name= : Display name}
                            {--password= : Password (a random one is generated when omitted)}';

    protected $description = 'Create an admin account, or reset the password of an existing one';

    public function handle(): int
    {
        $email = strtolower(trim((string) $this->argument('email')));

        if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error('That email address is not valid.');

            return self::FAILURE;
        }

        $password = (string) ($this->option('password') ?: Str::password(14));

        if (mb_strlen($password) < 8) {
            $this->error('The password must be at least 8 characters.');

            return self::FAILURE;
        }

        $user = User::query()->updateOrCreate(
            ['email' => $email],
            [
                'name' => (string) ($this->option('name') ?: 'Admin'),
                'password' => Hash::make($password),
            ],
        );

        $this->info(($user->wasRecentlyCreated ? 'Created' : 'Updated').' admin: '.$user->email);
        $this->line('Password: '.$password);
        $this->line('Login path: /admin');

        return self::SUCCESS;
    }
}
