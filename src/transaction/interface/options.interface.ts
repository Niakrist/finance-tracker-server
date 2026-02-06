import { EnumType } from 'generated/prisma/enums';

export interface IOptions {
  page?: number;
  limit?: number;
  type?: EnumType;
  categoryId?: number;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}
