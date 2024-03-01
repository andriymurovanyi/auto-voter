import { Request, Response } from 'express';
import { AppService } from '@/core/services/app.service';
import { Worker } from '@/helpers/worker';
import { Workers } from '@/static/workers';

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

  static async vote(
    req: Request,
    res: Response
  ) {
    console.log('Query: ', req.query);

    const passedApiKey = req.query['api_key'];
    const desiredApiKey = process.env.API_KEY;

    if (passedApiKey !== desiredApiKey) {
      res.status(403);
      res.json({ error: 'Forbidden' })
      return;
    }

    try {
      const worker = Workers.JaggerMusicAwards.Vote;
      await Worker.run(worker);

      res.json({
        message: 'Vote success',
      });
    } catch (err) {
      res.json({
        error: 'Vote process',
        details: err.message,
      })
    }
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
