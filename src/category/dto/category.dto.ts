import { IsEnum, IsNumber, IsString } from 'class-validator';
import { EnumType } from 'generated/prisma/enums';

export class CategoryDto {
  @IsString()
  name: string;

  @IsEnum(EnumType)
  type: EnumType;

  @IsString()
  color: string;

  @IsNumber()
  userId: number;

  @IsString()
  icon: string;
}
