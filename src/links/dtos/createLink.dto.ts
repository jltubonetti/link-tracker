import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, IsUrl, Matches } from 'class-validator';

export class CreateLinkDto {
    @IsUrl( {require_protocol: true}, {message: 'URL must include http:// or https://'})
    @Matches( /^https?:\/\/([a-z0-9-]+\.)+(com|net|org|io|dev|ar|com\.ar)$/i, {message: 'URL must be a valid domain ending with .com, .net, .org, .io, .dev, .ar or .com.ar'})
    url!: string;

    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    expireAt?: Date;
}

export class CreateLinkResponseDto {
  target!: string;
  link!: string;
  valid!: boolean;
}
