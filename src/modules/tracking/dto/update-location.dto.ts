import { IsNumber, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLocationDto {
  @ApiProperty({ description: 'Ambulance ID' })
  @IsUUID()
  ambulanceId: string;

  @ApiProperty({ example: 24.8607 })
  @IsNumber()
  lat: number;

  @ApiProperty({ example: 67.0011 })
  @IsNumber()
  lng: number;

  @ApiPropertyOptional({ description: 'Active ride request ID' })
  @IsOptional()
  @IsUUID()
  rideRequestId?: string;
}
