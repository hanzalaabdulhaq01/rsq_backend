import { IsString, IsUUID, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChatMessageType } from '@prisma/client';

export class SendMessageDto {
  @ApiProperty({ description: 'Ride request ID' })
  @IsUUID()
  rideRequestId: string;

  @ApiProperty({ description: 'Receiver user ID' })
  @IsUUID()
  receiverId: string;

  @ApiProperty({ example: 'Patient is conscious and breathing' })
  @IsString()
  message: string;

  @ApiPropertyOptional({ enum: ChatMessageType, default: ChatMessageType.TEXT })
  @IsOptional()
  @IsEnum(ChatMessageType)
  messageType?: ChatMessageType;
}
