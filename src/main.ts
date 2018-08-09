import 'config/config';

import * as express from 'express';
import * as bodyParser from 'body-parser';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from 'app.module';

async function bootstrap() {
  const instance = express();
  instance.use(bodyParser.json());
  const port = process.env.PORT || 3000;

  const app = await NestFactory.create(AppModule, instance);

  const options = new DocumentBuilder()
    .setTitle('GTLogin API')
    .setDescription('GTLogin API endpoints')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(port, () => {
    console.log(`Application listening on *:${port}`);
  });
}

bootstrap();
