import { Request, Response } from 'express';
import { AppService } from '@/core/services/app.service';

export class AppController {
  static async index(
    req: Request,
    res: Response,
  ) {
    const html = await AppService.getPageHTML('main');

    res.setHeader('content-type', 'text/html');
    res.status(200);

    res.end(html);
  }

  static async sync(
    req: Request,
    res: Response,
  ) {
    res.json({ syncStatus: 'started' });

    try {
      await AppService.sync()
    } catch (error: any) {
      console.log('Sync error: ', error.stack);
    }
  }

  static async getStatistics(
    req: Request,
    res: Response,
  ) {
    const statistics = await AppService.getStatistics();

    res.json({
      statistics,
    });
  }
}
