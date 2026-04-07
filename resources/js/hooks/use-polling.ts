import { useEffect, useRef } from 'react';

type PollingOptions = {
    enabled?: boolean;
    immediate?: boolean;
};

export function usePolling(callback: () => void | Promise<void>, intervalMs: number, options: PollingOptions = {}) {
    const { enabled = true, immediate = true } = options;
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        if (!enabled || intervalMs <= 0) {
            return;
        }

        if (immediate) {
            void callbackRef.current();
        }

        const timerId = window.setInterval(() => {
            void callbackRef.current();
        }, intervalMs);

        return () => {
            window.clearInterval(timerId);
        };
    }, [enabled, immediate, intervalMs]);
}
