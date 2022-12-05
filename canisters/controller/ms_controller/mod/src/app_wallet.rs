use std::collections::BTreeMap;
use ic_cdk::api;
use ic_cdk::export::Principal;

pub trait TAppWallet {
  fn action_main_invoke(&self, params: BTreeMap<String, String>);
}

pub struct AppWallet {
  pub canister_id: Principal
}

impl AppWallet {
  pub fn new(canister_id: Principal) -> Self {
    AppWallet {canister_id}
  }
}


impl TAppWallet for AppWallet {
  fn action_main_invoke(&self, params: BTreeMap<String, String>) {
    let _result = api::call::notify(self.canister_id, "action_main_invoke", (params,));
  }
}


