import { Injectable } from '@nestjs/common';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user;
  }

  async getByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user;
  }

  async create(dto: AuthDto) {
    const user = await this.prisma.user.create({
      data: { name: dto.name, email: dto.email, password: dto.password },
    });
    return user;
  }
}
