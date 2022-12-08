use candid::{candid_method, };
use candid::Principal as CanPrincipal;
use ic_cdk_macros::*;
use std::collections::{BTreeMap};

use astrox_macros::inject_canister_users;
use btc_wallet_mod::ego_lib::inject_ego_macros;
use ic_btc_types::{
  GetBalanceRequest, GetCurrentFeePercentilesRequest, GetUtxosRequest, GetUtxosResponse,
  MillisatoshiPerByte, Satoshi, SendTransactionRequest,
};

// inject_canister_users!();
// inject_ego_macros!();

// inject_canister_users!();

#[init]
#[candid_method(init)]
pub fn init() {
  let caller = ic_cdk::api::caller();
  ic_cdk::println!("btc_wallet: init, caller is {}", caller.clone());

  ic_cdk::println!("==> add caller as the owner");
  // owner_add(caller.clone());
  // TODO: Set btc_init
}

// #[update(name = "wallet_config")]
// #[candid_method(update, rename="wallet_config")]
// fn wallet_config(config: Config) {
//   btc_wallet_mod::init(config);
// }



