import { IsOptional, IsNumber, IsInt, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDriverPerformanceDto {
  @ApiPropertyOptional({ example: 4.5, description: 'Rating (0-5)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({ example: 120, description: 'Average response time in seconds' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  averageResponseTime?: number;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @IsInt()
  @Min(0)
  totalRides?: number;
}
