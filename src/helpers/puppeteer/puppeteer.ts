import { anonymizeProxy } from 'proxy-chain';
import { executablePath } from 'puppeteer';

import { ProxyUtils } from '@/utils';

import { type PuppeteerLaunchOptions } from 'puppeteer';
import { type Proxy } from '@/static/proxies';

export namespace IPuppeteerHelper {
  export namespace GetLaunchData {
    export type Params = {
      useRandomProxy: boolean;
      headless?: boolean;
    };

    export type ReturnType = Promise<{
      browserOptions: Partial<PuppeteerLaunchOptions>;
      proxy: Proxy | null;
    }>;
  }
}

const DefaultParams: IPuppeteerHelper.GetLaunchData.Params = {
  useRandomProxy: false,
  headless: true,
};

export class PuppeteerHelper {
  static async getLaunchData({
    useRandomProxy,
    headless,
  }: IPuppeteerHelper.GetLaunchData.Params = DefaultParams): IPuppeteerHelper.GetLaunchData.ReturnType {
    const args: string[] = [];

    let chosenProxy: Proxy | null = null;

    if (useRandomProxy) {
      const proxy = ProxyUtils.getRandomProxy();
      const connectionURL = ProxyUtils.createConnectionURL(proxy);
      const proxyUrl = await anonymizeProxy(connectionURL);

      args.push(`--proxy-server=${proxyUrl}`);
      chosenProxy = proxy;
    }

    if (headless) {
      args.push(...[
        '--no-sandbox',
        '--lang="en-US"',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-zygote',
        '--single-process', // Comment this property in dev mode if puppeteer crushes
      ]);
    }

    const browserOptions = {
      headless,
      args,
      devtools: !headless,
      executablePath: executablePath(),
    };

    return { browserOptions, proxy: chosenProxy };
  }
}
