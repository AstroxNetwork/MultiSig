use ego_lib::ego_store::TEgoStore;
use ic_cdk::export::Principal;
use crate::model::Controller;
use crate::state::PROVIDER;
use crate::types::SystemErr;

pub struct Service {}

impl Service {
  pub fn controller_main_list(user_id: &Principal) -> Vec<Controller> {
    PROVIDER.with(|provider| provider.borrow().controller_main_list(user_id))
  }

  pub fn controller_main_get(user: &Principal, controller_id: &Principal) -> Option<Controller> {
    PROVIDER.with(|provider| provider.borrow().controller_main_get(user, controller_id))
  }

  pub async fn controller_main_create<S: TEgoStore>(
    ego_store: S,
    user_id: &Principal,
    name: String,
    total_user_amount: u16,
    threshold_user_amount: u16
  ) -> Result<Controller, SystemErr> {
    let user_app = match ego_store.wallet_main_new(user_id.clone()).await {
      Ok(user_app) => {
        Ok(user_app)
      },
      Err(e) => {
        Err(SystemErr::from(e))
      }
    }?;

    match user_app.backend {
      Some(canister) => {
        let controller = PROVIDER.with(|provider| provider.borrow_mut().controller_main_create(&canister.canister_id, user_id, name, total_user_amount, threshold_user_amount));
        Ok(controller)
      }
      _ => Err(SystemErr{code: 500, msg: "System Error".to_string()})
    }
  }

  pub fn controller_user_add(controller_id: &Principal, user_id: &Principal) {
    PROVIDER.with(|provider| {
      if provider.borrow().controllers.contains_key(controller_id) {
        provider.borrow_mut().controllers.entry(controller_id.clone()).and_modify(|controller| {
          controller.users.entry(user_id.clone()).or_insert(1);
        });

        provider.borrow_mut().user_controllers.entry(user_id.clone()).and_modify(|c_ids| {
          if !c_ids.contains(controller_id) {
            c_ids.push(controller_id.clone());
          }
        }).or_insert(vec![controller_id.clone()]);
      }
    });
  }

  pub fn controller_user_remove(controller_id: &Principal, user_id: &Principal) {
    PROVIDER.with(|provider| {
      if provider.borrow().controllers.contains_key(&controller_id) {
        provider.borrow_mut().controllers.get_mut(&controller_id).as_mut().unwrap().users.remove(&user_id);

        if provider.borrow().user_controllers.contains_key(&user_id) {
          provider.borrow_mut().user_controllers.get_mut(&user_id).as_mut().unwrap().retain(|c_p| c_p != controller_id);
        }
      }
    });
  }
}
