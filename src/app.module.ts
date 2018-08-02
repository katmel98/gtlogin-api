import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesController } from './messages/messages.controller';
import { PermissionsController } from './permissions/permissions.controller';
import { MessagesModule } from './messages/messages.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { SyslogsModule } from './syslogs/syslogs.module';
import { UsersModule } from 'users/users.module';

@Module({
  imports: [
              UsersModule,
              PermissionsModule,
              RolesModule,
              MessagesModule,
              SyslogsModule,
            ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
