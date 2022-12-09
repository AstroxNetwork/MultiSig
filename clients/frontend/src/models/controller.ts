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
import { ActorSubclass } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

type ControllerProps = {
  activeController: Controller | null;
  activeControllerActor: ActorSubclass<controllerService> | null;

  actions: Action[];
};

export const controller = createModel<RootModel>()({
  state: {
    activeController: null,
    activeControllerActor: null,
    actions: [],
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
        if (resp && hasOwnProperty(resp, 'Ok')) {
          console.log(resp);
          const controller = resp['Ok'] as Controller;
          const controllerActor = await getActor(
            payload.provider,
            controller.id.toText(),
            controllerIdl,
          );

          await dispatch.controller.save({
            activeController: controller,
            activeControllerActor: controllerActor,
            // activeBtcWalletActor:
          });
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

    async userAdd(payload, rootState) {
      try {
        console.log('userAdd start');
        const ctrl = rootState.controller.activeControllerActor;
        if (ctrl) {
          const params = payload.data.map(
            (o: { name: any; principal: any }) => [
              Principal.fromText(o.principal),
              o.name,
            ],
          );
          console.log('params', params);
          const result = await ctrl?.batch_user_add(params);
          console.log('result', result);
        }
      } catch (err) {
        console.log('userAdd err', err);
      }
    },
    async queryActions(payload, rootState) {
      try {
        console.log('queryActions start');
        const ctrl = rootState.controller.activeControllerActor;
        if (ctrl) {
          const result = await ctrl.app_action_list();
          console.log('result', result);
          if (hasOwnProperty(result, 'Ok')) {
            dispatch.controller.save({ actions: result['Ok'] });
          } else {
            console.log('result err', result);
          }
        }
      } catch (err) {
        console.log('queryActions catch', err);
      }
    },
  }),
});
