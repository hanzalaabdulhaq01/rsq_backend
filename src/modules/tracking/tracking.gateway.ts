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
import { TrackingService } from './tracking.service';

@WebSocketGateway({
  namespace: '/tracking',
  cors: { origin: '*' },
})
export class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly trackingService: TrackingService) {}

  handleConnection(client: Socket) {
    console.log(`Tracking client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Tracking client disconnected: ${client.id}`);
  }

  @SubscribeMessage('updateLocation')
  async handleLocationUpdate(
    @MessageBody() data: { ambulanceId: string; lat: number; lng: number; rideRequestId?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const log = await this.trackingService.updateLocation(data);

    // Broadcast to all clients watching this ambulance
    this.server.emit(`location:${data.ambulanceId}`, {
      ambulanceId: data.ambulanceId,
      lat: data.lat,
      lng: data.lng,
      recordedAt: log.recordedAt,
    });

    // If ride-specific, also broadcast on ride channel
    if (data.rideRequestId) {
      this.server.emit(`ride:${data.rideRequestId}:location`, {
        ambulanceId: data.ambulanceId,
        lat: data.lat,
        lng: data.lng,
        recordedAt: log.recordedAt,
      });
    }

    return { event: 'locationUpdated', data: log };
  }

  @SubscribeMessage('subscribeToAmbulance')
  handleSubscribe(
    @MessageBody() data: { ambulanceId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`ambulance:${data.ambulanceId}`);
    return { event: 'subscribed', data: { ambulanceId: data.ambulanceId } };
  }

  @SubscribeMessage('subscribeToRide')
  handleSubscribeRide(
    @MessageBody() data: { rideRequestId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`ride:${data.rideRequestId}`);
    return { event: 'subscribed', data: { rideRequestId: data.rideRequestId } };
  }
}
