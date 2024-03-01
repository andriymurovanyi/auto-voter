import { RandomUtils } from '@/utils/random';
import { ProxiesList, type Proxy } from '@/static/proxies';

export class ProxyUtils {
  static getRandomProxy() {
    const randomIndex = RandomUtils.getRandomNumber(0, ProxiesList.length - 1);
    return ProxiesList[randomIndex];
  }

  static createConnectionURL(
    proxy: Proxy,
    scheme: 'http' | 'https' = 'http',
  ) {
    const urlTemplate = `${scheme}://USERNAME:PASSWORD@HOST:PORT`;

    return urlTemplate
      .replace('USERNAME', proxy.auth.username)
      .replace('PASSWORD', proxy.auth.password)
      .replace('HOST', proxy.host)
      .replace('PORT', String(proxy.port))
  }
}
