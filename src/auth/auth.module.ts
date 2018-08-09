import * as passport from 'passport';
import {
  Module,
  NestModule,
  MiddlewareConsumer,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './passport/jwt.strategy';
import { AuthController } from './auth.controller';
import { UsersModule } from 'users/users.module';
import { HttpStrategy } from './passport/http.strategy';

@Module({
  imports: [UsersModule],
  providers: [AuthService, HttpStrategy],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    // consumer
    //   .apply(passport.authenticate('jwt', { session: false }))
    //   .forRoutes(
    //     { path: '/products', method: RequestMethod.ALL },
    //     { path: '/products/*', method: RequestMethod.ALL });
  }
}