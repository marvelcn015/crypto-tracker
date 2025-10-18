import React, { useState, useMemo } from 'react';
import { RefreshCw, TrendingUp, Wifi, WifiOff } from 'lucide-react';
import CryptoCard from '../components/CryptoCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { useCryptos } from '../hooks/useCryptos';
import { useFavorites } from '../hooks/useFavorites';
import { useSocketConnection } from '../hooks/useWebSocket';
import type { SortOption, SortOrder } from '../types';

const Dashboard: React.FC = () => {
    const { cryptos, loading, error, refresh } = useCryptos();
    const { isFavorite, toggleFavorite } = useFavorites();
    const { isConnected } = useSocketConnection();

    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('market_cap');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [isRefreshing, setIsRefreshing] = useState(false);

    // 搜尋和排序邏輯
    const filteredAndSortedCryptos = useMemo(() => {
        let result = [...cryptos];

        // 搜尋過濾
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(crypto =>
                crypto.name.toLowerCase().includes(query) ||
                crypto.symbol.toLowerCase().includes(query)
            );
        }

        result.sort((a, b) => {
            let compareValue = 0;

            switch (sortBy) {
                case 'market_cap':
                    compareValue = a.market_cap - b.market_cap;
                    break;
                case 'price':
                    compareValue = a.current_price - b.current_price;
                    break;
                case 'change_24h':
                    compareValue = a.price_change_percentage_24h - b.price_change_percentage_24h;
                    break;
                case 'name':
                    compareValue = a.name.localeCompare(b.name);
                    break;
            }

            return sortOrder === 'asc' ? compareValue : -compareValue;
        });

        return result;
    }, [cryptos, searchQuery, sortBy, sortOrder]);

    // 手動重新整理
    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refresh();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    // 切換排序
    const handleSortChange = (newSortBy: SortOption) => {
        if (sortBy === newSortBy) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(newSortBy);
            setSortOrder('desc');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="w-8 h-8 text-primary-600" />
                            <h1 className="text-2xl font-bold text-gray-900">
                                Crypto Tracker
                            </h1>
                        </div>

                        {/* 連接狀態 */}
                        <div className="flex items-center gap-2">
                            {isConnected ? (
                                <div className="flex items-center gap-2 text-success text-sm">
                                    <Wifi className="w-4 h-4" />
                                    <span>Live</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <WifiOff className="w-4 h-4" />
                                    <span>Offline</span>
                                </div>
                            )}

                            <button
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                                aria-label="Refresh"
                            >
                                <RefreshCw className={`w-5 h-5 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* 搜尋和排序 */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <SearchBar
                            value={searchQuery}
                            onChange={setSearchQuery}
                        />

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleSortChange('market_cap')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${sortBy === 'market_cap'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                Market Cap
                            </button>
                            <button
                                onClick={() => handleSortChange('price')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${sortBy === 'price'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                Price
                            </button>
                            <button
                                onClick={() => handleSortChange('change_24h')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${sortBy === 'change_24h'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                24h Change
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* 內容 */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading && (
                    <LoadingSpinner size="lg" message="Loading cryptocurrencies..." />
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                        <p className="font-medium">Error loading data</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        {/* 結果統計 */}
                        <div className="mb-6">
                            <p className="text-gray-600">
                                Showing <span className="font-semibold">{filteredAndSortedCryptos.length}</span> of{' '}
                                <span className="font-semibold">{cryptos.length}</span> cryptocurrencies
                            </p>
                        </div>

                        {/* 加密貨幣網格 */}
                        {filteredAndSortedCryptos.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredAndSortedCryptos.map(crypto => (
                                    <CryptoCard
                                        key={crypto.id}
                                        crypto={crypto}
                                        isFavorite={isFavorite(crypto.id)}
                                        onFavoriteToggle={toggleFavorite}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No cryptocurrencies found</p>
                                <p className="text-gray-400 text-sm mt-2">Try adjusting your search</p>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default Dashboard;