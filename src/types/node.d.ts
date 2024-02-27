declare type ProcessEnvFields =
  | 'PORT'
  | 'MONGODB_URL'
  | 'SMS_ACTIVATOR_API_KEY';

declare namespace NodeJS {
  export interface ProcessEnv extends Record<ProcessEnvFields, string> {}
}
