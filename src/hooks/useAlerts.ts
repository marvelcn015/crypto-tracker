import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import type { Alert, AlertStatus } from '../types';
import { useAlertTriggers } from './useWebSocket';

export const useAlerts = (statusFilter?: AlertStatus) => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 載入警報
    const fetchAlerts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.getAlerts(statusFilter);
            setAlerts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch alerts');
            console.error('Error fetching alerts:', err);
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => {
        fetchAlerts();
    }, [fetchAlerts]);

    // WebSocket: 警報觸發通知
    useAlertTriggers(useCallback((data) => {
        // 更新警報狀態
        setAlerts(prevAlerts =>
            prevAlerts.map(alert =>
                alert.id === data.alert_id
                    ? {
                        ...alert,
                        status: 'triggered' as AlertStatus,
                        triggered_price: data.triggered_price,
                        triggered_at: new Date().toISOString(),
                    }
                    : alert
            )
        );

        // 顯示通知（可選）
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Price Alert Triggered!', {
                body: `${data.crypto_id} reached $${data.triggered_price}`,
                icon: '/favicon.ico',
            });
        }
    }, []));

    // 刪除警報
    const deleteAlert = useCallback(async (id: string) => {
        try {
            await api.deleteAlert(id);
            setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
        } catch (err) {
            console.error('Error deleting alert:', err);
            throw err;
        }
    }, []);

    // 重新載入
    const refresh = useCallback(() => {
        fetchAlerts();
    }, [fetchAlerts]);

    return {
        alerts,
        loading,
        error,
        deleteAlert,
        refresh,
    };
};