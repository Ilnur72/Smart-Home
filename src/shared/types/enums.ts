import { IsEnum } from 'class-validator';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum LanguageDto {
  uz = 'uz',
  ru = 'ru',
  en = 'en',
}
export class LanguageStatusDto {
  @IsEnum(LanguageDto, {
    message: `Language must be one of the following values: ${Object.values(
      LanguageDto,
    ).join(', ')}`,
  })
  language: LanguageDto;
}
export enum UserRole {
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  USER = 'USER',
  OPERATOR = 'OPERATOR',
  OPERATOR_USER = 'OPERATOR_USER',
}

export enum IntercomStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
}

export enum CameraStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
}
