use candid::{candid_method};
use ic_cdk_macros::*;
use std::collections::{BTreeMap};

use astrox_macros::inject_canister_users;
use btc_wallet_mod::ego_lib::inject_ego_macros;


inject_canister_users!();
inject_ego_macros!();

#[init]
#[candid_method(init)]
pub fn init() {
  let caller = caller();
  ic_cdk::println!("btc_wallet: init, caller is {}", caller.clone());

  ic_cdk::println!("==> add caller as the owner");
  owner_add(caller.clone());
}