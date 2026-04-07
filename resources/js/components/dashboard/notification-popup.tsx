import type { NotificationItem } from '@/hooks/use-notification';

type NotificationPopupProps = {
    notifications: NotificationItem[];
    onDismiss: (id: number) => void;
};

const STYLE_MAP: Record<NotificationItem['type'], string> = {
    info: 'border-sky-200 bg-sky-50 text-sky-700',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    warning: 'border-amber-200 bg-amber-50 text-amber-700',
};

export function NotificationPopup({ notifications, onDismiss }: NotificationPopupProps) {
    if (notifications.length === 0) {
        return null;
    }

    return (
        <div className="fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-2">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`rounded-md border px-4 py-3 text-sm shadow ${STYLE_MAP[notification.type]}`}
                >
                    <div className="flex items-start justify-between gap-3">
                        <p>{notification.message}</p>
                        <button
                            type="button"
                            onClick={() => onDismiss(notification.id)}
                            className="text-xs font-semibold opacity-70 transition hover:opacity-100"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
