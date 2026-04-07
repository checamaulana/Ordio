<?php

namespace Database\Seeders;

use App\Enums\TableStatus;
use App\Models\Table;
use App\Services\QrCodeService;
use Illuminate\Database\Seeder;

class TableSeeder extends Seeder
{
    public function run(): void
    {
        $qrCodeService = app(QrCodeService::class);

        foreach (range(1, 20) as $number) {
            $table = Table::updateOrCreate(
                ['number' => $number],
                [
                    'status' => TableStatus::Kosong,
                    'qr_code_path' => '',
                ],
            );

            $path = $qrCodeService->generate($table);

            if ($table->qr_code_path !== $path) {
                $table->update(['qr_code_path' => $path]);
            }
        }
    }
}
