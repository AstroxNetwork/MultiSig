use std::collections::BTreeMap;

use ic_cdk::api;
use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk::export::Principal;

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct SendRequest {
  pub request_id: u64,
  pub path: String,
  pub to_address: String,
  pub amount_in_satoshi: u64,
  pub extended: BTreeMap<String, String>,
}

pub trait TAppWallet {
  fn action_main_invoke(
    &self,
    request_id: u64,
    path: String,
    to_address: String,
    amount_in_satoshi: u64,
    extended: BTreeMap<String, String>,
  );
}

pub struct AppWallet {
  pub canister_id: Principal,
}

impl AppWallet {
  pub fn new(canister_id: Principal) -> Self {
    AppWallet { canister_id }
  }
}

impl TAppWallet for AppWallet {
  fn action_main_invoke(
    &self,
    request_id: u64,
    path: String,
    to_address: String,
    amount_in_satoshi: u64,
    extended: BTreeMap<String, String>,
  ) {
    ic_cdk::println!(
      "TAppWallet.action_main_invoke path:{}, to_address:{}, amount_in_satoshi:{}",
      path.clone(),
      to_address.clone(),
      amount_in_satoshi
    );

    let req = SendRequest {
      request_id,
      path,
      to_address,
      amount_in_satoshi,
      extended,
    };
    let _result = api::call::notify(self.canister_id, "btc_tx_send", (req, ));
  }
}
