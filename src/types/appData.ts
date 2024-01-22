import { AppData } from '@graasp/sdk';

export type AppDataFileT = { s3File: { name: string } };
export type AppDataFile = AppData<AppDataFileT>;
