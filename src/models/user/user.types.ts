import { Proxy } from '@/static/proxies';

export namespace IUser {
  export interface BaseModel {
    firstName: string;
    phoneNumber: string;
    lastName?: string;

    email: string;
    password: string;

    canVote: boolean;

    usedProxy?: Proxy | null;
  }

  export interface Model extends BaseModel {
    id: string;
    createdAt: Date;
    updatedAt: Date;
  }
}
