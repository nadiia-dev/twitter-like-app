import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express, NextFunction, Request, Response } from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { AppModule } from './src/app.module';
import { createAppContext } from './bootstrap-app';
import dotenv from 'dotenv';

dotenv.config();

const expressServer: Express = express();

const createFunction = async (expressInstance: Express): Promise<void> => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS',
    );
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });

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

export const filesCleanup = onSchedule(
  { schedule: '00 00 * * *' },
  async () => {
    console.log('Starting scheduled cleanup...');
    const { app, cleanupService } = await createAppContext();
    await cleanupService.removeUnusedImages();
    await app.close();
    console.log('Cleanup completed.');
  },
);
