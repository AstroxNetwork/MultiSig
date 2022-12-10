import { AppInfo } from '@/canisters/ego_store';
import { UserApp } from '@/canisters/ego_wallet';
import { createModel } from '@rematch/core';
import { Controller, Result_3 } from '../../../idls/ms_provider';
import type { RootModel } from '../store/models';
import { Utxo, _SERVICE as btcWalletService } from '@/../../idls/btc_wallet';
import { idlFactory as btcWalletIdl } from '@/../../idls/btc_wallet.idl';
import { ActorSubclass } from '@dfinity/agent';
import { getActor, hasOwnProperty } from '@/utils';
import { BTC_PATH } from '@/utils/constants';
import { balanceToString } from '@/utils/converter';
import { Principal } from '@dfinity/principal';
import { IConnector } from '@connect2ic/core';

type BtcProps = {
  activeBtcWalletActor: ActorSubclass<btcWalletService> | null;
  address: string;
  balance: string;
  allAddress: string[];
  fee: bigint[];
  txHistory: Utxo[];
};

export const btc = createModel<RootModel>()({
  state: {
    activeBtcWalletActor: null,
    address: '',
    allAddress: [],
    balance: '',
    fee: [],
    txHistory: [],
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
    async initBTCWallet(payload: { provider: IConnector }, rootState) {
      try {
        const { activeControllerActor } = rootState.controller;
        const walletResult = await activeControllerActor?.app_main_get();
        console.log(walletResult);
        if (
          walletResult &&
          hasOwnProperty(walletResult, 'Ok') &&
          (walletResult['Ok'] as [Principal]).length > 0
        ) {
          const canisterId = (walletResult['Ok'] as [Principal])[0].toText();
          const activeBtcWalletActor = await getActor<btcWalletService>(
            payload.provider,
            canisterId,
            btcWalletIdl,
          );
          dispatch.btc.save({ activeBtcWalletActor });
          //设置网络和使用地址
          try {
            await activeBtcWalletActor?.btc_network_set({ Regtest: null });
            await activeBtcWalletActor?.btc_address_set(BTC_PATH);
            await dispatch.btc.getAddress({});
            await dispatch.btc.getBalance({});
          } catch (err) {
            console.log('err', err);
          }
        }
      } catch (err) {
        console.log('err', err);
      }
    },
    async getBalance(payload, rootState) {
      try {
        console.log('getBalance start', payload);
        const { activeBtcWalletActor, address } = rootState.btc;
        console.log(address);
        let result = await activeBtcWalletActor?.btc_balance_get(address);
        console.log('balance result ', result);
        dispatch.btc.save({
          balance:
            result !== undefined
              ? result === BigInt(0)
                ? '0'
                : balanceToString(result, 8)
              : '--',
        });
      } catch (err) {
        console.log('getBalance catch', err);
      }
    },
    async getAllAddress(payload, rootState) {
      try {
        console.log('getAllAddress start', payload);
        const { activeBtcWalletActor } = rootState.btc;
        let result = await activeBtcWalletActor?.btc_address_get_all();
        dispatch.btc.save({
          allAddress: result,
        });
      } catch (err) {
        console.log('getAllAddress catch', err);
      }
    },
    async getAddress(payload, rootState) {
      try {
        console.log('getAddress start', payload);
        const { activeBtcWalletActor } = rootState.btc;
        let result: any = await activeBtcWalletActor?.btc_address_get(BTC_PATH);
        console.log('address', result);
        if (hasOwnProperty(result, 'Ok')) {
          dispatch.btc.save({
            address: result['Ok'].address,
          });
        }
      } catch (err) {
        console.log('getAddress catch', err);
      }
    },
    async getFee(payload, rootState) {
      try {
        console.log('getFee start', payload);
        const { activeBtcWalletActor } = rootState.btc;
        let result = await activeBtcWalletActor?.btc_fee_get();
        dispatch.btc.save({
          fee: result,
        });
      } catch (err) {
        console.log('getFee catch', err);
      }
    },
    async getTxHistory(payload, rootState) {
      try {
        console.log('getTxHistory start', payload);
        const { activeBtcWalletActor, address } = rootState.btc;
        let result = await activeBtcWalletActor?.btc_utxos_get(address);
        dispatch.btc.save({
          txHistory: result,
        });
      } catch (err) {
        console.log('getTxHistory catch', err);
      }
    },
  }),
});
