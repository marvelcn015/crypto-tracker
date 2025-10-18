import React from 'react';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Crypto } from '../types';
import { formatPrice, formatMarketCap, formatPercentage, getChangeColor } from '../utils/formatters';

interface CryptoCardProps {
    crypto: Crypto;
    isFavorite?: boolean;
    onFavoriteToggle?: (cryptoId: string) => void;
}

const CryptoCard: React.FC<CryptoCardProps> = ({
    crypto,
    isFavorite = false,
    onFavoriteToggle
}) => {
    const navigate = useNavigate();
    const isPositive = crypto.price_change_percentage_24h >= 0;

    const handleCardClick = () => {
        navigate(`/crypto/${crypto.id}`);
    };

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // 防止觸發卡片點擊
        onFavoriteToggle?.(crypto.id);
    };

    return (
        <div
            onClick={handleCardClick}
            className="card cursor-pointer hover:scale-[1.02] transition-all duration-200"
        >
            {/* Head：圖示、名稱、收藏按鈕 */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <img
                        src={crypto.image}
                        alt={crypto.name}
                        className="w-10 h-10 rounded-full"
                    />
                    <div>
                        <h3 className="font-semibold text-gray-900">{crypto.name}</h3>
                        <p className="text-sm text-gray-500 uppercase">{crypto.symbol}</p>
                    </div>
                </div>

                {onFavoriteToggle && (
                    <button
                        onClick={handleFavoriteClick}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        <Star
                            className={`w-5 h-5 ${isFavorite
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-400'
                                }`}
                        />
                    </button>
                )}
            </div>

            {/* 價格 */}
            <div className="mb-3">
                <p className="text-2xl font-bold text-gray-900">
                    ${formatPrice(crypto.current_price)}
                </p>
            </div>

            {/* 24小時變化 */}
            <div className="flex items-center justify-between">
                <div className={`flex items-center gap-1 ${getChangeColor(crypto.price_change_percentage_24h)}`}>
                    {isPositive ? (
                        <TrendingUp className="w-4 h-4" />
                    ) : (
                        <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="font-medium">
                        {formatPercentage(crypto.price_change_percentage_24h)}
                    </span>
                </div>

                <div className="text-right">
                    <p className="text-xs text-gray-500">Market Cap</p>
                    <p className="text-sm font-medium text-gray-700">
                        {formatMarketCap(crypto.market_cap)}
                    </p>
                </div>
            </div>

            {/* 排名標籤 */}
            {crypto.market_cap_rank && crypto.market_cap_rank <= 10 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                        #{crypto.market_cap_rank} by Market Cap
                    </span>
                </div>
            )}
        </div>
    );
};

export default CryptoCard;