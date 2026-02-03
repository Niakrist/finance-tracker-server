import { IsOptional, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsString({ message: 'Почта обязательное поле' })
  email: string;

  @MinLength(6, { message: 'Пароль должен содеражть не менее 6 символов' })
  @IsString({ message: 'Пароль обязательное поле' })
  password: string;
}
