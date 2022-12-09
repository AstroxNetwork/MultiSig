import { Models } from '@rematch/core';
import { app } from '../models/app';
import { global } from '../models/global';
import { controller } from '@/models/controller';
import { btc } from '@/models/btc';

export interface RootModel extends Models<RootModel> {
  app: typeof app;
  global: typeof global;
  controller: typeof controller;
  btc: typeof btc;
}

export const models: RootModel = { app, global, controller, btc };
