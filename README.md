# Auto-voter

## Service features:
* automatically generates accounts for voting;
* collects voting statistics;
* automatic voting using generated accounts (TBD);

## Prerequisites
### Setup ENV variables or provide .env file
* **SMS_ACTIVATOR_API_KEY=** - sms-active.org API key
* **MONGODB_URL=** - mongodb connection string

## Installation
After pulling project on your local machine enter command to install all deps
```bash
$ yarn install --frozen-lock-file
```

## Running the app
```bash
$ yarn start:prod
```
