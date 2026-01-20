
import { IsOptional, IsString, IsEmail, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSettingsDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    companyName?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    slogan?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    primaryColor?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    secondaryColor?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUrl()
    website?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    address?: string;
}
