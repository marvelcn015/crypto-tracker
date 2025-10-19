import { io, Socket } from 'socket.io-client';
import type { WebSocketMessage, PriceUpdateMessage, AlertTriggeredMessage } from '../types';

type MessageHandler = (data: any) => void;

class SocketService {
    private socket: Socket | null = null;
    private handlers: Map<string, MessageHandler[]> = new Map();
    private url: string;

    constructor(url: string) {
        this.url = url;
    }

    /**
     * 連接 Socket.io
     */
    connect(): void {
        if (this.socket?.connected) {
            console.log('Socket already connected');
            return;
        }

        this.socket = io(this.url, {
            transports: ['websocket', 'polling'], // WebSocket 優先，失敗時 fallback 到 polling
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 3000,
            autoConnect: true,
        });

        this.setupEventHandlers();
    }

    /**
     * 設定事件監聽器
     */
    private setupEventHandlers(): void {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log('✅ Socket.io connected:', this.socket?.id);
            this.triggerHandlers('connection_established', { connected: true });
        });

        this.socket.on('disconnect', (reason) => {
            console.log('🔌 Socket.io disconnected:', reason);
        });

        this.socket.on('reconnect', (attemptNumber) => {
            console.log('🔄 Socket.io reconnected after', attemptNumber, 'attempts');
        });

        this.socket.on('reconnect_failed', () => {
            console.error('❌ Socket.io reconnection failed');
        });

        this.socket.on('connect_error', (error) => {
            console.error('❌ Socket.io connection error:', error.message);
        });

        this.socket.on('price_update', (data: PriceUpdateMessage) => {
            this.triggerHandlers('price_update', data);
        });

        this.socket.on('alert_triggered', (data: AlertTriggeredMessage) => {
            this.triggerHandlers('alert_triggered', data);
        });

        this.socket.on('price_batch_update', (data: PriceUpdateMessage[]) => {
            this.triggerHandlers('price_batch_update', data);
        });
    }

    /**
     * 訂閱特定事件
     */
    subscribe(event: string, handler: MessageHandler): () => void {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, []);
        }
        this.handlers.get(event)!.push(handler);

        // 返回取消訂閱函數
        return () => {
            const handlers = this.handlers.get(event);
            if (handlers) {
                const index = handlers.indexOf(handler);
                if (index > -1) {
                    handlers.splice(index, 1);
                }
            }
        };
    }

    /**
     * 觸發事件處理器
     */
    private triggerHandlers(event: string, data: any): void {
        const handlers = this.handlers.get(event);
        if (handlers) {
            handlers.forEach(handler => handler(data));
        }
    }

    /**
     * 發送訊息到後端
     */
    emit(event: string, data: any): void {
        if (this.socket?.connected) {
            this.socket.emit(event, data);
        } else {
            console.warn('Socket is not connected');
        }
    }

    /**
     * 加入房間（用於訂閱特定幣種）
     */
    joinRoom(room: string): void {
        this.emit('join', { room });
    }

    leaveRoom(room: string): void {
        this.emit('leave', { room });
    }

    subscribeToCrypto(cryptoId: string): void {
        this.joinRoom(`crypto:${cryptoId}`);
    }

    unsubscribeFromCrypto(cryptoId: string): void {
        this.leaveRoom(`crypto:${cryptoId}`);
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        this.handlers.clear();
    }

    isConnected(): boolean {
        return this.socket?.connected || false;
    }

    getSocketId(): string | undefined {
        return this.socket?.id;
    }
}

const socketService = new SocketService(
    import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000'
);

export default socketService;