import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [AuthModule, ConfigModule.forRoot(), UserModule, CategoryModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
