import { IsString, IsOptional, IsUUID, IsNumber, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHospitalDto {
  @ApiProperty({ example: 'Aga Khan University Hospital' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional({ example: 'Stadium Road, Karachi' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '+922134930051' })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({ example: 24.8918 })
  @IsOptional()
  @IsNumber()
  locationLat?: number;

  @ApiPropertyOptional({ example: 67.0747 })
  @IsOptional()
  @IsNumber()
  locationLng?: number;

  @ApiProperty({ description: 'Organization ID this hospital belongs to' })
  @IsUUID()
  organizationId: string;
}
