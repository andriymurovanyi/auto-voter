import puppeteer from 'puppeteer-extra';
import dotenv from 'dotenv';

import PuppeteerStealth from 'puppeteer-extra-plugin-stealth';

import { Page } from 'puppeteer';
import { Recorder } from '@/helpers/recorer';
import { MongoHelper } from '@/helpers/mongo';
import { PuppeteerHelper } from '@/helpers/puppeteer';

import { PromiseUtils } from '@/utils';
import { IUser, UserModel } from '@/models/user';

// Setup environment variables
dotenv.config();

// Setup Puppeteer plugins
puppeteer.use(PuppeteerStealth());

const PAGE_URL = 'https://jagermusicawards.com.ua';
const VOTE_CANDIDATE_ID = process.env.VOTE_CANDIDATE_ID;

async function fillForm(page: Page, user: IUser.BaseModel) {
  const phoneNumber = user.phoneNumber
    .slice(3, user.phoneNumber.length);

  await page.type('#loginform-phone', phoneNumber);
  await page.type('#loginform-password', user.password);
}

(async function runWorker(): Promise<void> {
  const { closeDBConnection } = await MongoHelper.connect(process.env.MONGODB_URL);

  const launchData = await PuppeteerHelper.getLaunchData({
    useRandomProxy: true,
    headless: true,
  });

  const voter = await UserModel.findOne({
    canVote: true,
  }, undefined, {
    sort: {
      createdAt: -1,
    }
  });

  console.log('Current voter: ', voter.email);

  const browser = await puppeteer.launch(launchData.browserOptions);

  const page = await browser.newPage();

  await page.setViewport({ width: 1440, height: 900 });

  const screenRecorder = new Recorder(page, `${voter.email}-register.webm`);

  await screenRecorder.startVideo();

  await page.goto(PAGE_URL);

  await page.waitForSelector('.container');

  console.log(`Navigate to ${PAGE_URL}`);

  // Wait for the div element with class 'first-screen__button' to appear
  await page.waitForSelector('.first-screen__button');

  // Click the anchor tag inside the div
  await page.click('.first-screen__button a');

  console.log('Age confirmed');

  await PromiseUtils.sleep(2000);

  await page.goto(`${PAGE_URL}/member`, { waitUntil: 'domcontentloaded' });

  console.log(`Navigation to ${PAGE_URL}/member`);

  await PromiseUtils.sleep(2000);

  // Wait for the div element with class 'login-account' to appear
  await page.waitForSelector('#login-form');

  await PromiseUtils.sleep(1000);

  await fillForm(page, voter);

  // Submit the form
  await page.click('button[type="submit"]');

  console.log('Sign in completed');

  await page.waitForNavigation();

  await page.goto(`${PAGE_URL}/longlist-yb`);

  await PromiseUtils.sleep(2 * 1000);

  await page.waitForSelector('#search', {
    timeout: 30 * 1000,
  });

  await page.type('#search', 'Vioria');

  await page.$eval(
    `input#search`,
    (el) => {
      el.blur()
    });

  const voteButton = `[data-id="${VOTE_CANDIDATE_ID}"]`;

  await page.waitForSelector(voteButton, {
    timeout: 30 * 1000,
  });

  await page.click(voteButton);

  await page.waitForNavigation({
    timeout: 30 * 1000,
  });

  await page.waitForSelector('.dialog--vote-ok');

  await UserModel.updateOne({
    email: voter.email,
  }, {
    canVote: true,
  });

  closeDBConnection();

  await screenRecorder.stopVideo();

  await browser.close();

  console.log('Vote process completed');

  process.exit(0);
})();
