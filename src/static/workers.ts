import { join } from 'path';
import { Paths } from '@/static/paths';

export class Workers {
  static JaggerMusicAwards = {
    Statistics: join(Paths.WorkersDir, 'jaggermusic-awards', 'voting-statistics.worker.js'),
    Vote: join(Paths.WorkersDir, 'jaggermusic-awards', 'do-vote.worker.js'),
  }
}
