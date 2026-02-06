import { Module } from '@nestjs/common';
import { TransactionsService } from './transaction.service';
import { TransactionsController } from './transaction.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, PrismaService],
})
export class TransactionsModule {}
