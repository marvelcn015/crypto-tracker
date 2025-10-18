// ==================== 基礎類型 ====================

export interface Crypto {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    price_change_percentage_24h: number;
    high_24h: number;
    low_24h: number;
    image: string;
    last_updated: string;
}

export interface CryptoDetail extends Crypto {
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    description?: string;
    circulating_supply?: number;
    total_supply?: number;
}

export interface PricePoint {
    timestamp: string;
    price: number;
}

export interface PriceHistory {
    crypto_id: string;
    days: number;
    prices: PricePoint[];
}

// ==================== 警報類型 ====================

export type AlertCondition = 'above' | 'below';
export type AlertStatus = 'pending' | 'triggered' | 'deleted';

export interface Alert {
    id: string;
    crypto_id: string;
    crypto_name: string;
    crypto_symbol: string;
    current_price?: number;
    target_price: number;
    condition: AlertCondition;
    status: AlertStatus;
    note?: string;
    created_at: string;
    triggered_at?: string;
    triggered_price?: number;
}

export interface CreateAlertRequest {
    crypto_id: string;
    target_price: number;
    condition: AlertCondition;
    note?: string;
}

// ==================== 收藏類型 ====================

export interface Favorite {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    price_change_percentage_24h: number;
    added_at: string;
}

// ==================== API 回應類型 ====================

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
    message?: string;
    timestamp?: string;
}

// ==================== WebSocket 訊息類型 ====================

export type WebSocketMessageType =
    | 'price_update'
    | 'alert_triggered'
    | 'connection_established'
    | 'error';

export interface WebSocketMessage {
    type: WebSocketMessageType;
    data: any;
    timestamp: string;
}

export interface PriceUpdateMessage {
    crypto_id: string;
    price: number;
    change_24h: number;
}

export interface AlertTriggeredMessage {
    alert_id: string;
    crypto_id: string;
    triggered_price: number;
    target_price: number;
    condition: AlertCondition;
}

// ==================== UI 狀態類型 ====================

export interface LoadingState {
    isLoading: boolean;
    error: string | null;
}

export type SortOption = 'market_cap' | 'price' | 'change_24h' | 'name';
export type SortOrder = 'asc' | 'desc';