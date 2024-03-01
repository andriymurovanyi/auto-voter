import { configDotenv } from 'dotenv';
import { Logger } from '@/helpers/logger';

import { initApp } from '@/core/app';

configDotenv();

async function runApp() {
  const app = await initApp();

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    Logger.info(`Server started at ${PORT} port...`);
  });
}

runApp().catch((error) => {
  Logger.error(error.stack);
});
