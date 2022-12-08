use std::cell::RefCell;
use std::collections::HashMap;
use candid::Principal;
use ic_btc_types::{MillisatoshiPerByte, Network, Utxo};

use ic_cdk::caller;
use crate::{bitcoin_api, bitcoin_wallet};
use crate::types::{EgoBtcError, GetAddressResponse, SendResponse, UserBalanceResponse};

thread_local! {
    pub static BTCSTORE: RefCell<BtcStore> = RefCell::new(BtcStore::new());
}

pub struct BtcService {}

impl BtcService {
    pub fn is_manager(principal: Principal) -> bool {
        BTCSTORE.with(|b| b.borrow().is_manager(principal))
    }

    pub fn add_managers(managers: Vec<Principal>) -> u64 {
        BTCSTORE.with(|b| {
            let mut bb = b.borrow_mut();
            for manager in managers {
                bb.managers.insert(manager, "crond_manager".to_string());
            }
            bb.managers.len() as u64
        })
    }

    pub fn remove_managers(managers: Vec<Principal>) -> u64 {
        BTCSTORE.with(|b| {
            let mut bb = b.borrow_mut();
            for manager in managers {
                bb.managers.remove(&manager);
            }
            bb.managers.len() as u64
        })
    }

    pub fn set_network(network: Network) -> Network {
        BTCSTORE.with(|s| s.borrow_mut().network = network );
        network
    }

    pub fn get_network() -> Network {
        BTCSTORE.with(|s| s.borrow().network )
    }

    pub async fn set_user_address(username: String) -> String {
        let network = BTCSTORE.with(|s| s.borrow().network );
        let address = bitcoin_wallet::get_p2pkh_address(network, username.clone(), vec![]).await;
        BTCSTORE.with(|s| s.borrow_mut().user_address.insert(username.clone(), address.clone()));
        address
    }

    pub fn get_user_address(username: String) -> Result<GetAddressResponse, EgoBtcError> {
        match BTCSTORE.with(|s| s.borrow().user_address.get(&username).cloned() ) {
            Some(address) => {
                Ok(GetAddressResponse{
                    address
                })
            }
            None => Err(EgoBtcError::UserNotFound)
        }
    }

    pub fn get_all_users() -> Vec<String> {
        BTCSTORE.with(|s| s.borrow().user_address.keys().cloned().collect() )
    }

    pub async fn get_user_balance(username: String) -> Result<UserBalanceResponse, EgoBtcError> {
        let network = BTCSTORE.with(|s| s.borrow().network );
        let opt = BTCSTORE.with(|s|
            s.borrow().user_address.get(&username).cloned() );
        match opt {
            Some(address) => {
                let balance = bitcoin_api::get_balance(network, address).await;
                Ok(UserBalanceResponse{
                    balance
                })
            },
            None => Err(EgoBtcError::UserNotFound)
        }
    }

    pub async fn get_balance(address: String) -> u64 {
        let network = BTCSTORE.with(|s| s.borrow().network );
        bitcoin_api::get_balance(network, address).await
    }

    pub async fn get_utxos(address: String) -> Vec<Utxo> {
        let network = BTCSTORE.with(|s| s.borrow().network );
        let res = bitcoin_api::get_utxos(network, address).await;
        res.utxos
    }

    pub async fn get_fees() -> Vec<MillisatoshiPerByte> {
        let network = BTCSTORE.with(|s| s.borrow().network );
        bitcoin_api::get_current_fee_percentiles(network).await
    }

    pub async fn send(username: String, to_address: String, amount: u64) -> Result<SendResponse, EgoBtcError> {
        let network = BTCSTORE.with(|s| s.borrow().network );
        let opt = BTCSTORE.with(|s|
            s.borrow().user_address.get(&username).cloned() );
        match opt {
            Some(from_address) => {
                let tx = bitcoin_wallet::send(
                    network,
                    vec![],
                    username,
                    to_address,
                    amount.clone(),
                ).await;
                Ok(SendResponse{
                    from_address,
                    tx_id: tx.to_string(),
                    amount_in_satoshi: amount,
                })
            },
            None => Err(EgoBtcError::UserNotFound)
        }
    }
}

pub struct BtcStore {
    pub managers: HashMap<Principal, String>,
    pub user_address: HashMap<String, String>,
    pub network: Network,
}

impl BtcStore {
    pub fn new() -> Self {
        BtcStore {
            managers: HashMap::default(),
            user_address: HashMap::default(),
            network: Network::Testnet,
        }
    }

    pub fn init_manager(&mut self, caller: Principal) {
        self.managers.insert(caller, "init manager".to_string());
    }

    pub fn is_manager(&self, caller: Principal) -> bool {
        self.managers.contains_key(&caller)
    }
}

#[inline(always)]
pub fn manager_guard() -> Result<(), String> {
    if BTCSTORE.with(|b| b.borrow().is_manager(caller())) {
        Ok(())
    } else {
        Err(String::from("The caller is not the manager of contract"))
    }
}