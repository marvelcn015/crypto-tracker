import axios, { type AxiosInstance, AxiosError } from 'axios';
import type {
    Crypto,
    CryptoDetail,
    PriceHistory,
    Alert,
    CreateAlertRequest,
    Favorite,
    ApiResponse,
} from '../types';

class ApiService {
    private client: AxiosInstance;

    constructor(baseURL: string) {
        this.client = axios.create({
            baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // 回應攔截器 - 統一處理錯誤
        this.client.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                console.error('API Error:', error.response?.data || error.message);
                throw error;
            }
        );
    }

    // ==================== 加密貨幣相關 ====================

    async getCryptos(limit: number = 20): Promise<Crypto[]> {
        const response = await this.client.get<ApiResponse<Crypto[]>>('/cryptos', {
            params: { limit },
        });
        return response.data.data || [];
    }

    async getCryptoDetail(id: string): Promise<CryptoDetail> {
        const response = await this.client.get<ApiResponse<CryptoDetail>>(`/cryptos/${id}`);
        if (!response.data.data) {
            throw new Error('Crypto not found');
        }
        return response.data.data;
    }

    async getCryptoHistory(id: string, days: number = 7): Promise<PriceHistory> {
        const response = await this.client.get<ApiResponse<PriceHistory>>(
            `/cryptos/${id}/history`,
            { params: { days } }
        );
        if (!response.data.data) {
            throw new Error('History not found');
        }
        return response.data.data;
    }

    // ==================== 警報相關 ====================

    async getAlerts(status?: string): Promise<Alert[]> {
        const response = await this.client.get<ApiResponse<Alert[]>>('/alerts', {
            params: status ? { status } : {},
        });
        return response.data.data || [];
    }

    async createAlert(alert: CreateAlertRequest): Promise<Alert> {
        const response = await this.client.post<ApiResponse<Alert>>('/alerts', alert);
        if (!response.data.data) {
            throw new Error('Failed to create alert');
        }
        return response.data.data;
    }

    async deleteAlert(id: string): Promise<void> {
        await this.client.delete(`/alerts/${id}`);
    }

    // ==================== 收藏相關 ====================

    async getFavorites(): Promise<Favorite[]> {
        const response = await this.client.get<ApiResponse<Favorite[]>>('/favorites');
        return response.data.data || [];
    }

    async addFavorite(cryptoId: string): Promise<void> {
        await this.client.post('/favorites', { crypto_id: cryptoId });
    }

    async removeFavorite(cryptoId: string): Promise<void> {
        await this.client.delete(`/favorites/${cryptoId}`);
    }

    // ==================== 健康檢查 ====================

    async healthCheck(): Promise<boolean> {
        try {
            const response = await this.client.get('/health');
            return response.data.status === 'healthy';
        } catch {
            return false;
        }
    }
}

const api = new ApiService(
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'
);

export default api;