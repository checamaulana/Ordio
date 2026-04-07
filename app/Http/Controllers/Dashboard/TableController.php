<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\TableStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\StoreTableRequest;
use App\Models\Table;
use App\Services\QrCodeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class TableController extends Controller
{
    public function __construct(private readonly QrCodeService $qrCodeService) {}

    public function index(): Response
    {
        $tables = Table::query()
            ->orderBy('number')
            ->get()
            ->map(fn (Table $table): array => [
                'id' => $table->id,
                'number' => $table->number,
                'status' => $table->status->value,
                'can_delete' => $table->status === TableStatus::Kosong,
                'qr_code_url' => Storage::disk('public')->url($table->qr_code_path),
            ]);

        return Inertia::render('dashboard/Tables', [
            'tables' => $tables,
        ]);
    }

    public function store(StoreTableRequest $request): RedirectResponse
    {
        $number = $request->integer('number');
        $path = $this->qrCodeService->generate(new Table(['number' => $number]));

        Table::query()->create([
            'number' => $number,
            'status' => TableStatus::Kosong,
            'qr_code_path' => $path,
        ]);

        return redirect()->route('dashboard.tables.index');
    }

    public function destroy(Table $table): RedirectResponse
    {
        if ($table->status !== TableStatus::Kosong) {
            return redirect()->route('dashboard.tables.index');
        }

        $this->qrCodeService->delete($table);
        $table->delete();

        return redirect()->route('dashboard.tables.index');
    }

    public function resetStatus(Table $table): RedirectResponse
    {
        $table->update([
            'status' => TableStatus::Kosong,
        ]);

        return redirect()->route('dashboard.tables.index');
    }

    public function showQr(Table $table): JsonResponse
    {
        if (! Storage::disk('public')->exists($table->qr_code_path)) {
            $table->update([
                'qr_code_path' => $this->qrCodeService->generate($table),
            ]);
        }

        return response()->json([
            'table_id' => $table->id,
            'table_number' => $table->number,
            'qr_code_url' => Storage::disk('public')->url($table->qr_code_path),
            'download_url' => route('dashboard.tables.download-qr', $table),
        ]);
    }

    public function downloadQr(Table $table): StreamedResponse
    {
        if (! Storage::disk('public')->exists($table->qr_code_path)) {
            $table->update([
                'qr_code_path' => $this->qrCodeService->generate($table),
            ]);
        }

        return Storage::disk('public')->download($table->qr_code_path, sprintf('meja-%d.svg', $table->number));
    }
}
