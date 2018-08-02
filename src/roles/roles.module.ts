import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';

@Module({
    imports: [],
    controllers: [RolesController],
    providers: [],
  })

export class RolesModule {}
