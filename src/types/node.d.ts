declare type ProcessEnvFields =
  | 'PORT'
  | 'MONGODB_URL'
  | 'VOTE_CANDIDATE_ID'
  | 'SMS_ACTIVATOR_API_KEY';

declare namespace NodeJS {
  export interface ProcessEnv extends Record<ProcessEnvFields, string> {}
}
