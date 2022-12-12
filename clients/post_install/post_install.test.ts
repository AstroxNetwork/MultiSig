import fs from 'fs';
import crypto, { BinaryLike } from 'crypto';
import path from 'path';

import { getActor } from '@/settings/agent';
import { getCanisterId, hasOwnProperty } from '@/settings/utils';

import { _SERVICE as EgoOpsService, Category } from '@/ego/ego_ops';
import { _SERVICE as EgoStoreService } from '@/ego/ego_store';
import { _SERVICE as MsProviderService } from '@/idls/ms_provider';
import { idlFactory } from '@/ego/ego_ops.idl';
import { DeployMode } from '@/ego/ego_dev';

import { identity } from '@/settings/identity';
import { Principal } from '@dfinity/principal';
import { ActorSubclass } from '@dfinity/agent';

describe('ms_provider', () => {
  test('register ms_provider as a wallet provider to ego store', async () => {
    console.log(`register ms_provider\n`);

    const ms_provider_id = Principal.fromText(getCanisterId('ms_provider')!);

    let storeOperator = await getOperator<EgoStoreService>('ego_store');

    const ego_store_id = Principal.fromText(getCanisterId('ego_store')!);

    console.log(`add ego_store to ms_provider\n`);
    let msProviderOperator = await getOperator<MsProviderService>(
      'ms_provider',
    );

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
      patch: 2,
    };

    console.log(`release multisig controller\n`);
    await admin_app_create(
      'astrox_ms_controller',
      'astrox multisig controller',
      ms_controller_version,
      { Vault: null },
      { DEDICATED: null },
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
      patch: 2,
    };

    console.log(`release btc wallet\n`);
    await admin_app_create(
      'ms_btc_wallet',
      'astrox btc wallet',
      btc_wallet_controller_version,
      { Vault: null },
      { DEDICATED: null },
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
  deploy_mode: DeployMode,
  backend_data: ArrayLike<number>,
  frontend_canister_id?: Principal,
) => {
  let opsOperator = await getOperator<EgoOpsService>('ego_ops');

  const backend_hash = crypto
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
    backend_hash,
    frontend: frontend_canister_id ? [frontend_canister_id] : [],
    deploy_mode,
  });
  console.log(resp1);
};
