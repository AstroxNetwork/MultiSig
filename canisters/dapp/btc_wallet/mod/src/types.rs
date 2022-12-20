use std::collections::BTreeMap;

use ic_btc_types::{Network, Utxo};
use ic_cdk::export::{
  candid::{CandidType, Deserialize},
  Principal,
  serde::Serialize,
};

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct AddManagersRequest {
  pub managers: Vec<Principal>,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct AddManagersResponse {
  pub manager_count: u64,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct RmManagersRequest {
  pub managers: Vec<Principal>,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct RmManagersResponse {
  pub manager_count: u64,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct SetNetworkRequest {
  pub network: Network,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct SetNetworkResponse {
  pub network: Network,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct GetNetworkResponse {
  pub network: Network,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct SetAddressRequest {
  pub username: String,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct SetAddressResponse {
  pub address: String,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct GetAddressRequest {
  pub username: String,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct GetAddressResponse {
  pub address: String,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct GetUsersResponse {
  pub users: Vec<String>,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct UserBalanceRequest {
  pub username: String,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct UserBalanceResponse {
  pub balance: u64,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct BalanceRequest {
  pub address: String,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct BalanceResponse {
  pub balance: u64,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct UtxosRequest {
  pub address: String,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct UtxosResponse {
  pub utxos: Vec<Utxo>,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct GetFeesResponse {
  pub fees: Vec<u64>,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct SendRequest {
  pub request_id: u64,
  pub path: String,
  pub to_address: String,
  pub amount_in_satoshi: u64,
  pub extended: BTreeMap<String, String>,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct SendResponse {
  pub from_address: String,
  pub tx_id: String,
  pub amount_in_satoshi: u64,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub enum EgoBtcError {
  AddressNotFound,
  UnknownError(String),
}

impl From<EgoBtcError> for EgoError {
  fn from(e: EgoBtcError) -> Self {
    match e {
      EgoBtcError::AddressNotFound => EgoError::new(8001, "address not found"),
      EgoBtcError::UnknownError(_) => EgoError::new(8003, "unknown error"),
    }
  }
}

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub struct ECDSAPublicKeyReply {
  pub public_key: Vec<u8>,
  pub chain_code: Vec<u8>,
}

#[derive(CandidType, Serialize, Deserialize, Debug, Clone)]
pub struct EcdsaKeyId {
  pub curve: EcdsaCurve,
  pub name: String,
}

#[derive(CandidType, Serialize, Deserialize, Debug, Clone)]
pub enum EcdsaCurve {
  #[serde(rename = "secp256k1")]
  Secp256k1,
}

#[derive(CandidType, Deserialize, Debug)]
pub struct SignWithECDSAReply {
  pub signature: Vec<u8>,
}

#[derive(CandidType, Serialize, Deserialize, Debug, Clone)]
pub struct ECDSAPublicKey {
  pub canister_id: Option<Principal>,
  pub derivation_path: Vec<Vec<u8>>,
  pub key_id: EcdsaKeyId,
}

#[derive(CandidType, Serialize, Debug)]
pub struct SignWithECDSA {
  pub message_hash: Vec<u8>,
  pub derivation_path: Vec<Vec<u8>>,
  pub key_id: EcdsaKeyId,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct EgoError {
  pub code: u16,
  pub msg: String,
}

impl EgoError {
  pub fn new(code: u16, msg: &str) -> Self {
    EgoError {
      code,
      msg: msg.to_string(),
    }
  }
}

impl From<std::string::String> for EgoError {
  fn from(msg: String) -> Self {
    EgoError { code: 255, msg }
  }
}
