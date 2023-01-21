import {getActor} from '@/settings/agent';

import {_SERVICE as MsProviderService} from '@/idls/ms_provider';
import {idlFactory as MsProviderIdlFactory} from '@/idls/ms_provider.idl';

import {_SERVICE as MsControllerService} from '@/idls/ms_controller';
import {idlFactory as MsControllerIdlFactory} from '@/idls/ms_controller.idl';

import {_SERVICE as BtcWalletService} from '@/idls/btc_wallet';
import {idlFactory as BtcWalletIdlFactory} from '@/idls/btc_wallet.idl';

import {_SERVICE as EgoOpsService} from '@/ego/ego_ops';
import {idlFactory as EgoOpsIdlFactory} from '@/ego/ego_ops.idl';

import {identity} from '@/settings/identity';
import {getCanisterId} from '@/settings/utils';

import {Ed25519KeyIdentity} from '@dfinity/identity';
import {endUsers} from '@/fixtures/identities';
import {BigNumber} from "ethers";

export const msProviderActor = getActor<MsProviderService>(
  identity,
  MsProviderIdlFactory,
  getCanisterId('ms_provider')!,
);

export const egoOpsActor = getActor<EgoOpsService>(
  identity,
  EgoOpsIdlFactory,
  getCanisterId('ego_ops')!,
);

describe('scripts', () => {
  test('all', async () => {
    let user1 = Ed25519KeyIdentity.fromJSON(
      JSON.stringify(endUsers[0]?.identity),
    ).getPrincipal();
    let user2 = Ed25519KeyIdentity.fromJSON(
      JSON.stringify(endUsers[1]?.identity),
    ).getPrincipal();

    console.log('1 list controller');
    const actor = await msProviderActor;

    let resp1 = await actor.controller_main_list();
    console.log(resp1)

    let controller_ids = resp1.Ok;
    let controller_id = null;
    if(controller_ids.length == 0){
      console.log('2 create controller');
      let resp2 = await actor.controller_main_create({
        name: 'test',
        total_user_amount: 5,
        threshold_user_amount: 2,
      });
      console.log(resp2);

      controller_id = resp2.Ok.id;
    } else {
      controller_id = controller_ids[0].id
    }

    console.log(controller_id);

    console.log('add user');
    let controller = await getActor<MsControllerService>(
      identity,
      MsControllerIdlFactory,
      controller_id,
    );

    console.log("2 get controller app info")
    let resp2 = await controller.ego_app_info_get();
    console.log(resp2)

    console.log("3 batch add users")
    await controller.batch_user_add([
      [user1, 'user1'],
      [user2, 'user2'],
    ]);

    console.log("4 get user list")
    let users = await controller.role_user_list();
    console.log(users);

    console.log("5 create btc_wallet")
    await controller.app_main_create();

    console.log("6 get btc_wallet")
    let resp3 = await controller.app_main_get()
    let result = resp3.Ok
    console.log(result[0])
    let wallet_id = result[0];
    console.log(wallet_id);

    let wallet = await getActor<BtcWalletService>(
      identity,
      BtcWalletIdlFactory,
      wallet_id,
    );
  });

  test('upgrade_dapp', async () => {
    console.log('1 get controller');
    const actor = await msProviderActor;

    let resp1 = await actor.controller_main_list();
    console.log(resp1);

    let controllers = resp1.Ok

    let controller_id = controllers[controllers.length - 1].id

    let controller = await getActor<MsControllerService>(
      identity,
      MsControllerIdlFactory,
      controller_id,
    );

    console.log('2 upgrade app');
    let resp3 = await controller.app_main_upgrade()
    console.log(resp3)
  });

  test('upgrade_controller', async () => {
    console.log('1 get controller');
    const actor = await msProviderActor;

    let resp1 = await actor.controller_main_list();
    console.log(resp1);

    let controllers = resp1.Ok

    let controller_id = controllers[controllers.length - 1].id

    let controller = await getActor<MsControllerService>(
      identity,
      MsControllerIdlFactory,
      controller_id,
    );

    console.log('2 wallet app list');
    let resp2 = await controller.wallet_app_list();
    let user_app = resp2.Ok[0]
    console.log(user_app)

    // console.log('3 upgrade controller');
    // let resp4 = await controller.ego_canister_upgrade()
    // console.log(resp4)
  });

  test('cycle_recharge', async () => {
    console.log('1 get controller');
    const actor = await msProviderActor;

    let resp1 = await actor.controller_main_list();
    console.log(resp1);

    let controllers = resp1.Ok

    let controller_id = controllers[controllers.length - 1].id

    let controller = await getActor<MsControllerService>(
      identity,
      MsControllerIdlFactory,
      controller_id,
    );

    console.log('2 balance_get');
    let resp2 = await controller.balance_get();
    console.log(resp2)

    console.log('3 ego_cycle_threshold_get');
    const ops = await egoOpsActor
    let resp3 = await ops.admin_wallet_cycle_recharge({cycle: BigInt(1000000000), wallet_id: controller_id, comment: "test"});
    console.log(resp3)

    console.log('4 ego_cycle_recharge');
    let resp4 = await controller.ego_cycle_recharge(BigInt(1000000000))
    console.log(resp4)

    console.log('5 balance_get');
    let resp5 = await controller.balance_get();
    console.log(resp5)
  });
});
