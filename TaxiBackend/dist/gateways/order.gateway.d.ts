import { Server, Socket } from 'socket.io';
export declare class OrderGateway {
    server: Server;
    handleOrderSubscribe(orderId: string, client: Socket): void;
    updateOrderStatus(orderId: string, status: string): void;
}
