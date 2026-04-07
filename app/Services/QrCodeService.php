<?php

namespace App\Services;

use App\Models\Table;
use Illuminate\Support\Facades\Storage;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class QrCodeService
{
    public function generate(Table $table): string
    {
        $this->ensureQrCodeDirectoryExists();

        $path = $this->buildPath($table);

        $svg = QrCode::format('svg')
            ->size(300)
            ->margin(2)
            ->generate($this->buildMenuUrl($table));

        Storage::disk('public')->put($path, $svg);

        return $path;
    }

    public function delete(Table $table): void
    {
        Storage::disk('public')->delete($this->buildPath($table));
    }

    public function buildMenuUrl(Table $table): string
    {
        $appUrl = rtrim((string) config('app.url'), '/');

        return sprintf('%s/meja/%s/menu', $appUrl, $table->number);
    }

    public function buildPath(Table $table): string
    {
        return sprintf('qrcodes/%s.svg', $table->number);
    }

    private function ensureQrCodeDirectoryExists(): void
    {
        if (! Storage::disk('public')->exists('qrcodes')) {
            Storage::disk('public')->makeDirectory('qrcodes');
        }
    }
}
