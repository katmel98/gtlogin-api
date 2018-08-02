import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';

@Module({
    imports: [],
    controllers: [MessagesController],
    providers: [],
  })

export class MessagesModule {}
