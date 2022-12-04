import { AppInfo} from '@/canisters/ego_store';
import {  UserApp } from '@/canisters/ego_wallet';
import { createModel } from '@rematch/core';
import type { RootModel } from '../store/models';

type AppProps = {
  groups: AppInfo[]
  wallets: UserApp[]
  slideMode: 'group' | 'wallet'
};

export const app = createModel<RootModel>()({
  state: {
    groups: [],
    wallets: [],
    slideMode: 'group'

  } as AppProps,
  reducers: {
    save(state, payload) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: dispatch => ({
   
  }),
});

