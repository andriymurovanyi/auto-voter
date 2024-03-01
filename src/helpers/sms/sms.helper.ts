import axios, { AxiosInstance } from 'axios';

import { ISmsActivatorHelper } from './sms.helper.types';

export class SmsActivatorHelper {
  private static _SmsAxios: AxiosInstance = axios.create({
    baseURL: 'https://sms-activate.org/stubs/handler_api.php',
  });

  private static async _WaitForAction() {
    return new Promise(resolve => setTimeout(() => resolve(true), 10000));
  }

  public static async GetNumber(): ISmsActivatorHelper.Method.GetNumber.Response {
    try {
      const params = {
        api_key: process.env.SMS_ACTIVATOR_API_KEY,
        action: 'getNumber',
        service: 'ot',
        country: '1',
      };

      const { data } = await this._SmsAxios.get<string>('', { params });

      const [_, id, number] = data.split(':');

      if (!id || !number)
        throw Error('Failed to get the number: number is undefined');

      return { id, number };
    } catch (error: any) {
      console.error({}, error.message, SmsActivatorHelper, this.GetNumber);

      throw error;
    }
  }

  public static async SetStatus({
    status,
    activateId,
  }: ISmsActivatorHelper.Method.SetStatus.Request): ISmsActivatorHelper.Method.SetStatus.Response {
    try {
      const params = {
        api_key: process.env.SMS_ACTIVATOR_API_KEY,
        action: 'setStatus',
        id: activateId,
        status,
      };

      await this._SmsAxios.get('', { params });

      return { success: true };
    } catch (error: any) {
      console.error(
        { status, activateId },
        error.message,
        SmsActivatorHelper,
        this.SetStatus,
      );

      throw error;
    }
  }

  public static async GetCode({
    activateId,
    attempt = 0,
  }: ISmsActivatorHelper.Method.GetCode.Request): ISmsActivatorHelper.Method.GetCode.Response {
    try {
      if (attempt >= 10) throw Error('Timeout');
      else await this._WaitForAction();

      const params = {
        api_key: process.env.SMS_ACTIVATOR_API_KEY,
        action: 'getStatus',
        id: activateId,
      };

      const { data } = await this._SmsAxios.get<string>('', { params });

      const [status, code] = data.split(':');

      console.log('[SMS HELPER]: GetCode', {
        status,
        code,
        attempt,
      });

      if (status !== ISmsActivatorHelper.Enum.Status.StatusOk) {
        console.info(
          { status, code },
          `Current status: ${status}`,
        );

        return await this.GetCode({ activateId, attempt: attempt + 1 });
      }

      return { status, code };
    } catch (error: any) {
      console.error(
        { activateId, attempt },
        error.message,
        SmsActivatorHelper,
        this.GetCode,
      );

      throw error;
    }
  }
}
