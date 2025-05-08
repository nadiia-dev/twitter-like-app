import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express } from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import { AppModule } from './src/app.module';

const expressServer: Express = express();

const createFunction = async (expressInstance): Promise<void> => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );
  app.enableCors();
  await app.init();
};

export const api = onRequest(
  { minInstances: 0, maxInstances: 5, timeoutSeconds: 90, memory: '512MiB' },
  async (req, resp) => {
    try {
      await createFunction(expressServer);
      expressServer(req, resp);
    } catch (error) {
      console.error('Error:', error);
      resp.status(500).send('Internal Server Error');
    }
  },
);
