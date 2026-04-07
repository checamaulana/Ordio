type TableFormProps = {
    open: boolean;
    processing: boolean;
    number: string;
    error?: string;
    onClose: () => void;
    onChangeNumber: (value: string) => void;
    onSubmit: () => void;
};

export function TableForm({ open, processing, number, error, onClose, onChangeNumber, onSubmit }: TableFormProps) {
    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <h2 className="text-lg font-semibold text-slate-900">Tambah Meja</h2>
                <p className="mt-1 text-sm text-slate-600">Masukkan nomor meja baru.</p>

                <div className="mt-4">
                    <label className="mb-1 block text-sm font-medium text-slate-800" htmlFor="table-number">
                        Nomor meja
                    </label>
                    <input
                        id="table-number"
                        type="number"
                        min={1}
                        value={number}
                        onChange={(event) => onChangeNumber(event.target.value)}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                    />
                    {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        disabled={processing}
                        onClick={onSubmit}
                        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>
            </div>
        </div>
    );
}
