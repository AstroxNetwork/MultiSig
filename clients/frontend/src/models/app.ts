import { AppInfo } from '@/canisters/ego_store';
import { UserApp } from '@/canisters/ego_wallet';
import { createModel } from '@rematch/core';
import { Controller, Result_3 } from '../../../idls/ms_provider';
import type { RootModel } from '../store/models';
import {
  Action,
  _SERVICE as controllerService,
} from '@/../../idls/ms_controller';
import { idlFactory as controllerIdl } from '@/../../idls/ms_controller.idl';
import { hasOwnProperty } from '@/utils';

type AppProps = {
  groups: Controller[];
  wallets: Action[];
};

export const app = createModel<RootModel>()({
  state: {
    groups: [],
    wallets: [],
    slideMode: 'home',
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
    async queryGroups(
      payload,
      rootState,
    ): Promise<Array<Controller> | undefined> {
      try {
        console.log('queryGroups start', payload);
        const providerActor = rootState.global.initialState?.providerActor;
        console.log(providerActor);
        let result: any = await providerActor?.controller_main_list();
        console.log(result);
        if (result && hasOwnProperty(result, 'Ok')) {
          dispatch.app.save({
            groups: result['Ok'],
          });
          return result['Ok'];
        }
        console.log('controllers ===', result['Ok']);
      } catch (err) {
        console.log('queryGroups catch', err);
      }
    },
  }),
});
