import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CategoryDto } from './dto/category.dto';
import { CurrentUser } from 'src/user/decorators/user.decorators';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @HttpCode(200)
  @Auth()
  @Get()
  async getAll(@CurrentUser('id') userId: number) {
    return this.categoryService.getAll(userId);
  }

  @HttpCode(200)
  @Auth()
  @Get('by-id/:id')
  async getById(@Param('id') id: number, @CurrentUser('id') userId: number) {
    return this.categoryService.getById(id, userId);
  }

  @Auth()
  @UsePipes(new ValidationPipe())
  @HttpCode(201)
  @Post()
  async create(@Body() dto: CategoryDto, @CurrentUser('id') userId: number) {
    return this.categoryService.create(dto, userId);
  }

  @Auth()
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(':id')
  async update(
    @Body() dto: CategoryDto,
    @Param('id') id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.categoryService.update(dto, id, userId);
  }

  @Auth()
  @HttpCode(200)
  @Delete(':id')
  async delete(@Param('id') id: number, @CurrentUser('id') userId) {
    return this.categoryService.delete(id, userId);
  }
}
