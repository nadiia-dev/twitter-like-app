import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { CleanupService } from './src/cleanup/cleanup.service';

export const createAppContext = async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const cleanupService = app.get(CleanupService);
  return { app, cleanupService };
};
