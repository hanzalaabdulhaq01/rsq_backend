import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  MinLength,
  IsBoolean,
  Matches,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional({ example: 'john@example.com' })
  @ValidateIf((o) => !o.phone)
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @ApiPropertyOptional({ example: '+923001234567' })
  @ValidateIf((o) => !o.email)
  @IsString({ message: 'Please provide a valid phone number' })
  @Matches(/^\+923\d{9}$/, {
    message: 'Phone number must be a valid Pakistani mobile number (e.g. +923001234567)',
  })
  phone?: string;

  @ApiProperty({ example: 'StrongP@ss1', minLength: 8 })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @ApiPropertyOptional({ enum: Role, default: Role.USER })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  verified?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
