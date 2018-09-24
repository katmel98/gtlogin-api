import 'config/config';

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from 'app.module';
import { logger } from 'common/middlewares/logger.middleware';
import { HeaderMiddleware } from 'common/middlewares/headers.middleware';

async function bootstrap() {
  const instance = express();
  instance.use(bodyParser.json());
  const port = process.env.PORT || 3000;

  const app = await NestFactory.create(AppModule, instance);

  app.use(compression());
  app.use(logger);

  const descrip = 'GTLogin API represents the GeddeonTech effort for create a simple but really functional REST API ' +
                  'that allow to control authentication and autorization in a role based manner.';

  const options = new DocumentBuilder()
    .setTitle('GTLogin API')
    .setDescription(descrip)
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(port, '127.0.0.1', () => {
    console.log(`Application listening on *:${port}`);
  });
}

bootstrap();
