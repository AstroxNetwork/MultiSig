use astrox_macros::{inject_canister_log, inject_canister_registry, inject_canister_users};
use ego_lib::ego_canister::TEgoCanister;
use ego_lib::ego_store::TEgoStore;
use ego_lib::ego_types::AppId;
use ego_lib::inject_log;

use crate::app_wallet::TAppWallet;
use crate::model::{Action, Sign};
use crate::state::CONTROLLER;
use crate::types::{Errors, SystemErr};

inject_canister_users!();
inject_canister_registry!();
inject_canister_log!();
inject_log!();

/********************  methods for canister_registry_macro   ********************/
fn on_canister_added(_name: &str, _canister_id: Principal) {}


pub struct Service {}

impl Service {
  pub async fn app_main_create<S: TEgoStore, EC: TEgoCanister>(
    ego_store: S,
    ego_canister: EC,
    user_id: Principal,
    app_id: AppId,
  ) -> Result<Principal, SystemErr> {
    ego_log("1. create wallet");
    let user_app = match ego_store.wallet_app_install(app_id).await {
      Ok(user_app) => Ok(user_app),
      Err(e) => { Err(SystemErr::from(e)) }
    }?;

    match user_app.backend {
      Some(canister) => {
        CONTROLLER.with(|controller| controller.borrow_mut().app = Some(canister.canister_id));

        ego_log("2. add self as user");
        ego_canister.ego_user_add(canister.canister_id, user_id);

        ego_log("3. remove self from owner");
        ego_canister.ego_owner_remove(canister.canister_id, user_id);
        Ok(canister.canister_id)
      }
      _ => Err(SystemErr::from(Errors::SystemError))
    }
  }

  pub fn app_action_get(action_id: u64) -> Result<Action, SystemErr> {
    CONTROLLER.with(|controller| controller.borrow().app_action_get(action_id))
  }

  pub fn app_action_create(
    path: String,
    to_address: String,
    amount_in_satoshi: u64,
    extended: BTreeMap<String, String>,
    create_at: u64,
  ) -> Action {
    CONTROLLER.with(|controller| controller.borrow_mut().app_action_create(path, to_address, amount_in_satoshi, extended, create_at))
  }

  pub fn app_action_list() -> Vec<Action> {
    CONTROLLER.with(|controller| controller.borrow().app_action_list())
  }

  pub fn action_sign_create<W: TAppWallet>(app_wallet: W, action_id: u64, user_id: &Principal, sign_at: u64) -> Result<Sign, SystemErr> {
    CONTROLLER.with(|controller| controller.borrow_mut().action_sign_create(app_wallet, action_id, user_id, sign_at))
  }
}
