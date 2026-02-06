import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { EnumType } from 'generated/prisma/enums';
import { TransactionWhereInput } from 'generated/prisma/models';
import { IOptions } from './interface/options.interface';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}
  // Получение всех транзакций пользователя с пагинацией и фильтрами
  async findAll(userId: number, options?: IOptions) {
    const {
      page = 1,
      limit = 20,
      type,
      categoryId,
      startDate,
      endDate,
      search,
    } = options || {};

    const skip = (page - 1) * limit;

    // Формируем условия WHERE
    const where: TransactionWhereInput = { userId };

    if (type) {
      where.type = type;
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (search) {
      where.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        {
          category: {
            name: { contains: search, mode: 'insensitive' },
          },
        },
      ];
    }

    // Фильтр по дате
    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = startDate;
      }
      if (endDate) {
        where.date.lte = endDate;
      }
    }
    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              type: true,
              color: true,
              icon: true,
            },
          },
        },
        orderBy: { date: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      data: transactions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  //  Получение одной транзакции по ID
  async findOne(transactionId: number, userId: number) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id: transactionId, userId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
            color: true,
            icon: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException('Транзакция не найдена');
    }

    return transaction;
  }
  // Создание новой транзакции
  async create(dto: CreateTransactionDto, userId: number) {
    if (dto.categoryId) {
      const category = await this.prisma.category.findFirst({
        where: {
          id: dto.categoryId,
          userId,
          type: dto.type,
        },
      });

      if (!category) {
        throw new BadRequestException(
          'Категория не найдена или не соответствует типу транзакции',
        );
      }
    }

    const transaction = await this.prisma.transaction.create({
      data: {
        amount: dto.amount,
        description: dto.description,
        date: dto.date || new Date(),
        type: dto.type,
        userId,
        categoryId: dto.categoryId || null,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
            color: true,
            icon: true,
          },
        },
      },
    });

    return transaction;
  }

  // Обновление транзакции
  async update(
    dto: UpdateTransactionDto,
    transactionId: number,
    userId: number,
  ) {
    // Сначала проверяем существование транзакции и права доступа
    const existingTransaction = await this.findOne(transactionId, userId);

    // Если меняется категория, проверяем новую категорию
    if (dto.categoryId && dto.categoryId !== existingTransaction.categoryId) {
      const category = await this.prisma.category.findFirst({
        where: {
          id: dto.categoryId,
          userId,
          type: dto.type || existingTransaction.type, // Используем новый тип или старый
        },
      });
      if (!category) {
        throw new BadRequestException(
          'Категория не найдена или не соответствует типу транзакции',
        );
      }
    }

    // Обновляем транзакцию
    const updatedTransaction = await this.prisma.transaction.update({
      where: { id: transactionId },
      data: { ...dto, date: dto.date || existingTransaction.date },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
            color: true,
            icon: true,
          },
        },
      },
    });
    return updatedTransaction;
  }

  // Удаление транзакции
  async delete(id: number, userId: number) {
    await this.findOne(id, userId);
    return this.prisma.transaction.delete({ where: { id } });
  }

  //Получение статистики по транзакциям
  async getStatistics(userId: number, startDate?: Date, endDate?: Date) {
    const where: TransactionWhereInput = { userId };
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    const [incomeResult, expenseResult] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: { ...where, type: 'INCOME' },
        _sum: { amount: true },
        _count: { id: true },
      }),
      this.prisma.transaction.aggregate({
        where: { ...where, type: 'EXPENSE' },
        _sum: { amount: true },
        _count: { id: true },
      }),
    ]);

    const income = Number(incomeResult._sum.amount || 0);
    const expense = Number(expenseResult._sum.amount || 0);

    return {
      income: {
        total: income,
        count: incomeResult._count.id,
      },
      expense: {
        total: expense,
        count: expenseResult._count.id,
      },
      balance: income - expense,
      period: {
        startDate: startDate || null,
        endDate: endDate || null,
      },
    };
  }

  // Получение транзакций по категориям (для диаграмм)
  async getByCategories(
    userId: number,
    type: EnumType,
    startDate?: Date,
    endDate?: Date,
  ) {
    const where: TransactionWhereInput = { userId, type };
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    const transactions = await this.prisma.transaction.groupBy({
      by: ['categoryId'],
      where,
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _sum: {
          amount: 'desc',
        },
      },
    });

    const categoryIds = transactions
      .map((transaction) => transaction.categoryId)
      .filter(Boolean);

    const categories = await this.prisma.category.findMany({
      where: { id: { in: categoryIds as number[] } },
      select: { id: true, name: true, color: true, icon: true },
    });

    // Собираем результат

    return transactions.map((transaction) => {
      const category = categories.find((c) => c.id === transaction.categoryId);
      return {
        category: category || {
          id: null,
          name: 'Без категории',
          color: '#9E9E9E',
          icon: '❓',
        },
        totalAmount: Number(transaction._sum.amount || 0),
        transactionCount: transaction._count.id,
      };
    });
  }
}
