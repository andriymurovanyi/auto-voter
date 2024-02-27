import path from 'path';
import cron from 'node-cron';

import express, { Express } from 'express';
import { json, urlencoded } from 'body-parser';

import { AppController } from '@/core/controllers/app.controller';
import { AppService } from '@/core/services/app.service';

import { MongoHelper } from '@/helpers/mongo';
import { JsModule } from '@/middlewares/js-module';
import { Paths } from '@/static/paths';

export async function initApp() {
  const app = express();

  app.use(json());
  app.use(urlencoded({ extended: true }));

  await setupDBConnection();

  setupStatic(app);

  setupRoutes(app);

  setupCronJobs();

  return app;
}

function setupRoutes(app: Express) {
  app.get('/', AppController.index);
  app.get('/api/statistics', AppController.getStatistics);
  app.post('/api/sync', AppController.sync);
}

function setupStatic(app: Express) {
  const stepUp = '../../';
  const publicDir = path.resolve(__filename, stepUp, 'public');

  app.use('/', express.static(publicDir));

  const modules = Paths.JsModules(publicDir);

  const registerModule = (alias: string, path: string) => {
    app.use(alias, express.static(path), JsModule(path));
  }

  for (const module of modules) {
    registerModule(module.alias, module.fullPath);
  }
}

function setupDBConnection() {
  return MongoHelper.connect(process.env.MONGODB_URL);
}

function setupCronJobs() {
  cron.schedule('*/10 * * * *', () => AppService.sync());
}
