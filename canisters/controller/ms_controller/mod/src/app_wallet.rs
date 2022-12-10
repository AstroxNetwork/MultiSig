use std::collections::BTreeMap;
use ic_cdk::api;
use ic_cdk::export::Principal;
use ic_cdk::export::candid::{CandidType, Deserialize};


#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct SendRequest {
  pub path: String,
  pub to_address: String,
  pub amount_in_satoshi: u64,
}

pub trait TAppWallet {
  fn action_main_invoke(&self, path: String, to_address: String, amount_in_satoshi: u64, extended: BTreeMap<String, String>);
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
  fn action_main_invoke(&self, path: String, to_address: String, amount_in_satoshi: u64, _extended: BTreeMap<String, String>) {
    let req = SendRequest{
      path,
      to_address,
      amount_in_satoshi
    };
    let _result = api::call::notify(self.canister_id, "btc_tx_send", (req,));
  }
}


