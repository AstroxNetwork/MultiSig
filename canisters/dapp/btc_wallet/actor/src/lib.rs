use candid::{candid_method};
use ic_cdk_macros::*;
use std::collections::{BTreeMap};

use astrox_macros::inject_canister_users;
use btc_wallet_mod::ego_lib::inject_ego_macros;



use btc_wallet_mod::types::{Config, HttpRequest, HttpResponse, SetConfigRequest};
use ic_btc_types::{
  GetBalanceRequest, GetCurrentFeePercentilesRequest, GetUtxosRequest, GetUtxosResponse,
  MillisatoshiPerByte, Satoshi, SendTransactionRequest,
};
use ic_cdk_macros::{heartbeat, init, post_upgrade, pre_upgrade, query, update};

// inject_canister_users!();
// inject_ego_macros!();

// inject_canister_users!();

#[init]
#[candid_method(init)]
pub fn init() {
  // let caller = caller();
  // ic_cdk::println!("btc_wallet: init, caller is {}", caller.clone());
  //
  // ic_cdk::println!("==> add caller as the owner");
  // owner_add(caller.clone());
  // TODO: Set btc_init
}

#[update(name = "wallet_config")]
#[candid_method(update, rename="wallet_config")]
fn wallet_config(config: Config) {
  btc_wallet_mod::init(config);
}

#[pre_upgrade]
fn pre_upgrade() {
  btc_wallet_mod::pre_upgrade();
}

#[post_upgrade]
fn post_upgrade() {
  btc_wallet_mod::post_upgrade();
}

#[heartbeat]
async fn heartbeat() {
  btc_wallet_mod::heartbeat().await
}


#[update(name = "bitcoin_get_balance")]
#[candid_method(update, rename = "bitcoin_get_balance")]
pub fn bitcoin_get_balance(request: GetBalanceRequest) -> Satoshi {
  btc_wallet_mod::get_balance(request)
}

#[update(name = "bitcoin_get_utxos")]
#[candid_method(update, rename = "bitcoin_get_utxos")]
pub fn bitcoin_get_utxos(request: GetUtxosRequest) -> GetUtxosResponse {
  btc_wallet_mod::get_utxos(request)
}

#[update(name = "bitcoin_send_transaction")]
#[candid_method(update, rename = "bitcoin_send_transaction")]
async fn bitcoin_send_transaction(request: SendTransactionRequest) {
  btc_wallet_mod::send_transaction(request).await
}


#[update(name = "bitcoin_get_current_fee_percentiles")]
#[candid_method(update, rename = "bitcoin_get_current_fee_percentiles")]
pub fn bitcoin_get_current_fee_percentiles(
  request: GetCurrentFeePercentilesRequest,
) -> Vec<MillisatoshiPerByte> {
  btc_wallet_mod::get_current_fee_percentiles(request)
}

#[query(name = "get_config")]
#[candid_method(query, rename = "get_config")]
pub fn get_config() -> Config {
  btc_wallet_mod::get_config()
}

#[update(name = "set_config")]
#[candid_method(update, rename = "set_config")]
async fn set_config(request: SetConfigRequest) {
  btc_wallet_mod::set_config(request).await
}

#[query(name = "http_request")]
#[candid_method(query, rename = "http_request")]
pub fn http_request(request: HttpRequest) -> HttpResponse {
  btc_wallet_mod::http_request(request)
}


