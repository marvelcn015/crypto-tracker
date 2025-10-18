import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useFavorites = () => {
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    const fetchFavorites = useCallback(async () => {
        try {
            setLoading(true);
            const data = await api.getFavorites();
            setFavorites(new Set(data.map(f => f.id)));
        } catch (err) {
            console.error('Error fetching favorites:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    const toggleFavorite = useCallback(async (cryptoId: string) => {
        const isFavorite = favorites.has(cryptoId);

        // 採用樂觀更新 (Optimistic Updates)
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (isFavorite) {
                newFavorites.delete(cryptoId);
            } else {
                newFavorites.add(cryptoId);
            }
            return newFavorites;
        });

        try {
            if (isFavorite) {
                await api.removeFavorite(cryptoId);
            } else {
                await api.addFavorite(cryptoId);
            }
        } catch (err) {
            console.error('Error toggling favorite:', err);
            // 錯誤時回復
            setFavorites(prev => {
                const newFavorites = new Set(prev);
                if (isFavorite) {
                    newFavorites.add(cryptoId);
                } else {
                    newFavorites.delete(cryptoId);
                }
                return newFavorites;
            });
        }
    }, [favorites]);

    const isFavorite = useCallback((cryptoId: string) => {
        return favorites.has(cryptoId);
    }, [favorites]);

    return {
        favorites,
        loading,
        toggleFavorite,
        isFavorite,
        refresh: fetchFavorites,
    };
};