import { join } from 'path';
import { cwd } from 'process';

export class Paths {
  static WorkDir = join(cwd(), 'dist');

  static PublicDir = `${Paths.WorkDir}/public`;

  static WorkersDir = `${Paths.WorkDir}/workers`;

  static JsModules = (baseURL: string) => ([
    {
      alias: '/deps',
      fullPath: `${baseURL}/js/deps`,
    },

    {
      alias: '/components',
      fullPath: `${baseURL}/js/components`
    },

    {
      alias: '/utils',
      fullPath: `${baseURL}/js/utils`
    }
  ])
}
