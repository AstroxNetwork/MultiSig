import fs from 'fs';
import crypto, { BinaryLike } from 'crypto';
import path from 'path';

import { getActor } from '@/settings/agent';
import { getCanisterId, hasOwnProperty } from '@/settings/utils';

import { _SERVICE as EgoOpsService, Category } from '@/ego/ego_ops';
import { _SERVICE as EgoStoreService } from '@/ego/ego_store';
import { _SERVICE as ProviderService } from '@/idls/ms_provider';
import { _SERVICE as ControllerService } from '@/idls/ms_controller';
import { _SERVICE as DappService } from '@/idls/btc_wallet';
import { _SERVICE as EcoLocalService } from '@/ego/ego_local';

import { idlFactory } from '@/ego/ego_ops.idl';

import { identity } from '@/settings/identity';
import { Principal } from '@dfinity/principal';
import { ActorSubclass } from '@dfinity/agent';

describe('ego_local', () => {
  test('release to ego_local', async () => {
    const provider_name = 'ms_provider';
    const controller_name = 'ms_controller';
    const dapp_name = 'btc_wallet';

    console.log(`1. register provider\n`);

    const ego_local_id = Principal.fromText(getCanisterId('ego_local')!);
    const controller_id = Principal.fromText(getCanisterId(controller_name)!);
    const dapp_id = Principal.fromText(getCanisterId(dapp_name)!);

    let providerOperator = await getOperator<ProviderService>(provider_name);
    await providerOperator.ego_canister_add('ego_store', ego_local_id);

    console.log(`2. setup controller \n`);
    let controllerOperator = await getOperator<ControllerService>(
      controller_name,
    );
    await controllerOperator.ego_canister_add('ego_store', ego_local_id);

    console.log(`3. setup dapp \n`);
    let dappOperator = await getOperator<DappService>(dapp_name);
    await dappOperator.ego_canister_add('ego_store', ego_local_id);

    console.log(`4. setup ego_local \n`);
    let egoLocalOperator = await getOperator<EcoLocalService>('ego_local');
    egoLocalOperator.ego_canister_add('controller', controller_id);
    egoLocalOperator.ego_canister_add('dapp', dapp_id);
  });
});

describe('ms_provider', () => {
  test('register ms_provider as a wallet provider to ego store', async () => {
    console.log(`register ms_provider\n`);

    const ms_provider_id = Principal.fromText(getCanisterId('ms_provider')!);

    let storeOperator = await getOperator<EgoStoreService>('ego_store');

    const ego_store_id = Principal.fromText(getCanisterId('ego_store')!);

    console.log(`ego_store_id: ${ego_store_id}`);

    console.log(`add ego_store to ms_provider\n`);
    let msProviderOperator = await getOperator<ProviderService>('ms_provider');

    await msProviderOperator.ego_canister_add('ego_store', ego_store_id);

    await storeOperator.admin_wallet_provider_add({
      wallet_app_id: 'astrox_ms_controller',
      wallet_provider: ms_provider_id,
    });
  });
});

describe('ms_controller', () => {
  test('release to ego dev', async () => {
    const ms_controller_wasm = fs.readFileSync(
      path.resolve(
        `${[process.cwd()]}` +
          '/artifacts/ms_controller/ms_controller_opt.wasm',
      ),
    );

    const ms_controller_version = {
      major: 1,
      minor: 0,
      patch: 0,
    };

    console.log(`release multisig controller\n`);
    await admin_app_create(
      'astrox_ms_controller',
      'astrox multisig controller',
      ms_controller_version,
      { Vault: null },
      ms_controller_wasm,
    );
  });
});

describe('btc_wallet', () => {
  test('release to ego dev', async () => {
    const btc_wallet_wasm = fs.readFileSync(
      path.resolve(
        `${[process.cwd()]}` + '/artifacts/btc_wallet/btc_wallet_opt.wasm',
      ),
    );

    const btc_wallet_controller_version = {
      major: 1,
      minor: 0,
      patch: 0,
    };

    console.log(`release btc wallet\n`);
    await admin_app_create(
      'ms_btc_wallet',
      'astrox btc wallet',
      btc_wallet_controller_version,
      { Vault: null },
      btc_wallet_wasm,
    );
  });
});

async function getOperator<T>(canisterName: string): Promise<ActorSubclass<T>> {
  let operator = await getActor<T>(
    identity,
    idlFactory,
    getCanisterId(canisterName)!,
  );
  return operator;
}

const admin_app_create = async (
  app_id: string,
  name: string,
  version: any,
  category: Category,
  backend_data: ArrayLike<number>,
) => {
  let opsOperator = await getOperator<EgoOpsService>('ego_ops');

  const backend_data_hash = crypto
    .createHash('md5')
    .update(backend_data as BinaryLike)
    .digest('hex');

  let resp1 = await opsOperator.admin_app_create({
    app_id,
    name,
    version,
    logo: '',
    description: '',
    category,
    backend_data: Array.from(new Uint8Array(backend_data)),
    backend_data_hash,
  });
  console.log(resp1);
};
