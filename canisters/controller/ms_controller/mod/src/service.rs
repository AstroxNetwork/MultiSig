use std::collections::{BTreeMap};
use ego_lib::ego_store::TEgoStore;
use ego_lib::ego_types::AppId;
use ic_cdk::export::Principal;
use crate::app_wallet::TAppWallet;
use crate::model::{Action, Sign};
use crate::state::{CONTROLLER};
use crate::types::{Errors, SystemErr};

pub struct Service {}

impl Service {

  pub async fn app_main_create<S: TEgoStore>(
    ego_store: S,
    app_id: AppId
  ) -> Result<(), SystemErr> {
    let user_app = match ego_store.wallet_app_install(app_id).await {
      Ok(user_app) => Ok(user_app),
      Err(e) => {Err(SystemErr::from(e))}
    }?;

    match user_app.backend {
      Some(canister) => {
        CONTROLLER.with(|controller| controller.borrow_mut().app = Some(canister.canister_id));
        Ok(())
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

  pub fn action_sign_create<W: TAppWallet>(app_wallet: W, action_id: u64, user_id: &Principal, sign_at: u64) -> Result<Sign, SystemErr>{
    CONTROLLER.with(|controller| controller.borrow_mut().action_sign_create(app_wallet, action_id, user_id, sign_at))
  }
}
