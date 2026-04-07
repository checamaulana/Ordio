type QrCodeModalProps = {
    open: boolean;
    tableNumber: number | null;
    qrCodeUrl: string;
    downloadUrl: string;
    onClose: () => void;
};

export function QrCodeModal({ open, tableNumber, qrCodeUrl, downloadUrl, onClose }: QrCodeModalProps) {
    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-lg">
                <h2 className="text-lg font-semibold text-slate-900">QR Meja {tableNumber}</h2>
                <p className="mt-1 text-sm text-slate-600">Scan QR ini untuk membuka menu pelanggan.</p>

                <div className="mt-4 rounded-md border border-slate-200 p-4">
                    <img src={qrCodeUrl} alt={`QR meja ${tableNumber}`} className="mx-auto w-64 max-w-full" />
                </div>

                <div className="mt-6 flex justify-center gap-2">
                    <a
                        href={downloadUrl}
                        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                    >
                        Download QR
                    </a>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
