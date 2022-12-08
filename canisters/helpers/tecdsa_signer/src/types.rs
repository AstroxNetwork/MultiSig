use async_trait::async_trait;

use ic_cdk::export::candid::{CandidType, Deserialize, Principal};
use ic_certified_map::Hash;
use serde::Serialize;
use std::collections::BTreeMap;

pub type ChainCode = Vec<u8>;
pub type Pubkey = Vec<u8>;
pub type MessageHash = Vec<u8>;
pub type DerivedPath = Vec<Vec<u8>>;

#[derive(CandidType, Serialize, Debug)]
pub struct PublicKeyReply {
    pub public_key: Vec<u8>,
}

#[derive(CandidType, Serialize, Deserialize, Debug, Clone)]
pub struct SignatureReply {
    pub signature: Vec<u8>,
}

type CanisterId = Principal;

#[derive(CandidType, Serialize, Deserialize, Debug, Clone)]
pub struct ECDSAPublicKey {
    pub canister_id: Option<CanisterId>,
    pub derivation_path: DerivedPath,
    pub key_id: EcdsaKeyId,
}

#[derive(CandidType, Deserialize, Debug)]
pub struct ECDSAPublicKeyReply {
    pub public_key: Vec<u8>,
    pub chain_code: Vec<u8>,
}

#[derive(CandidType, Serialize, Debug)]
pub(crate) struct SignWithECDSA {
    pub message_hash: Vec<u8>,
    pub derivation_path: DerivedPath,
    pub key_id: EcdsaKeyId,
}

#[derive(CandidType, Deserialize, Debug)]
pub struct SignWithECDSAReply {
    pub signature: Vec<u8>,
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

pub type Curve = EcdsaCurve;

pub type PublicKeyPayload = ECDSAPublicKeyPayload;

#[derive(CandidType, Serialize, Debug, Clone)]
pub struct ECDSAPublicKeyPayload {
    pub public_key: Vec<u8>,
    pub chain_code: Vec<u8>,
}

#[async_trait]
pub trait GenericSigner {
    /// set curve
    fn create(path: String) -> Self;

    fn settings(&mut self, settings: ECDSASignerSetting);

    fn get_key_id(&self) -> EcdsaKeyId;

    fn get_key_name(&self) -> String;

    fn get_derived_path(&self) -> DerivedPath;

    fn get_curve(&self) -> Curve;

    fn get_cycles_signing(&self) -> u64;
    /// get key id
    /// store before return
    async fn get_public_key(&self) -> Result<ECDSAPublicKeyPayload, String>;
    /// sign bytes
    async fn sign(&self, message_hash: Vec<u8>) -> Result<SignatureReply, String>;
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct TecdsaSigner {
    pub public_key_req: ECDSAPublicKey,
    pub setting: ECDSASignerSetting,
    pub path_string: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ECDSASignerSetting {
    pub key_name: String,
    pub cycle_signing: u64,
    pub curve: Curve,
}

pub type DerivePathString = String;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ManagerPayload {
    pub principal: Principal,
    pub name: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct TSignerManager {
    pub signer_map: BTreeMap<DerivePathString, TecdsaSigner>,
    pub manager: BTreeMap<Principal, ManagerPayload>,
    pub message_cache: BTreeMap<Hash, SignatureReply>,
}
