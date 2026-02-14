import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from './chats.service';

@WebSocketGateway({
  namespace: '/chat',
  cors: { origin: '*' },
})
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatsService: ChatsService) {}

  handleConnection(client: Socket) {
    console.log(`Chat client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Chat client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRide')
  handleJoinRide(
    @MessageBody() data: { rideRequestId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`ride-chat:${data.rideRequestId}`);
    return { event: 'joinedRide', data: { rideRequestId: data.rideRequestId } };
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    data: {
      senderId: string;
      receiverId: string;
      rideRequestId: string;
      message: string;
      messageType?: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const chat = await this.chatsService.sendMessage(data.senderId, {
      rideRequestId: data.rideRequestId,
      receiverId: data.receiverId,
      message: data.message,
      messageType: data.messageType as any,
    });

    // Broadcast to all users in the ride chat room
    this.server
      .to(`ride-chat:${data.rideRequestId}`)
      .emit('newMessage', chat);

    return { event: 'messageSent', data: chat };
  }
}
