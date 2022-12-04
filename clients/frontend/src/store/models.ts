import { Models } from '@rematch/core';
import { app } from '../models/app';
import { global } from '../models/global';

export interface RootModel extends Models<RootModel> {
  app: typeof app;
  global: typeof global;
}

export const models: RootModel = { app, global };
