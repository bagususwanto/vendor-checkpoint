import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { JwtPayload } from '@repo/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: ['HS256'],
      secretOrKey: process.env.EXTERNAL_API_KEY,
    });

    if (!process.env.EXTERNAL_API_KEY) {
      console.warn(
        'EXTERNAL_API_KEY belum di-set. JWT tidak akan bisa diverifikasi.',
      );
    }
  }

  async validate(payload: JwtPayload) {
    if (!payload) throw new UnauthorizedException('Token tidak valid');

    // Payload minimal harus punya sub dan role dari external provider
    return {
      userId: payload.userId,
      username: payload.username,
      name: payload.name,
      //   isProduction: payload.isProduction,
      //   isWarehouse: payload.isWarehouse,
      role: payload.roleName, // mapped from roleName
      //   roleName: payload.roleName,
      //   anotherWarehouseId: payload.anotherWarehouseId,
      img: payload.img,
      //   plantId: payload.plantId,
      //   iat: payload.iat,
      //   exp: payload.exp,
    };
  }
}
