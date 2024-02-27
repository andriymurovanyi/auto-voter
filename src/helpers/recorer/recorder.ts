import path from 'path';
import fs from 'fs';
import { sync } from 'rimraf';
import { cwd } from 'process';
import {ensureDir, ensureFile} from 'fs-extra';

import { Page } from 'puppeteer';
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';

export class Recorder {
  private _config = {
    followNewTab: true,
    fps: 10,
    ffmpeg_Path: null,
    videoCrf: 18,
    videoCodec: 'libx264',
    videoPreset: 'ultrafast',
    videoBitrate: 1000,
    videoFrame: {
      width: 1440,
      height: 900,
    },
    // autopad: {
    //   color: 'black',
    // },
    // aspectRatio: '4:3',
  };

  private _videoDir: string;

  private _pathToSessionVideo: string;

  private _recorder: PuppeteerScreenRecorder | null = null;

  constructor(page: Page, fileKey: string) {
    this._recorder = new PuppeteerScreenRecorder(page, this._config);

    this._videoDir = path.join(cwd(), 'recordings');

    this._pathToSessionVideo = path.join(this._videoDir, fileKey);
  }

  public async cleanup() {
    if (this._pathToSessionVideo) sync(this._pathToSessionVideo);
  }

  public async startVideo() {
    await ensureDir(this._videoDir);

    const writableStream = fs.createWriteStream(this._pathToSessionVideo, {});

    if (this._recorder) await this._recorder.startStream(writableStream);
    else
      console.warn(
        'Cannot start the video because screen recorder is not initialized',
      );
  }

  public async stopVideo() {
    if (this._recorder) {
      await this._recorder.stop();
    } else
      console.warn(
        'Cannot stop the video because screen recorder is not initialized',
      );
  }
}
