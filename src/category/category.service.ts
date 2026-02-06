import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(userId: number) {
    return this.prisma.category.findMany({ where: { userId: Number(userId) } });
  }

  async getById(id: number, userId: number) {
    const category = await this.prisma.category.findUnique({
      where: { id: Number(id), userId: Number(userId) },
    });

    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }

    return category;
  }

  async create(dto: CategoryDto, userId: number) {
    return this.prisma.category.create({
      data: { ...dto, userId: Number(userId) },
    });
  }

  async update(dto: CategoryDto, id: number, userId: number) {
    await this.getById(id, userId);
    return this.prisma.category.update({
      where: { id: Number(id) },
      data: { ...dto, userId: Number(userId) },
    });
  }

  async delete(id: number, userId: number) {
    await this.getById(id, userId);
    return this.prisma.category.delete({ where: { id: Number(id) } });
  }
}
