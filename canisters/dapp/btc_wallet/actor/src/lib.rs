use candid::candid_method;
use candid::Principal as CanPrincipal;
use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk_macros::*;
use serde::Serialize;

use astrox_macros::inject_canister_registry;
use astrox_macros::inject_canister_users;
use btc_wallet_mod::service::BtcStore;
use btc_wallet_mod::tecdsa_signer::types::TSignerManager;
use btc_wallet_mod::types::{
    EgoBtcError, GetAddressResponse, SendRequest, SendResponse, UserBalanceResponse,
};
use ego_lib::inject_ego_macros;
use ic_btc_types::{
    GetBalanceRequest, GetCurrentFeePercentilesRequest, GetUtxosRequest, GetUtxosResponse,
    MillisatoshiPerByte, Network, Satoshi, SendTransactionRequest, Utxo,
};
use ic_cdk::storage;

inject_canister_users!();
inject_canister_registry!();
inject_ego_macros!();

/********************  methods for canister_registry_macro   ********************/
fn on_canister_added(name: &str, canister_id: Principal) {
    ic_cdk::println!(
        "on_canister_added name: {}, canister_id: {}",
        name,
        canister_id
    );
    // user_add_with_name(name.to_string(), canister_id);
}

#[init]
#[candid_method(init)]
pub fn init() {
    let caller = ic_cdk::api::caller();
    ic_cdk::println!("btc_wallet: init, caller is {}", caller.clone());
    ic_cdk::println!("==> add caller as the owner");
    owner_add(caller.clone());
    // TODO: Set btc_init
}

#[derive(CandidType, Deserialize, Serialize)]
struct PersistState {
    pub btc_store: BtcStore,
    pub signer: TSignerManager,
    pub user: User,
}

#[pre_upgrade]
fn pre_upgrade() {
    ic_cdk::println!("btc wallet: pre_upgrade");
    let state = PersistState {
        btc_store: btc_wallet_mod::service::pre_upgrade(),
        signer: btc_wallet_mod::tecdsa_signer::state::pre_upgrade(),
        user: users_pre_upgrade(),
    };
    storage::stable_save((state,)).unwrap();
}

#[post_upgrade]
fn post_upgrade() {
    ic_cdk::println!("btc wallet: post_upgrade");
    let (state,): (PersistState,) = storage::stable_restore().unwrap();
    users_post_upgrade(state.user);
    btc_wallet_mod::service::post_upgrade(state.btc_store);
    btc_wallet_mod::tecdsa_signer::state::post_upgrade(state.signer);
}

#[update(name = "btc_network_set", guard = "owner_or_user_guard")]
#[candid_method(update, rename = "btc_network_set")]
fn btc_network_set(network: Network) -> Network {
    btc_wallet_mod::service::BtcService::set_network(network)
}

#[query(name = "btc_network_get")]
#[candid_method(query, rename = "btc_network_get")]
fn btc_network_get() -> Network {
    btc_wallet_mod::service::BtcService::get_network()
}

#[query(name = "btc_key_get", guard = "owner_or_user_guard")]
#[candid_method(query, rename = "btc_key_get")]
fn btc_key_get() -> String {
    btc_wallet_mod::service::BtcService::get_key()
}

#[update(name = "btc_address_set", guard = "owner_or_user_guard")]
#[candid_method(update, rename = "btc_address_set")]
async fn btc_address_set(path: String) -> String {
    btc_wallet_mod::service::BtcService::set_address(path).await
}

#[query(name = "btc_address_get")]
#[candid_method(query, rename = "btc_address_get")]
fn btc_address_get(path: String) -> Result<GetAddressResponse, EgoBtcError> {
    btc_wallet_mod::service::BtcService::get_address(path)
}

#[query(name = "btc_address_get_all", guard = "owner_or_user_guard")]
#[candid_method(query, rename = "btc_address_get_all")]
fn btc_address_get_all() -> Vec<String> {
    btc_wallet_mod::service::BtcService::get_all_addresses()
}

#[update(name = "btc_balance_get")]
#[candid_method(update, rename = "btc_balance_get")]
async fn btc_balance_get(address: String) -> u64 {
    btc_wallet_mod::service::BtcService::get_balance(address).await
}

#[update(name = "btc_balance_path_get", guard = "owner_or_user_guard")]
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

#[inline(always)]
pub fn owner_or_user_guard() -> Result<(), String> {
    let caller = ic_cdk::api::caller();
    if is_owner(caller.clone()) || is_user(caller.clone()) {
        Ok(())
    } else {
        trap(&format!("{} unauthorized", caller));
    }
}
