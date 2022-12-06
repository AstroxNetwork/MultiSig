use ic_cdk::api;
use ic_cdk::export::Principal;

pub trait TMsController {
  fn controller_init(&self, total_user_amount: u16, threshold_user_amount: u16);
}

pub struct MsController {
  pub canister_id: Principal
}

impl MsController {
  pub fn new(canister_id: Principal) -> Self {
    MsController {canister_id}
  }
}


impl TMsController for MsController {
  fn controller_init(&self, total_user_amount: u16, threshold_user_amount: u16) {
    let _result = api::call::notify(self.canister_id, "controller_init", (total_user_amount, threshold_user_amount,));
  }
}


