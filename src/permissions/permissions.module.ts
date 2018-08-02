import { Module } from '@nestjs/common';
import { PermissionsController } from './permissions.controller';

@Module({
    imports: [],
    controllers: [PermissionsController],
    providers: [],
  })

export class PermissionsModule {}
