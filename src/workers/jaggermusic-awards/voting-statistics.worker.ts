import puppeteer from 'puppeteer-extra';
import dotenv from 'dotenv';

import PuppeteerStealth from 'puppeteer-extra-plugin-stealth';

import { Page } from 'puppeteer';
import { PuppeteerHelper } from '@/helpers/puppeteer';

import { PromiseUtils } from '@/utils';
import { IUser, IVotingCandidate } from '@/models';

// Setup environment variables
dotenv.config();

// Setup Puppeteer plugins
puppeteer.use(PuppeteerStealth());

const PAGE_URL = 'https://jagermusicawards.com.ua';
const WORKER_TIMEOUT = 15 * 60 * 1000; // default time out is 15 minutes

const timerId = setTimeout(() => {
  console.warn(`[${process.pid}] Worker timeout exceeded ${WORKER_TIMEOUT} ms`);
  process.exit(124);
}, WORKER_TIMEOUT);

interface WorkerOptions {
  user: IUser.Model;
}

const options: WorkerOptions = {} as any;

(async function runWorker(): Promise<void> {
  try {
    const statistics =  await parseStatistics();
    process.send(statistics);
    process.exit(0);
  } catch (error) {
    console.error(`[${process.pid}] Worker build failed: `, error.message);
    process.exit(1);
  } finally {
    clearTimeout(timerId);
    process.exit(1);
  }
})();

async function parseStatistics(): Promise<IVotingCandidate.BaseModel[]> {
  const launchData = await PuppeteerHelper.getLaunchData({
    useRandomProxy: true,
    headless: true,
  });

  const browser = await puppeteer.launch({
    ...launchData.browserOptions
  });

  const page = await browser.newPage();

  await page.setViewport({ width: 1440, height: 900 });

  await page.goto(PAGE_URL);

  console.log(`Page navigation to: ${PAGE_URL}`);

  await page.waitForSelector('.container');

  // Wait for the div element with class 'first-screen__button' to appear
  await page.waitForSelector('.first-screen__button');

  // Click the anchor tag inside the div
  await page.click('.first-screen__button a');

  await PromiseUtils.sleep(2000);

  await page.goto(`${PAGE_URL}/member`, { waitUntil: 'domcontentloaded' });

  await PromiseUtils.sleep(2000);

  console.log(`Page navigation to: ${PAGE_URL}/member`);

  // Wait for the div element with class 'login-account' to appear
  await page.waitForSelector('.login-account');

  await fillForm(page, options.user);

  await PromiseUtils.sleep(1000);

  await page.click('button[type="submit"]');

  await page.waitForNavigation();

  console.log(`${options.user?.email || ''} successful login`);

  await PromiseUtils.sleep(1000);

  await page.goto(`${PAGE_URL}/longlist-yb`);

  await PromiseUtils.sleep(1000);

  await page.waitForSelector('.longlist');

  const listItems = await page.$$('.longlist > *');

  const cleanValue = (str: string) => str
    .trim()
    .replace(/\n/g, '');

  const parsePromises = listItems.map(async (itemHandle) => {
    const [
      artistContent,
      songContent,
      votesAmountContent,
    ] = await Promise.all([
      itemHandle.evaluate((item) =>
        item.querySelector('.mixcloud__header').textContent
      ),

      itemHandle.evaluate((item) =>
        item.querySelector('.mixcloud__subheader').textContent
      ),

      itemHandle.evaluate((item) =>
        item.querySelector('.mixcloud__votes').textContent
      )
    ]);

    return {
      artist: cleanValue(artistContent),
      song: cleanValue(songContent),
      votesAmount: +cleanValue(votesAmountContent),
    };
  });

  return Promise.all(parsePromises);
}

async function fillForm(page: Page, user: IUser.Model) {
  if (!user) {
    await page.type('#loginform-phone', '981014576');
    await page.type('#loginform-password', 'wopavu');

    return;
  }

  const phoneNumber = user.phoneNumber
    .slice(3, user.phoneNumber.length);

  await page.type('#loginform-phone', phoneNumber);
  await page.type('#loginform-password', user.password);
}
