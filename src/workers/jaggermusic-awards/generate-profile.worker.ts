import puppeteer from 'puppeteer-extra';
import dotenv from 'dotenv';

import PuppeteerStealth from 'puppeteer-extra-plugin-stealth';

import { Page } from 'puppeteer';
import { Logger } from '@/helpers/logger';
import { Recorder } from '@/helpers/recorer';
import { MongoHelper } from '@/helpers/mongo';
import { FakerHelper } from '@/helpers/faker';
import { PuppeteerHelper } from '@/helpers/puppeteer';
import { SmsActivatorHelper } from '@/helpers/sms';

import { PromiseUtils } from '@/utils';
import { IUser, UserModel } from '@/models/user';

// Setup environment variables
dotenv.config();

// Setup Puppeteer plugins
puppeteer.use(PuppeteerStealth());

const PAGE_URL = 'https://jagermusicawards.com.ua';

async function fillForm(page: Page, fakeUser: IUser.BaseModel) {
  const phoneNumber = fakeUser.phoneNumber
    .slice(3, fakeUser.phoneNumber.length);

  await page.type('#memberform-phone', phoneNumber);
  await page.type('#memberform-email', fakeUser.email);
  await page.type('#memberform-name', fakeUser.firstName);
  await page.type('#memberform-lastname', fakeUser.lastName);
  await page.type('#memberform-password', fakeUser.password);
  await page.type('#memberform-repassword', fakeUser.password);
}

(async function runWorker(): Promise<void> {
  const { closeDBConnection } = await MongoHelper.connect(process.env.MONGODB_URL);

  const launchData = await PuppeteerHelper.getLaunchData({
    useRandomProxy: true,
    headless: true,
  });

  const fakeUser = FakerHelper.generateFakeUser();

  const browser = await puppeteer.launch(launchData.browserOptions);

  const page = await browser.newPage();

  await page.setViewport({ width: 1440, height: 900 });

  const screenRecorder = new Recorder(page, `${fakeUser.email}-register.webm`);

  await screenRecorder.startVideo();

  await page.goto(PAGE_URL);

  await page.waitForSelector('.container');

  // Wait for the div element with class 'first-screen__button' to appear
  await page.waitForSelector('.first-screen__button');

  // Click the anchor tag inside the div
  await page.click('.first-screen__button a');

  await PromiseUtils.sleep(2000);

  await page.goto(`${PAGE_URL}/member`, { waitUntil: 'domcontentloaded' });

  await PromiseUtils.sleep(2000);

  // Wait for the div element with class 'login-account' to appear
  await page.waitForSelector('.login-account');

  // Click the anchor tag inside the div
  await page.click('.login-account .ceate-a');

  await PromiseUtils.sleep(1000);

  const { number, id: activateId } = await SmsActivatorHelper.GetNumber();

  fakeUser.phoneNumber = number;

  await UserModel.create({
    ...fakeUser,
    usedProxy: launchData.proxy,
  });

  await SmsActivatorHelper.SetStatus({
    status: 1,
    activateId,
  });

  Logger.info('[PAGE_STATE]: ', { fakeUser, number, activateId });

  await fillForm(page, fakeUser);

  await page.$eval(
    `input#memberform-agree`,
    (el) => {
      el.click()
    });

  // Submit the form
  await page.click('button[type="submit"]');

  await page.waitForNavigation();

  await page.waitForSelector('.confirm .sendSMS');

  await page.click('.confirm .sendSMS');

  await page.waitForSelector('#sendSMS');

  await PromiseUtils.sleep(1000);

  const { code: smsData } = await SmsActivatorHelper.GetCode({
    activateId,
  });

  const code = smsData.split(' ').at(-1);

  await page.type('input[name="code"]', code);

  await page.click('#sendSMS .confirm-btn');

  await page.waitForSelector('.confirm');

  await PromiseUtils.sleep(2000);

  await UserModel.updateOne({
    email: fakeUser.email,
  }, {
    canVote: true,
  });

  await closeDBConnection();

  await screenRecorder.stopVideo();

  await browser.close();

  process.exit();
})();
