import { fork } from 'child_process';
import { Logger } from '@/helpers/logger';

export class Worker {
  static run(workerPath: string, payload: Record<string, string> = {}) {
    const workerArgs: ReadonlyArray<string> = [JSON.stringify(payload)];

    return new Promise((resolve, reject) => {
      const worker = fork(workerPath, workerArgs);

      const logPrefix = `[${workerPath}] -> PID(${worker.pid})`;

      Logger.info(`${logPrefix} worker started`);

      worker.stdout?.on('data', (data: string) => {
        Logger.info(`${logPrefix} >>> ${data}`);
      });

      worker.stderr?.on('data', (data: string) => {
        Logger.error(`${logPrefix} >>> ${data}`);
      });

      worker.on('error', (error: Error) => {
        Logger.error(`${logPrefix}[error]`, error);
        worker.kill();
        reject(error);
      });

      worker.once('message', (data: any) => {
        Logger.info(`${logPrefix} worker finished`);
        resolve(data);
        worker.kill();
      });

      worker.on('exit', (code: number) => {
        if (code !== 0) {
          const error = new Error(`${logPrefix} worker failed with code ${code}`);
          reject(error);
        }

        resolve(code);
      });
    });
  }
}