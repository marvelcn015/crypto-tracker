import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import { formatPrice } from '../utils/formatters';

interface PriceChartProps {
    cryptoId: string;
}

interface ChartDataPoint {
    date: string;
    price: number;
    timestamp: number;
}

const PriceChart: React.FC<PriceChartProps> = ({ cryptoId }) => {
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [days, setDays] = useState<number>(7);

    useEffect(() => {
        fetchChartData();
    }, [cryptoId, days]);

    const fetchChartData = async () => {
        try {
            setLoading(true);
            setError(null);
            const history = await api.getCryptoHistory(cryptoId, days);

            // 格式化資料
            const formattedData = history.prices.map((point) => {
                const date = new Date(point.timestamp);
                return {
                    date: date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: days === 1 ? '2-digit' : undefined,
                        minute: days === 1 ? '2-digit' : undefined
                    }),
                    price: point.price,
                    timestamp: point.timestamp,
                };
            });

            setChartData(formattedData);
        } catch (err) {
            setError('Failed to load chart data');
            console.error('Error fetching chart data:', err);
        } finally {
            setLoading(false);
        }
    };

    const timeRanges = [
        { label: '24H', value: 1 },
        { label: '7D', value: 7 },
        { label: '30D', value: 30 },
        { label: '90D', value: 90 },
    ];

    // 自定義 Tooltip
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                    <p className="text-sm text-gray-600">{payload[0].payload.date}</p>
                    <p className="text-lg font-bold text-gray-900">
                        ${formatPrice(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    // 計算價格範圍
    const prices = chartData.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceChange = ((prices[prices.length - 1] - prices[0]) / prices[0]) * 100;
    const isPositive = priceChange >= 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-80">
                <LoadingSpinner size="lg" message="Loading chart..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-80">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* 時間範圍選擇器 */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                    {timeRanges.map((range) => (
                        <button
                            key={range.value}
                            onClick={() => setDays(range.value)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${days === range.value
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>

                {/* 價格統計 */}
                <div className="text-right">
                    <p className="text-sm text-gray-500">Period Change</p>
                    <p className={`text-lg font-bold ${isPositive ? 'text-success' : 'text-danger'}`}>
                        {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
                    </p>
                </div>
            </div>

            {/* 圖表 */}
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        tickMargin={10}
                    />
                    <YAxis
                        domain={[minPrice * 0.99, maxPrice * 1.01]}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        tickFormatter={(value) => `$${formatPrice(value, 0)}`}
                        width={80}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke={isPositive ? '#10b981' : '#ef4444'}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>

            {/* 價格範圍 */}
            <div className="flex justify-between mt-4 text-sm text-gray-600">
                <div>
                    <span className="font-medium">Low:</span> ${formatPrice(minPrice)}
                </div>
                <div>
                    <span className="font-medium">High:</span> ${formatPrice(maxPrice)}
                </div>
            </div>
        </div>
    );
};

export default PriceChart;