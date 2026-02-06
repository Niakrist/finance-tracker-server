import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TransactionsService } from './transaction.service';
import { CurrentUser } from 'src/user/decorators/user.decorators';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { IOptions } from './interface/options.interface';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { EnumType } from 'generated/prisma/enums';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Auth()
  @HttpCode(200)
  @Get()
  async findAll(
    @CurrentUser('id', ParseIntPipe) userId: number,
    @Query('options') options?: IOptions,
  ) {
    return this.transactionsService.findAll(userId, options);
  }

  @Auth()
  @HttpCode(200)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) transactionId: number,
    @CurrentUser('id', ParseIntPipe) userId: number,
  ) {
    return this.transactionsService.findOne(transactionId, userId);
  }

  @Auth()
  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  @Post()
  async create(
    @Body() dto: CreateTransactionDto,
    @CurrentUser('id', ParseIntPipe) userId: number,
  ) {
    return this.transactionsService.create(dto, userId);
  }

  @Auth()
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Patch(':id')
  async update(
    @Body() dto: UpdateTransactionDto,
    @Param('id', ParseIntPipe) transactionId: number,
    @CurrentUser('id', ParseIntPipe) userId: number,
  ) {
    return this.transactionsService.update(dto, transactionId, userId);
  }

  @Auth()
  @HttpCode(204)
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) transactionId: number,
    @CurrentUser('id', ParseIntPipe) userId: number,
  ) {
    return this.transactionsService.delete(transactionId, userId);
  }

  @Auth()
  @HttpCode(200)
  @Get('statistics/summary')
  async getStatistics(
    @CurrentUser('id', ParseIntPipe) userId: number,
    startDate?: Date,
    endDate?: Date,
  ) {
    return this.transactionsService.getStatistics(userId, startDate, endDate);
  }
  @Auth()
  @HttpCode(200)
  @Get('statistics/by-categories')
  async getByCategories(
    @CurrentUser('id', ParseIntPipe) userId: number,
    type: EnumType,
    startDate?: Date,
    endDate?: Date,
  ) {
    return this.transactionsService.getByCategories(
      userId,
      type,
      startDate,
      endDate,
    );
  }
}
