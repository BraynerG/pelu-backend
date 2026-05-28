import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LoginUseCase, LoginDto } from '../../application/use-cases/login.use-case';
import { RegisterUseCase, RegisterDto } from '../../application/use-cases/register.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.registerUseCase.execute(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto);
  }
}
