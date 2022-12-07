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
import { getActor, hasOwnProperty } from '@/utils';
import { message } from 'antd';

type ControllerProps = {
  controller: Controller | null;
};

export const controller = createModel<RootModel>()({
  state: {
    controller: null,
  } as ControllerProps,
  reducers: {
    save(state, payload) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: dispatch => ({
    async groupCreate(payload, rootState) {
      try {
        const providerActor = rootState.global.initialState.providerActor;
        const params = {
          ...payload,
          total_user_amount: Number(payload.total_user_amount),
          threshold_user_amount: Number(payload.threshold_user_amount),
        };
        console.log('params', params);
        const resp = await providerActor?.controller_main_create(params);
        if (hasOwnProperty(resp, 'Ok')) {
          console.log(resp);
          const controller: Controller = resp['Ok'];
          dispatch.controller.save({ controller });
          const controllerActor = await getActor<controllerService>(
            rootState.global.initialState.currentUser!,
            controller.id,
            controllerIdl,
          );
          // 绑定btc_wallet
          await controllerActor?.app_main_create();
          return true;
        } else {
          message.success('error');
          return false;
        }
      } catch (err) {
        console.log('queryGroups catch', err);
        return false;
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
