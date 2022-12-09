import { AppInfo } from '@/canisters/ego_store';
import { UserApp } from '@/canisters/ego_wallet';
import { createModel } from '@rematch/core';
import { Controller, Result_3 } from '../../../idls/ms_provider';
import type { RootModel } from '../store/models';
import { _SERVICE as btcWalletService } from '@/../../idls/btc_wallet';
import { idlFactory as btcWalletIdl } from '@/../../idls/btc_wallet.idl';
import { ActorSubclass } from '@dfinity/agent';
import { hasOwnProperty } from '@/utils';

type BtcProps = {
  activeBtcWalletActor: ActorSubclass<btcWalletService> | null;
  address: string;
  balance: string;
  allAddress: string[];
  fee: bigint[];
};

export const btc = createModel<RootModel>()({
  state: {
    activeBtcWalletActor: null,
    address: '',
    allAddress: [],
    balance: '',
    fee: [],
  } as BtcProps,
  reducers: {
    save(state, payload) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: dispatch => ({
    async getBalance(payload, rootState) {
      try {
        console.log('getBalance start', payload);
        const { activeBtcWalletActor, address } = rootState.btc;
        if (activeBtcWalletActor && address) {
          let result = await activeBtcWalletActor.btc_balance_get(
            payload.address,
          );
          dispatch.app.save({
            balance: result.toString(),
          });
        } else {
          console.error('activeBtcWalletActor  null');
        }
      } catch (err) {
        console.log('getBalance catch', err);
      }
    },
    async getAllAddress(payload, rootState) {
      try {
        console.log('getAllAddress start', payload);
        const { activeBtcWalletActor } = rootState.btc;
        if (activeBtcWalletActor) {
          let result = await activeBtcWalletActor.btc_address_get_all();
          dispatch.app.save({
            allAddress: result,
          });
        } else {
          console.error('activeBtcWalletActor  null');
        }
      } catch (err) {
        console.log('getAllAddress catch', err);
      }
    },
    async getAddress(payload, rootState) {
      try {
        console.log('getAddress start', payload);
        const { activeBtcWalletActor } = rootState.btc;
        if (activeBtcWalletActor) {
          const path = "m/44'/0'/0'/0/0";
          let result: any = await activeBtcWalletActor.btc_address_get(path);
          if (hasOwnProperty(result, 'Ok')) {
            dispatch.app.save({
              address: result['Ok'].address,
            });
          }
        } else {
          console.error('activeBtcWalletActor  null');
        }
      } catch (err) {
        console.log('getAddress catch', err);
      }
    },
    async getFee(payload, rootState) {
      try {
        console.log('getFee start', payload);
        const { activeBtcWalletActor } = rootState.btc;
        if (activeBtcWalletActor) {
          let result = await activeBtcWalletActor.btc_fee_get();
          dispatch.app.save({
            fee: result,
          });
        } else {
          console.error('activeBtcWalletActor  null');
        }
      } catch (err) {
        console.log('getFee catch', err);
      }
    },
  }),
});
