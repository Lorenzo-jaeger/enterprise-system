import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Software Engineer', required: false })
  @IsOptional()
  @IsString()
  jobTitle?: string;

  @ApiProperty({ example: 'SP', required: false })
  @IsOptional()
  @IsString()
  branch?: string;

  @ApiProperty({ example: '+55 11 99999-9999', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'GPTW, PMP', required: false })
  @IsOptional()
  @IsString()
  certifications?: string;

  @ApiProperty({ example: 'https://github.com/shadcn.png', required: false })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiProperty({ example: 'https://example.com/bg.png', required: false })
  @IsOptional()
  @IsString()
  signatureBackgroundUrl?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  roles?: string[]; // Array of Role Names e.g. ["admin", "user"]
}
