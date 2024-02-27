import { readFile } from 'fs/promises';

import { Logger } from '@/helpers/logger';
import { Worker } from '@/helpers/worker';

import { Paths } from '@/static/paths';
import { Workers } from '@/static/workers';

import { HtmlUtils } from '@/utils';

import { IVotingCandidate, VotingCandidateModel } from '@/models';

const InjectionTags = {
  Style: '<!--style-tags-->'
};

export class AppService {
  static async getPageHTML(page: string) {
    const pagePath = `${Paths.PublicDir}/${page}.html`;
    const criticalCSSPath = `${Paths.PublicDir}/css/critical.css`;

    const pageHTML = await readFile(pagePath, 'utf-8');
    const criticalCSS = await readFile(criticalCSSPath, 'utf-8');

    return pageHTML.replace(
      InjectionTags.Style,
      HtmlUtils.toStyleTag(criticalCSS),
    );
  }

  static async sync(): Promise<void> {
    Logger.info(`${AppService.sync.name} started`);

    const worker = Workers.JaggerMusicAwards.Statistics;

    const statistics = await Worker.run(worker);

    await VotingCandidateModel.deleteMany({});

    await VotingCandidateModel.insertMany(statistics);

    Logger.info(`${AppService.sync.name} finished`);
  }

  static async getStatistics(): Promise<IVotingCandidate.Model[]> {
    const statistics =
      await VotingCandidateModel.find({}, null, {
        sort: {
          votesAmount: -1,
        }
      }).lean();

    return statistics;
  }
}
