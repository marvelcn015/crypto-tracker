/**
 * 格式化價格
 * @param price 價格
 * @param decimals 小數位數
 */
export const formatPrice = (price: number, decimals: number = 2): string => {
    if (price >= 1) {
        return price.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        });
    }
    // 小於 1 的價格顯示更多小數位
    return price.toLocaleString('en-US', {
        minimumFractionDigits: 4,
        maximumFractionDigits: 6,
    });
};

/**
 * 格式化市值
 * @param marketCap 市值
 */
export const formatMarketCap = (marketCap: number): string => {
    if (marketCap >= 1_000_000_000_000) {
        return `$${(marketCap / 1_000_000_000_000).toFixed(2)}T`;
    }
    if (marketCap >= 1_000_000_000) {
        return `$${(marketCap / 1_000_000_000).toFixed(2)}B`;
    }
    if (marketCap >= 1_000_000) {
        return `$${(marketCap / 1_000_000).toFixed(2)}M`;
    }
    return `$${marketCap.toLocaleString()}`;
};

/**
 * 格式化百分比變化
 * @param change 變化百分比
 */
export const formatPercentage = (change: number): string => {
    const prefix = change >= 0 ? '+' : '';
    return `${prefix}${change.toFixed(2)}%`;
};

/**
 * 取得百分比變化的顏色 class
 * @param change 變化百分比
 */
export const getChangeColor = (change: number): string => {
    return change >= 0 ? 'text-success' : 'text-danger';
};

/**
 * 格式化時間為相對時間
 * @param timestamp ISO 時間戳
 */
export const formatRelativeTime = (timestamp: string): string => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return `${diffInSeconds}s ago`;
    }
    if (diffInSeconds < 3600) {
        return `${Math.floor(diffInSeconds / 60)}m ago`;
    }
    if (diffInSeconds < 86400) {
        return `${Math.floor(diffInSeconds / 3600)}h ago`;
    }
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

/**
 * 截斷長文字
 * @param text 文字
 * @param maxLength 最大長度
 */
export const truncateText = (text: string, maxLength: number = 50): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};

/**
 * 驗證價格輸入
 * @param price 價格字串
 */
export const validatePrice = (price: string): boolean => {
    const priceNum = parseFloat(price);
    return !isNaN(priceNum) && priceNum > 0;
};