use std::collections::HashMap;

use ic_btc_types::{MillisatoshiPerByte, Network, Utxo};
use ic_cdk::export::candid::{CandidType, Deserialize};
use itertools::Itertools;
use serde::Serialize;
use std::cell::RefCell;
use tecdsa_signer::service::SignerService;

use crate::btc::bitcoin_wallet::public_key_to_p2pkh_address;
use crate::btc::{bitcoin_api, bitcoin_wallet};
use crate::types::{EgoBtcError, GetAddressResponse, SendResponse, UserBalanceResponse};

use ego_macros::inject_canister_all;

inject_canister_all!();

/********************  methods for canister_registry_macro   ********************/
fn on_canister_added(name: &str, canister_id: Principal) {
    log_add(
        format!(
            "on_canister_added name: {}, canister_id: {}",
            name, canister_id
        )
        .as_str(),
    );
}

thread_local! {
    pub static BTCSTORE: RefCell<BtcStore> = RefCell::new(BtcStore::default());
}
pub const DEFAULT_PATH: &str = "m/44'/0'/0'/0/0";

pub fn pre_upgrade() -> BtcStore {
    BTCSTORE.with(|s| s.take().into())
}

pub fn post_upgrade(stable_state: BtcStore) {
    BTCSTORE.with(|s| s.replace(stable_state));
}

pub struct BtcService {}

impl BtcService {
    pub fn set_network(network: Network) -> Network {
        BTCSTORE.with(|s| {
            let mut store = s.borrow_mut();
            store.network = network;
            store.ecdsa_key = match network {
                // For local development, we use a special test key with dfx.
                Network::Regtest => "dfx_test_key".to_string(),
                // On the IC we're using a test ECDSA key.
                Network::Mainnet | Network::Testnet => "test_key_1".to_string(),
            };
        });
        network
    }

    pub fn get_network() -> Network {
        BTCSTORE.with(|s| s.borrow().network)
    }
    pub fn get_key() -> String {
        BTCSTORE.with(|s| s.borrow().ecdsa_key.clone())
    }
    pub fn save_tx(request_id: u64, tx_id: String) {
        BTCSTORE.with(|s| s.borrow_mut().tx_map.insert(request_id, tx_id));
    }
    pub fn get_tx_id(request_id: u64) -> Option<String> {
        BTCSTORE.with(|s| {
            s.borrow_mut()
                .tx_map
                .get(&request_id)
                .map_or_else(|| None, |d| Some(d.clone()))
        })
    }

    pub async fn set_address(path: String) -> String {
        let network = BtcService::get_network();
        let key = BtcService::get_key();
        let pubkey = SignerService::get_public_key(path.clone(), Some(key.clone())).await;
        match pubkey {
            Ok(r) => {
                BTCSTORE.with(|s| {
                    s.borrow_mut()
                        .user_address
                        .insert(path.clone(), r.public_key.clone())
                });
                public_key_to_p2pkh_address(network, &r.public_key.clone())
            }
            Err(e) => ic_cdk::trap(e.as_str()),
        }
    }

    pub fn get_address(path: String) -> Result<GetAddressResponse, EgoBtcError> {
        match BTCSTORE.with(|s| s.borrow().user_address.get(&path).cloned()) {
            Some(address) => Ok(GetAddressResponse {
                address: BtcService::get_address_from_vec(address),
            }),
            None => Err(EgoBtcError::AddressNotFound),
        }
    }

    pub fn get_all_addresses() -> Vec<String> {
        BTCSTORE.with(|s| {
            s.borrow()
                .user_address
                .values()
                .map(|e| BtcService::get_address_from_vec(e.clone()))
                .collect_vec()
        })
    }

    pub async fn get_user_balance(path: String) -> Result<UserBalanceResponse, EgoBtcError> {
        let network = BTCSTORE.with(|s| s.borrow().network);
        let opt = BTCSTORE.with(|s| s.borrow().user_address.get(&path).cloned());
        match opt {
            Some(address) => {
                let balance =
                    bitcoin_api::get_balance(network, BtcService::get_address_from_vec(address))
                        .await;
                Ok(UserBalanceResponse { balance })
            }
            None => Err(EgoBtcError::AddressNotFound),
        }
    }

    pub async fn get_balance(address: String) -> u64 {
        let network = BTCSTORE.with(|s| s.borrow().network);
        bitcoin_api::get_balance(network, address).await
    }

    pub async fn get_utxos(address: String) -> Vec<Utxo> {
        let network = BTCSTORE.with(|s| s.borrow().network);
        let res = bitcoin_api::get_utxos(network, address).await;
        res.utxos
    }

    pub async fn get_fees() -> Vec<MillisatoshiPerByte> {
        let network = BTCSTORE.with(|s| s.borrow().network);
        bitcoin_api::get_current_fee_percentiles(network).await
    }

    pub fn get_address_from_vec(key: Vec<u8>) -> String {
        let network = BtcService::get_network();
        public_key_to_p2pkh_address(network, &key)
    }

    pub async fn send(
        request_id: u64,
        path: String,
        to_address: String,
        amount: u64,
    ) -> Result<SendResponse, EgoBtcError> {
        let network = BtcService::get_network();
        let key_name = BtcService::get_key();
        let opt = BTCSTORE.with(|s| s.borrow().user_address.get(&path).cloned());
        match opt {
            Some(from_address) => {
                let tx =
                    bitcoin_wallet::send(network, path, key_name, to_address, amount.clone()).await;
                BtcService::save_tx(request_id, tx.clone().to_string());
                Ok(SendResponse {
                    from_address: BtcService::get_address_from_vec(from_address),
                    tx_id: tx.clone().to_string(),
                    amount_in_satoshi: amount,
                })
            }
            None => Err(EgoBtcError::AddressNotFound),
        }
    }
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct BtcStore {
    pub user_address: HashMap<String, Vec<u8>>,
    pub network: Network,
    pub ecdsa_key: String,
    pub tx_map: BTreeMap<u64, String>,
}

impl Default for BtcStore {
    fn default() -> Self {
        BtcStore {
            //  managers: HashMap::default(),
            user_address: HashMap::default(),
            network: Network::Testnet,
            ecdsa_key: "test_key_1".to_string(),
            tx_map: Default::default(),
        }
    }
}
