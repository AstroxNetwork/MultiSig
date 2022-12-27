use std::collections::BTreeMap;

use candid::candid_method;
use ic_btc_types::{MillisatoshiPerByte, Network, Utxo};
use ic_cdk::{caller, storage};
use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk::export::Principal;
use ic_cdk_macros::*;
use serde::Serialize;

use btc_wallet_mod::service::{BtcStore};
use btc_wallet_mod::tecdsa_signer::types::TSignerManager;
use btc_wallet_mod::types::{
  EgoBtcError, GetAddressResponse, SendRequest, SendResponse, UserBalanceResponse,
};

use ego_lib::{inject_ego_all};

use btc_wallet_mod::service::{canister_add, canister_get_one, log_add, is_owner, log_list, op_add, owner_add, owner_remove, owners_set, registry_post_upgrade, registry_pre_upgrade, user_add, user_remove, is_user, is_op, users_post_upgrade, users_pre_upgrade, users_set, app_info_pre_upgrade, app_info_post_upgrade};
use astrox_macros::user::User;
use astrox_macros::registry::Registry;
use astrox_macros::ego_types::{App};

inject_ego_all!();


#[init]
#[candid_method(init)]
pub fn init() {
  let caller = ic_cdk::api::caller();
  log_add(format!("btc_wallet: init, caller is {}", caller.clone()).as_str());
  log_add("==> add caller as the owner");
  owner_add(caller.clone());
  // TODO: Set btc_init
}

#[derive(CandidType, Deserialize, Serialize)]
struct PersistState {
  pub btc_store: BtcStore,
  pub signer: TSignerManager,
  users: Option<User>,
  registry: Option<Registry>,
  app_info: Option<AppInfo>,
}

#[pre_upgrade]
fn pre_upgrade() {
  log_add("btc wallet: pre_upgrade");
  let state = PersistState {
    btc_store: btc_wallet_mod::service::pre_upgrade(),
    signer: btc_wallet_mod::tecdsa_signer::state::pre_upgrade(),
    users: Some(users_pre_upgrade()),
    registry: Some(registry_pre_upgrade()),
    app_info: Some(app_info_pre_upgrade()),
  };
  storage::stable_save((state, )).unwrap();
}

#[post_upgrade]
fn post_upgrade() {
  log_add("btc wallet: post_upgrade");
  let (state, ): (PersistState, ) = storage::stable_restore().unwrap();

  btc_wallet_mod::service::post_upgrade(state.btc_store);
  btc_wallet_mod::tecdsa_signer::state::post_upgrade(state.signer);

  match state.users {
    None => {}
    Some(users) => {
      users_post_upgrade(users);
    }
  }

  match state.registry {
    None => {}
    Some(registry) => {
      registry_post_upgrade(registry);
    }
  }

  match state.app_info {
    None => {}
    Some(app_info) => {
      app_info_post_upgrade(app_info);
    }
  }
}

#[update(name = "btc_network_set", guard = "user_guard")]
#[candid_method(update, rename = "btc_network_set")]
fn btc_network_set(network: Network) -> Network {
  btc_wallet_mod::service::BtcService::set_network(network)
}

#[query(name = "btc_network_get")]
#[candid_method(query, rename = "btc_network_get")]
fn btc_network_get() -> Network {
  btc_wallet_mod::service::BtcService::get_network()
}

#[query(name = "btc_key_get", guard = "user_guard")]
#[candid_method(query, rename = "btc_key_get")]
fn btc_key_get() -> String {
  btc_wallet_mod::service::BtcService::get_key()
}

#[update(name = "btc_address_set", guard = "user_guard")]
#[candid_method(update, rename = "btc_address_set")]
async fn btc_address_set(path: String) -> String {
  btc_wallet_mod::service::BtcService::set_address(path).await
}

#[query(name = "btc_address_get")]
#[candid_method(query, rename = "btc_address_get")]
fn btc_address_get(path: String) -> Result<GetAddressResponse, EgoBtcError> {
  btc_wallet_mod::service::BtcService::get_address(path)
}

#[query(name = "btc_address_get_all", guard = "user_guard")]
#[candid_method(query, rename = "btc_address_get_all")]
fn btc_address_get_all() -> Vec<String> {
  btc_wallet_mod::service::BtcService::get_all_addresses()
}

#[update(name = "btc_balance_get")]
#[candid_method(update, rename = "btc_balance_get")]
async fn btc_balance_get(address: String) -> u64 {
  btc_wallet_mod::service::BtcService::get_balance(address).await
}

#[update(name = "btc_balance_path_get", guard = "user_guard")]
#[candid_method(update, rename = "btc_balance_path_get")]
async fn btc_balance_path_get(path: String) -> Result<UserBalanceResponse, EgoBtcError> {
  btc_wallet_mod::service::BtcService::get_user_balance(path).await
}

#[update(name = "btc_utxos_get")]
#[candid_method(update, rename = "btc_utxos_get")]
async fn btc_utxos_get(address: String) -> Vec<Utxo> {
  btc_wallet_mod::service::BtcService::get_utxos(address).await
}

#[update(name = "btc_tx_send", guard = "owner_guard")]
#[candid_method(update, rename = "btc_tx_send")]
async fn btc_tx_send(request: SendRequest) -> Result<SendResponse, EgoBtcError> {
  btc_wallet_mod::service::BtcService::send(
    request.request_id,
    request.path,
    request.to_address,
    request.amount_in_satoshi,
  )
    .await
}

#[update(name = "btc_fee_get")]
#[candid_method(update, rename = "btc_fee_get")]
async fn btc_get_fee() -> Vec<MillisatoshiPerByte> {
  btc_wallet_mod::service::BtcService::get_fees().await
}

#[query(name = "btc_get_txid")]
#[candid_method(query, rename = "btc_get_txid")]
fn btc_get_txid(request_id: u64) -> Option<String> {
  btc_wallet_mod::service::BtcService::get_tx_id(request_id)
}

#[query(name = "btc_is_user")]
#[candid_method(query, rename = "btc_is_user")]
fn btc_is_user() -> bool {
  is_user(caller())
}

#[query(name = "btc_is_owner")]
#[candid_method(query, rename = "btc_is_owner")]
fn btc_is_owner() -> bool {
  is_owner(caller())
}

