import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import type { Crypto } from '../types';
import { useBatchPriceUpdates } from './useWebSocket';

export const useCryptos = () => {
    const [cryptos, setCryptos] = useState<Crypto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCryptos = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.getCryptos(20);
            setCryptos(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch cryptocurrencies');
            console.error('Error fetching cryptos:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCryptos();
    }, [fetchCryptos]);

    useBatchPriceUpdates(useCallback((updates) => {
        setCryptos(prevCryptos =>
            prevCryptos.map(crypto => {
                const update = updates.find(u => u.crypto_id === crypto.id);
                if (update) {
                    return {
                        ...crypto,
                        current_price: update.price,
                        price_change_percentage_24h: update.change_24h,
                    };
                }
                return crypto;
            })
        );
    }, []));

    const refresh = useCallback(() => {
        fetchCryptos();
    }, [fetchCryptos]);

    return {
        cryptos,
        loading,
        error,
        refresh,
    };
};