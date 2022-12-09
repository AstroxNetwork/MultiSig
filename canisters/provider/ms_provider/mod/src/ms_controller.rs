use ic_cdk::api;
use ic_cdk::export::Principal;

pub trait TMsController {
  fn controller_init(&self, target_canister_id: Principal, total_user_amount: u16, threshold_user_amount: u16);

  fn canister_controller_remove(&self, target_canister_id: Principal, principal: Principal);

  fn role_owner_remove(&self, target_canister_id: Principal, principal: Principal);
}

pub struct MsController {

}

impl MsController {
  pub fn new() -> Self{
    MsController{}
  }
}


impl TMsController for MsController {
  fn controller_init(&self, target_canister_id: Principal, total_user_amount: u16, threshold_user_amount: u16) {
    let _result = api::call::notify(target_canister_id, "controller_init", (total_user_amount, threshold_user_amount,));
  }

  fn canister_controller_remove(&self, target_canister_id: Principal, principal: Principal){
    let _result = api::call::notify(target_canister_id, "canister_controller_remove", (principal,));
  }

  fn role_owner_remove(&self, target_canister_id: Principal, principal: Principal){
    let _result = api::call::notify(target_canister_id, "role_owner_remove", (principal,));
  }
}


