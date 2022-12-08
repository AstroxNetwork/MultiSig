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
import { client1 } from '@/main';

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
        console.log('providerActor', providerActor);
        console.log('params', params);
        const resp = await providerActor?.controller_main_create(params);
        if (resp && hasOwnProperty(resp, 'Ok')) {
          console.log(resp);
          const controller = resp['Ok'] as Controller;
          dispatch.controller.save({ controller });
          const controllerActor = client1.createActor(
            controllerIdl,
            controller.id.toText(),
          );

          // 绑定btc_wallet

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
  }),
});
