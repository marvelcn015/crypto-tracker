import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Bell, TrendingUp, TrendingDown } from 'lucide-react';
import PriceChart from '../components/PriceChart';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import { useFavorites } from '../hooks/useFavorites';
import { usePriceUpdates } from '../hooks/useWebSocket';
import type { CryptoDetail as CryptoDetailType } from '../types';
import { formatPrice, formatMarketCap, formatPercentage, getChangeColor } from '../utils/formatters';

const CryptoDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isFavorite, toggleFavorite } = useFavorites();

    const [crypto, setCrypto] = useState<CryptoDetailType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAlertForm, setShowAlertForm] = useState(false);

    // 載入加密貨幣詳情
    const fetchCryptoDetail = useCallback(async () => {
        if (!id) return;

        try {
            setLoading(true);
            setError(null);
            const data = await api.getCryptoDetail(id);
            setCrypto(data);
        } catch (err) {
            setError('Failed to load cryptocurrency details');
            console.error('Error fetching crypto detail:', err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchCryptoDetail();
    }, [fetchCryptoDetail]);

    // WebSocket 即時價格更新
    usePriceUpdates(useCallback((data) => {
        if (crypto && data.crypto_id === crypto.id) {
            setCrypto(prev => prev ? {
                ...prev,
                current_price: data.price,
                price_change_percentage_24h: data.change_24h,
            } : null);
        }
    }, [crypto]));

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner size="lg" message="Loading details..." />
            </div>
        );
    }

    if (error || !crypto) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error || 'Cryptocurrency not found'}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="btn-primary"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    const isPositive = crypto.price_change_percentage_24h >= 0;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 頭部 */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back</span>
                        </button>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowAlertForm(!showAlertForm)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                aria-label="Create alert"
                            >
                                <Bell className="w-5 h-5 text-gray-600" />
                            </button>

                            <button
                                onClick={() => toggleFavorite(crypto.id)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                aria-label={isFavorite(crypto.id) ? 'Remove from favorites' : 'Add to favorites'}
                            >
                                <Star
                                    className={`w-5 h-5 ${isFavorite(crypto.id)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-400'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* 內容 */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* 基本資訊 */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <img
                                src={crypto.image}
                                alt={crypto.name}
                                className="w-16 h-16 rounded-full"
                            />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{crypto.name}</h1>
                                <p className="text-lg text-gray-500 uppercase">{crypto.symbol}</p>
                            </div>
                        </div>

                        {crypto.market_cap_rank && (
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-700">
                                Rank #{crypto.market_cap_rank}
                            </span>
                        )}
                    </div>

                    {/* 價格資訊 */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Current Price</p>
                            <p className="text-4xl font-bold text-gray-900">
                                ${formatPrice(crypto.current_price)}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 mb-1">24h Change</p>
                            <div className={`flex items-center gap-2 ${getChangeColor(crypto.price_change_percentage_24h)}`}>
                                {isPositive ? (
                                    <TrendingUp className="w-6 h-6" />
                                ) : (
                                    <TrendingDown className="w-6 h-6" />
                                )}
                                <span className="text-2xl font-bold">
                                    {formatPercentage(crypto.price_change_percentage_24h)}
                                </span>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 mb-1">Market Cap</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatMarketCap(crypto.market_cap)}
                            </p>
                        </div>
                    </div>

                    {/* 24h 高低 */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">24h High</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    ${formatPrice(crypto.high_24h)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">24h Low</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    ${formatPrice(crypto.low_24h)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 其他價格變化 */}
                    {(crypto.price_change_percentage_7d || crypto.price_change_percentage_30d) && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-500 mb-3">Price Changes</p>
                            <div className="grid grid-cols-2 gap-4">
                                {crypto.price_change_percentage_7d && (
                                    <div>
                                        <p className="text-sm text-gray-600">7 Days</p>
                                        <p className={`text-lg font-semibold ${getChangeColor(crypto.price_change_percentage_7d)}`}>
                                            {formatPercentage(crypto.price_change_percentage_7d)}
                                        </p>
                                    </div>
                                )}
                                {crypto.price_change_percentage_30d && (
                                    <div>
                                        <p className="text-sm text-gray-600">30 Days</p>
                                        <p className={`text-lg font-semibold ${getChangeColor(crypto.price_change_percentage_30d)}`}>
                                            {formatPercentage(crypto.price_change_percentage_30d)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* 價格圖表 */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Price Chart</h2>
                    <PriceChart cryptoId={crypto.id} />
                </div>

                {/* 描述 */}
                {crypto.description && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">About {crypto.name}</h2>
                        <div
                            className="text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: crypto.description }}
                        />
                    </div>
                )}

                {/* 簡易警報表單（臨時，之後會改進） */}
                {showAlertForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                            <h3 className="text-lg font-bold mb-4">Create Alert</h3>
                            <p className="text-gray-600 mb-4">
                                Go to the Alerts page to create a new alert for {crypto.name}.
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigate('/alerts')}
                                    className="btn-primary flex-1"
                                >
                                    Go to Alerts
                                </button>
                                <button
                                    onClick={() => setShowAlertForm(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CryptoDetail;