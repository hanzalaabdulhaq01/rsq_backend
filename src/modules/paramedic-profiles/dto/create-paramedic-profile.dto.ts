import { IsUUID, IsOptional, IsInt, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateParamedicProfileDto {
  @ApiProperty({ description: 'User ID (must have PARAMEDIC role)' })
  @IsUUID()
  userId: string;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsInt()
  @Min(0)
  experienceYears?: number;

  @ApiPropertyOptional({ example: 'Certified in advanced trauma care' })
  @IsOptional()
  @IsString()
  notes?: string;
}
