use candid::candid_method;
use candid::Principal as CanPrincipal;
use ic_cdk_macros::*;
use std::collections::BTreeMap;

use astrox_macros::inject_canister_users;
use btc_wallet_mod::ego_lib::inject_ego_macros;
use btc_wallet_mod::types::{
    EgoBtcError, GetAddressResponse, SendRequest, SendResponse, UserBalanceResponse,
};
use ic_btc_types::{
    GetBalanceRequest, GetCurrentFeePercentilesRequest, GetUtxosRequest, GetUtxosResponse,
    MillisatoshiPerByte, Network, Satoshi, SendTransactionRequest, Utxo,
};

inject_canister_users!();
inject_ego_macros!();


#[init]
#[candid_method(init)]
pub fn init() {
    let caller = ic_cdk::api::caller();
    ic_cdk::println!("btc_wallet: init, caller is {}", caller.clone());
    ic_cdk::println!("==> add caller as the owner");
    owner_add(caller.clone());
    // TODO: Set btc_init
}

#[update(name = "btc_network_set")]
#[candid_method(update, rename = "btc_network_set")]
fn btc_network_set(network: Network) -> Network {
    btc_wallet_mod::service::BtcService::set_network(network)
}

#[query(name = "btc_network_get")]
#[candid_method(query, rename = "btc_network_get")]
fn btc_network_get() -> Network {
    btc_wallet_mod::service::BtcService::get_network()
}

#[update(name = "btc_address_set")]
#[candid_method(update, rename = "btc_address_set")]
async fn btc_address_set(path: String) -> String {
    btc_wallet_mod::service::BtcService::set_address(path).await
}

#[query(name = "btc_address_get")]
#[candid_method(query, rename = "btc_address_get")]
async fn btc_address_get(path: String) -> Result<GetAddressResponse, EgoBtcError> {
    btc_wallet_mod::service::BtcService::get_address(path)
}

#[query(name = "btc_address_get_all")]
#[candid_method(query, rename = "btc_address_get_all")]
async fn btc_address_get_all() -> Vec<String> {
    btc_wallet_mod::service::BtcService::get_all_addresses()
}

#[update(name = "btc_balance_get")]
#[candid_method(update, rename = "btc_balance_get")]
async fn btc_balance_get(address: String) -> u64 {
    btc_wallet_mod::service::BtcService::get_balance(address).await
}

#[update(name = "btc_balance_path_get")]
#[candid_method(update, rename = "btc_balance_path_get")]
async fn btc_balance_path_get(path: String) -> Result<UserBalanceResponse, EgoBtcError> {
    btc_wallet_mod::service::BtcService::get_user_balance(path).await
}

#[update(name = "btc_utxos_get")]
#[candid_method(update, rename = "btc_utxos_get")]
async fn btc_utxos_get(address: String) -> Vec<Utxo> {
    btc_wallet_mod::service::BtcService::get_utxos(address).await
}

#[update(name = "btc_tx_send")]
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
