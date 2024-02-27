export namespace ISmsActivatorHelper {
  export namespace Enum {
    export enum Status {
      StatusWaitCode = 'STATUS_WAIT_CODE', // Ожидание смс
      StatusWaitRetry = 'STATUS_WAIT_RETRY', // Ожидание уточнения кода
      StatusWaitResend = 'STATUS_WAIT_RESEND', // Ожидание повторной отправки смс, // * софт должен нажать повторно выслать смс и выполнить изменение статуса на 6
      StatusCancel = 'STATUS_CANCEL', // Отмена активации
      StatusOk = 'STATUS_OK', // Код получен
    }
  }

  export interface Number {
    id: string;
    number: string;
  }

  export namespace Method {
    export namespace GetNumber {
      export type Response = Promise<Number>;
    }

    export namespace SetStatus {
      export type Request = {
        status: number;
        activateId: string;
      };

      export type Response = Promise<{ success: boolean }>;
    }

    export namespace GetCode {
      export type Request = {
        activateId: string;
        attempt?: number;
      };

      export type Response = Promise<{
        status: ISmsActivatorHelper.Enum.Status;
        code: string;
      }>;
    }
  }
}
