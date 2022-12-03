use ic_cdk::export::Principal;
use crate::model::Controller;
use crate::state::PROVIDER;
use crate::types::SystemErr;

pub struct Service {}

impl Service {
  pub fn controller_main_list(user_id: &Principal) -> Vec<Controller> {
    PROVIDER.with(|provider| provider.borrow().controller_main_list(user_id))
  }

  pub fn controller_main_get(user_id: &Principal, controller_id: &Principal) -> Option<Controller> {
    PROVIDER.with(|provider| provider.borrow().controller_main_get(user_id, controller_id))
  }

  pub fn controller_main_create<S: TEgoStore>(ego_store: S,
    user_id: &Principal,
    name: String,
    total_user_amount: u16,
    threshold_user_amount: u16
  ) -> Result<Principal, SystemErr> {
    let store_canister_id = WALLET.with(|w| {
      match w.borrow().ego_store_canister {
        None => Err(WalletError{code: 1001, msg: "astrox_wallet: wallet not initialized".to_string()}),
        Some(store_canister_id) => Ok(store_canister_id)
      }
    })?;

    ego_store.wallet_main_new()
  }


}
