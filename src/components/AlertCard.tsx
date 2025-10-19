import React from 'react';
import { Trash2, ArrowUp, ArrowDown, Clock, CheckCircle } from 'lucide-react';
import type { Alert } from '../types';
import { formatPrice, formatRelativeTime } from '../utils/formatters';

interface AlertCardProps {
    alert: Alert;
    onDelete: (id: string) => void;
}

const AlertCard: React.FC<AlertCardProps> = ({ alert, onDelete }) => {
    const getStatusBadge = () => {
        switch (alert.status) {
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        <Clock className="w-3 h-3" />
                        Pending
                    </span>
                );
            case 'triggered':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3" />
                        Triggered
                    </span>
                );
            case 'deleted':
                return (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        Deleted
                    </span>
                );
        }
    };

    const isPending = alert.status === 'pending';
    const currentPrice = alert.current_price;
    const targetMet = currentPrice !== undefined && (
        (alert.condition === 'above' && currentPrice >= alert.target_price) ||
        (alert.condition === 'below' && currentPrice <= alert.target_price)
    );

    return (
        <div className={`card ${alert.status === 'triggered' ? 'border-2 border-green-200' : ''}`}>
            {/* 頭部 */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${alert.condition === 'above'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                        }`}>
                        {alert.condition === 'above' ? (
                            <ArrowUp className="w-5 h-5" />
                        ) : (
                            <ArrowDown className="w-5 h-5" />
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">
                            {alert.crypto_name}
                        </h3>
                        <p className="text-sm text-gray-500 uppercase">
                            {alert.crypto_symbol}
                        </p>
                    </div>
                </div>

                {getStatusBadge()}
            </div>

            {/* 價格資訊 */}
            <div className="mb-3 space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Target Price:</span>
                    <span className="text-lg font-bold text-gray-900">
                        ${formatPrice(alert.target_price)}
                    </span>
                </div>

                {currentPrice !== undefined && (
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Current Price:</span>
                        <span className={`text-lg font-bold ${targetMet ? 'text-green-600' : 'text-gray-900'
                            }`}>
                            ${formatPrice(currentPrice)}
                        </span>
                    </div>
                )}

                {alert.triggered_price !== undefined && (
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Triggered at:</span>
                        <span className="text-lg font-bold text-green-600">
                            ${formatPrice(alert.triggered_price)}
                        </span>
                    </div>
                )}
            </div>

            {/* 條件 */}
            <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                    Alert when price goes{' '}
                    <span className="font-semibold text-gray-900">
                        {alert.condition}
                    </span>{' '}
                    ${formatPrice(alert.target_price)}
                </p>
            </div>

            {/* 備註 */}
            {alert.note && (
                <div className="mb-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-sm text-blue-900">{alert.note}</p>
                </div>
            )}

            {/* 底部 */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                    {alert.triggered_at ? (
                        <span>Triggered {formatRelativeTime(alert.triggered_at)}</span>
                    ) : (
                        <span>Created {formatRelativeTime(alert.created_at)}</span>
                    )}
                </div>

                <button
                    onClick={() => onDelete(alert.id)}
                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                    aria-label="Delete alert"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* 接近目標提示 */}
            {isPending && currentPrice !== undefined && !targetMet && (
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-100 rounded-lg">
                    <p className="text-xs text-yellow-800">
                        {alert.condition === 'above'
                            ? `${((alert.target_price - currentPrice) / currentPrice * 100).toFixed(2)}% away from target`
                            : `${((currentPrice - alert.target_price) / currentPrice * 100).toFixed(2)}% away from target`
                        }
                    </p>
                </div>
            )}
        </div>
    );
};

export default AlertCard;