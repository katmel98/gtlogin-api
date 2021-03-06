import { GroupsModule } from './groups/groups.module';
import { AuthModule } from 'auth/auth.module';
import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'users/users.module';
import { PermissionsModule } from 'permissions/permissions.module';
import { RolesModule } from 'roles/roles.module';
import { MessagesModule } from 'messages/messages.module';
import { SyslogsModule } from 'syslogs/syslogs.module';
import { ProductModule } from 'products/products.module';
import { HeaderMiddleware } from 'common/middlewares/headers.middleware';
import { logger } from 'common/middlewares/logger.middleware';

@Module({
  imports: [
              MongooseModule.forRoot('mongodb://localhost:27017/gtlogin'),
              AuthModule,
              UsersModule,
              GroupsModule,
              RolesModule,
              PermissionsModule,
              MessagesModule,
              SyslogsModule,
              ProductModule,
            ],
  providers: [],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(logger)
    .with('ApplicationModule')
    .forRoutes( { path: '*', method: RequestMethod.ALL } )
    .apply(HeaderMiddleware)
      .with('ApplicationModule')
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST},
        { path: 'auth/register', method: RequestMethod.POST},
        { path: 'auth/userData', method: RequestMethod.POST},
      )
      .forRoutes(
        'AuthController',
        { path: 'users', method: RequestMethod.ALL },
        { path: 'groups', method: RequestMethod.ALL },
        { path: 'roles', method: RequestMethod.ALL },
        { path: 'permissions', method: RequestMethod.ALL },
        { path: 'products', method: RequestMethod.ALL },
      );
  }
}
