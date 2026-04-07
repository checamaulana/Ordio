import { useCallback, useMemo, useState } from 'react';

export type NotificationItem = {
    id: number;
    message: string;
    type: 'info' | 'success' | 'warning';
};

let notificationCounter = 0;

export function useNotification() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);

    const dismissNotification = useCallback((id: number) => {
        setNotifications((current) => current.filter((item) => item.id !== id));
    }, []);

    const playNotificationSound = useCallback(() => {
        if (typeof window === 'undefined') {
            return;
        }

        try {
            const AudioContextConstructor = window.AudioContext;
            if (!AudioContextConstructor) {
                return;
            }

            const context = new AudioContextConstructor();
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(context.destination);
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(880, context.currentTime);
            gainNode.gain.setValueAtTime(0.001, context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.1, context.currentTime + 0.03);
            gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.25);

            oscillator.start();
            oscillator.stop(context.currentTime + 0.25);

            window.setTimeout(() => {
                void context.close();
            }, 350);
        } catch {
            // Browser mungkin memblokir autoplay audio, abaikan error.
        }
    }, []);

    const notify = useCallback(
        (message: string, type: NotificationItem['type'] = 'info', durationMs = 4500) => {
            notificationCounter += 1;
            const id = notificationCounter;

            setNotifications((current) => [...current, { id, message, type }]);

            window.setTimeout(() => {
                setNotifications((current) => current.filter((item) => item.id !== id));
            }, durationMs);

            playNotificationSound();
        },
        [playNotificationSound],
    );

    return useMemo(
        () => ({
            notifications,
            notify,
            dismissNotification,
        }),
        [dismissNotification, notifications, notify],
    );
}
