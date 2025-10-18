import { useEffect, useState } from 'react';
import socketService from '../services/websocket';
import type { PriceUpdateMessage, AlertTriggeredMessage } from '../types';

/**
 * WebSocket 連接狀態 Hook
 */
export const useSocketConnection = () => {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        socketService.connect();

        const unsubscribe = socketService.subscribe('connection_established', () => {
            setIsConnected(true);
        });

        setIsConnected(socketService.isConnected());

        return () => {
            unsubscribe();
            // 不在這裡 disconnect，因為其他組件可能還在使用
        };
    }, []);

    return { isConnected };
};

/**
 * 價格更新 Hook
 */
export const usePriceUpdates = (onUpdate: (data: PriceUpdateMessage) => void) => {
    useEffect(() => {
        const unsubscribe = socketService.subscribe('price_update', onUpdate);
        return unsubscribe;
    }, [onUpdate]);
};

/**
 * 批量價格更新 Hook
 */
export const useBatchPriceUpdates = (onUpdate: (data: PriceUpdateMessage[]) => void) => {
    useEffect(() => {
        const unsubscribe = socketService.subscribe('price_batch_update', onUpdate);
        return unsubscribe;
    }, [onUpdate]);
};

/**
 * 警報觸發 Hook
 */
export const useAlertTriggers = (onTrigger: (data: AlertTriggeredMessage) => void) => {
    useEffect(() => {
        const unsubscribe = socketService.subscribe('alert_triggered', onTrigger);
        return unsubscribe;
    }, [onTrigger]);
};

/**
 * 訂閱特定加密貨幣 Hook
 */
export const useCryptoSubscription = (cryptoId: string | null) => {
    useEffect(() => {
        if (!cryptoId) return;

        socketService.subscribeToCrypto(cryptoId);

        return () => {
            socketService.unsubscribeFromCrypto(cryptoId);
        };
    }, [cryptoId]);
};