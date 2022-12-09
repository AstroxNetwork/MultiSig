import { getActor } from '@/settings/agent';

import { _SERVICE as MsProviderService } from '@/idls/ms_provider';
import { idlFactory as MsProviderIdlFactory } from '@/idls/ms_provider.idl';

import { _SERVICE as MsControllerService } from '@/idls/ms_controller';
import { idlFactory as MsControllerIdlFactory } from '@/idls/ms_controller.idl';

import { identity } from '@/settings/identity';
import { getCanisterId } from '@/settings/utils';

import { Ed25519KeyIdentity } from '@dfinity/identity';
import { endUsers } from '@/fixtures/identities';

export const msProviderActor = getActor<MsProviderService>(
  identity,
  MsProviderIdlFactory,
  getCanisterId('ms_provider')!,
);

describe('scripts', () => {
  test('create controller', async () => {
    let user1 = Ed25519KeyIdentity.fromJSON(JSON.stringify(endUsers[0]?.identity)).getPrincipal();
    let user2 = Ed25519KeyIdentity.fromJSON(JSON.stringify(endUsers[1]?.identity)).getPrincipal()

    console.log("create controller")
    const actor = await msProviderActor;

    let resp1 = await actor.controller_main_create({name: "test", total_user_amount: 5, threshold_user_amount: 2})
    console.log(resp1)

    let controller_id = resp1.Ok.id;
    console.log(controller_id)
    console.log("add user")

    let controller = await getActor<MsControllerService>(
      identity,
      MsControllerIdlFactory,
      controller_id,
    );

    await controller.batch_user_add([[user1, "user1"], [user2, "user2"]])

    let users = await controller.role_user_list()
    console.log(users)

    await controller.app_main_create()
  });
});
