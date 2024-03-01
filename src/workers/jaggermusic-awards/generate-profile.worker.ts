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

  await page.$eval(
    `input#memberform-agree`,
    (el) => {
      el.click()
    });
}

(async function runWorker(): Promise<void> {
  const { closeDBConnection } = await MongoHelper.connect(process.env.MONGODB_URL);

  const launchData = await PuppeteerHelper.getLaunchData({
    useRandomProxy: true,
    headless: true,
  });

  const fakeUser = FakerHelper.generateFakeUser();

  console.log('User: ', fakeUser.email);

  const browser = await puppeteer.launch(launchData.browserOptions);

  const page = await browser.newPage();

  await page.setViewport({ width: 1440, height: 900 });

  const screenRecorder = new Recorder(page, `${fakeUser.email}-register.webm`);

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
  await page.waitForSelector('.login-account');

  // Click the anchor tag inside the div
  await page.click('.login-account .ceate-a');

  await PromiseUtils.sleep(1000);

  const { number, id: activateId } = await SmsActivatorHelper.GetNumber();

  console.log('Phone received: ', number);

  fakeUser.phoneNumber = number;

  await UserModel.create({
    ...fakeUser,
    usedProxy: launchData.proxy,
  });

  await SmsActivatorHelper.SetStatus({
    status: 1,
    activateId,
  });

  console.info('User create: ', { fakeUser, number, activateId });

  await fillForm(page, fakeUser);

  // Submit the form
  await page.click('button[type="submit"]');

  console.log('Sign up completed');

  await page.waitForNavigation();

  console.log(`Start ${number} SMS verification...`);

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

  console.log(`Passed ${number} SMS verification`);

  await PromiseUtils.sleep(2000);

  await UserModel.updateOne({
    email: fakeUser.email,
  }, {
    canVote: true,
  });

  await closeDBConnection();

  await screenRecorder.stopVideo();

  await browser.close();

  console.log('Completed');

  process.exit(0);
})();
