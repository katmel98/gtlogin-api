import * as express from 'express';
import * as bodyParser from 'body-parser';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from 'app.module';
import { UsersModule } from 'users/users.module';

async function bootstrap() {
  const instance = express();
  instance.use(bodyParser.json());

  const app = await NestFactory.create(AppModule, instance);

  const options = new DocumentBuilder()
    .setTitle('GTLogin API')
    .setDescription('GTLogin API endpoints')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000, () => {
    console.log('\t');
    console.log('Application listening on *:3000');
  });
}
bootstrap();
