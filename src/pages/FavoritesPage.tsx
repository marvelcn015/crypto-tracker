import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CryptoCard from '../components/CryptoCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useFavorites } from '../hooks/useFavorites';
import type { Crypto } from '../types';
import api from '../services/api';

const FavoritesPage: React.FC = () => {
    const navigate = useNavigate();
    const { favorites, toggleFavorite, isFavorite, loading: favoritesLoading } = useFavorites();
    const [cryptos, setCryptos] = useState<Crypto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchFavoriteCryptos();
    }, [favorites]);

    const fetchFavoriteCryptos = async () => {
        if (favorites.size === 0) {
            setCryptos([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // 取得所有加密貨幣資料
            const allCryptos = await api.getCryptos(100);

            // 過濾出收藏的
            const favoriteCryptos = allCryptos.filter(crypto =>
                favorites.has(crypto.id)
            );

            setCryptos(favoriteCryptos);
        } catch (err) {
            setError('Failed to load favorite cryptocurrencies');
            console.error('Error fetching favorite cryptos:', err);
        } finally {
            setLoading(false);
        }
    };

    if (favoritesLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner size="lg" message="Loading favorites..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 頭部 */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Favorites</h1>
                                <p className="text-sm text-gray-500">
                                    {cryptos.length} {cryptos.length === 1 ? 'cryptocurrency' : 'cryptocurrencies'}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/')}
                            className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                            Browse All
                        </button>
                    </div>
                </div>
            </header>

            {/* 內容 */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                        <p className="font-medium">Error loading favorites</p>
                        <p className="text-sm">{error}</p>
                    </div>
                ) : cryptos.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-lg shadow-md">
                        <Star className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-xl mb-2">No favorites yet</p>
                        <p className="text-gray-400 mb-6">
                            Start adding cryptocurrencies to your favorites list
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="btn-primary"
                        >
                            Browse Cryptocurrencies
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {cryptos.map((crypto) => (
                            <CryptoCard
                                key={crypto.id}
                                crypto={crypto}
                                isFavorite={isFavorite(crypto.id)}
                                onFavoriteToggle={toggleFavorite}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default FavoritesPage;