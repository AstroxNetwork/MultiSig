import { MeResponse, User } from '@/canisters/ego_store';
import { InitialStateType } from '@/layout/UserLayout';
import { createModel } from '@rematch/core';
import type { RootModel } from '../store/models';

type GlobalProps = {
  initialState: InitialStateType;
};

export const global = createModel<RootModel>()({
  state: {
    initialState: {
      currentUser: null,
      providerActor: null,
      controllerActor: null,
      btcActor: null,
    },
  } as GlobalProps,
  reducers: {
    save(state, payload) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: dispatch => ({}),
});
