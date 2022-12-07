import { getActor } from '@/settings/agent';

import { _SERVICE as MsProviderService } from '@/idls/ms_provider';
import { identity } from '@/settings/identity';
import { idlFactory as MsProviderIdlFactory } from '@/idls/ms_provider.idl';

import { getCanisterId } from '@/settings/utils';
import { Principal } from '@dfinity/principal';
import path from 'path';

export const msProviderActor = getActor<MsProviderService>(
  identity,
  MsProviderIdlFactory,
  getCanisterId('ms_provider')!,
);

describe('scripts', () => {
  test('create controller', async () => {
    console.log("create controller")
    const actor = await msProviderActor;

    let resp1 = await actor.controller_main_create({name: "test", total_user_amount: 5, threshold_user_amount: 2})
    console.log(resp1)
  });
});
