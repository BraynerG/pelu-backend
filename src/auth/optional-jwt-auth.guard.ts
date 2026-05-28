import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    // Si hay error o no hay usuario, retornamos null en lugar de lanzar excepción
    if (err || !user) {
      return null;
    }
    return user;
  }
}
