import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './create-transaction.dto';
import { IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { EnumType } from 'generated/prisma/enums';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  @IsNumber()
  @Min(0.01, { message: 'Сумма должна быть больше 0' })
  @Max(10000000, { message: 'Сумма слишком большая' })
  @IsOptional()
  amount?: number;

  @IsEnum(EnumType)
  @IsOptional()
  type?: EnumType;
}
