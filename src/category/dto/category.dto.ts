import { IsEnum, IsString } from 'class-validator';
import { EnumType } from 'generated/prisma/enums';

export class CategoryDto {
  @IsString()
  name: string;

  @IsEnum(EnumType)
  type: EnumType;

  @IsString()
  color: string;

  @IsString()
  userId: string;

  @IsString()
  icon: string;
}
