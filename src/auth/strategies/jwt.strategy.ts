import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') ||
        process.env.JWT_SECRET ||
        'fallback_secret',
    });
  }

  async validate(payload: any) {
    // Payload structure depends on what we sign. Usually { sub: userId, email: ... }
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        roles: true, // Important for RBAC
        tenant: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    // Check if user is active/not suspended could be done here too
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('User is not active');
    }

    return user;
  }
}
