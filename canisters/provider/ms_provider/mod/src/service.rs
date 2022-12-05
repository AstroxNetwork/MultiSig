use ego_lib::ego_store::TEgoStore;
use ic_cdk::export::Principal;
use crate::model::Controller;
use crate::state::PROVIDER;
use crate::types::SystemErr;

pub struct Service {}

impl Service {
  pub fn controller_main_list(user: &Principal) -> Vec<Controller> {
    PROVIDER.with(|provider| provider.borrow().controller_main_list(user))
  }

  pub fn controller_main_get(user: &Principal, controller_id: &Principal) -> Option<Controller> {
    PROVIDER.with(|provider| provider.borrow().controller_main_get(user, controller_id))
  }

  pub async fn controller_main_create<S: TEgoStore>(
    ego_store: S,
    user: &Principal,
    name: String,
    total_user_amount: u16,
    threshold_user_amount: u16
  ) -> Result<Controller, SystemErr> {
    let user_app = match ego_store.wallet_main_new().await {
      Ok(user_app) => Ok(user_app),
      Err(e) => {Err(SystemErr::from(e))}
    }?;

    match user_app.backend {
      Some(canister) => {
        let controller = PROVIDER.with(|provider| provider.borrow_mut().controller_main_create(&canister.canister_id, user, name, total_user_amount, threshold_user_amount));
        Ok(controller)
      }
      _ => Err(SystemErr{code: 500, msg: "System Error".to_string()})
    }

  }
}
