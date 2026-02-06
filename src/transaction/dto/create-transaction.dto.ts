import {
  IsNumber,
  IsString,
  IsOptional,
  IsDate,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EnumType } from 'generated/prisma/enums';

export class CreateTransactionDto {
  @IsNumber()
  @Min(0.01, { message: 'Сумма должна быть больше 0' })
  @Max(10000000, { message: 'Сумма слишком большая' })
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  date?: Date;

  @IsEnum(EnumType)
  type: EnumType;

  @IsNumber()
  @IsOptional()
  categoryId?: number; // Опционально, может быть null для "Без категории"
}
