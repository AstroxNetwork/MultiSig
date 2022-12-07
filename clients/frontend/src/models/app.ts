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

type AppProps = {
  groups: Controller[];
  wallets: Action[];
  slideMode: 'group' | 'home';
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
    async queryGroups(payload, rootState) {
      try {
        console.log('queryGroups start', payload);
        const providerActor = rootState.global.initialState?.providerActor;
        console.log(providerActor);
        let result: any = await providerActor?.controller_main_list();
        dispatch.app.save({
          groups: result['Ok'],
        });
        console.log('controllers ===', result['Ok']);
      } catch (err) {
        console.log('queryGroups catch', err);
      }
    },
    async queryWallets(payload: { contrlCanisterId: string }, rootState) {
      try {
        console.log('queryWallets start', payload);
        const result =
          await rootState.global.initialState.currentUser?.createActor<controllerService>(
            payload.contrlCanisterId,
            controllerIdl,
          );
        const controllerActor = result?.isOk() ? result.value : null;
        if (controllerActor) {
          const wallets: any = controllerActor.app_action_list();
          dispatch.app.save({
            wallets: wallets['Ok'],
          });
        } else {
          console.log('controllerActor null');
        }
        // let result = await queryTokenList(payload);
        // dispatch.app.save({
        //   wallets: result.data,
        // });
      } catch (err) {
        console.log('queryWallets catch', err);
      }
    },
  }),
});
