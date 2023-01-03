use std::collections::BTreeMap;

use candid::candid_method;
use ic_btc_types::{MillisatoshiPerByte, Network, Utxo};
use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk::export::Principal;
use ic_cdk::{caller, storage};
use ic_cdk_macros::*;
use serde::Serialize;

use btc_wallet_mod::btc::bitcoin_service::{BtcService, BtcStore};
use btc_wallet_mod::tecdsa_signer::types::TSignerManager;
use btc_wallet_mod::types::{
    EgoBtcError, GetAddressResponse, SendRequest, SendResponse, UserBalanceResponse,
};

use btc_wallet_mod::btc::bitcoin_service::{
    app_info_post_upgrade, app_info_pre_upgrade, canister_add, canister_get_one, is_op, is_owner,
    is_user, log_add, log_list, op_add, owner_add, owner_remove, owners_set, registry_post_upgrade,
    registry_pre_upgrade, user_add, user_remove, users_post_upgrade, users_pre_upgrade, users_set,
};
use ego_types::app::App;
use ego_types::registry::Registry;
use ego_types::user::User;

use btc_wallet_mod::btc::bitcoin_service;
use ego_macros::{
    inject_ego_app_info, inject_ego_controller, inject_ego_log, inject_ego_registry,
    inject_ego_user,
};
inject_ego_user!();
inject_ego_registry!();
inject_ego_controller!();
inject_ego_log!();
inject_ego_app_info!();

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
        btc_store: bitcoin_service::pre_upgrade(),
        signer: tecdsa_signer::state::pre_upgrade(),
        users: Some(users_pre_upgrade()),
        registry: Some(registry_pre_upgrade()),
        app_info: Some(app_info_pre_upgrade()),
    };
    storage::stable_save((state,)).unwrap();
}

#[post_upgrade]
fn post_upgrade() {
    log_add("btc wallet: post_upgrade");
    let (state,): (PersistState,) = storage::stable_restore().unwrap();

    bitcoin_service::post_upgrade(state.btc_store);
    tecdsa_signer::state::post_upgrade(state.signer);

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
    BtcService::set_network(network)
}

#[query(name = "btc_network_get")]
#[candid_method(query, rename = "btc_network_get")]
fn btc_network_get() -> Network {
    BtcService::get_network()
}

#[query(name = "btc_key_get", guard = "user_guard")]
#[candid_method(query, rename = "btc_key_get")]
fn btc_key_get() -> String {
    BtcService::get_key()
}

#[update(name = "btc_address_set", guard = "user_guard")]
#[candid_method(update, rename = "btc_address_set")]
async fn btc_address_set(path: String) -> String {
    BtcService::set_address(path).await
}

#[query(name = "btc_address_get")]
#[candid_method(query, rename = "btc_address_get")]
fn btc_address_get(path: String) -> Result<GetAddressResponse, EgoBtcError> {
    BtcService::get_address(path)
}

#[query(name = "btc_address_get_all", guard = "user_guard")]
#[candid_method(query, rename = "btc_address_get_all")]
fn btc_address_get_all() -> Vec<String> {
    BtcService::get_all_addresses()
}

#[update(name = "btc_balance_get")]
#[candid_method(update, rename = "btc_balance_get")]
async fn btc_balance_get(address: String) -> u64 {
    BtcService::get_balance(address).await
}

#[update(name = "btc_balance_path_get", guard = "user_guard")]
#[candid_method(update, rename = "btc_balance_path_get")]
async fn btc_balance_path_get(path: String) -> Result<UserBalanceResponse, EgoBtcError> {
    BtcService::get_user_balance(path).await
}

#[update(name = "btc_utxos_get")]
#[candid_method(update, rename = "btc_utxos_get")]
async fn btc_utxos_get(address: String) -> Vec<Utxo> {
    BtcService::get_utxos(address).await
}

#[update(name = "btc_tx_send", guard = "owner_guard")]
#[candid_method(update, rename = "btc_tx_send")]
async fn btc_tx_send(request: SendRequest) -> Result<SendResponse, EgoBtcError> {
    BtcService::send(
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
    BtcService::get_fees().await
}

#[query(name = "btc_get_txid")]
#[candid_method(query, rename = "btc_get_txid")]
fn btc_get_txid(request_id: u64) -> Option<String> {
    BtcService::get_tx_id(request_id)
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
