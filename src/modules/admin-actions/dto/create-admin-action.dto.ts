import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAdminActionDto {
  @ApiProperty({ example: 'DISABLE_USER', description: 'Action performed' })
  @IsString()
  action: string;

  @ApiPropertyOptional({ description: 'Target entity ID' })
  @IsOptional()
  @IsUUID()
  targetId?: string;

  @ApiPropertyOptional({ example: { reason: 'Violation of TOS' }, description: 'Extra metadata' })
  @IsOptional()
  metadata?: any;
}
