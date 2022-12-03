use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk::export::Principal;
use serde::Serialize;

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct EgoError {
  pub code: u16,
  pub msg: String
}


#[derive(CandidType, Deserialize, Serialize)]
pub struct WalletMainNewResponse {
  pub user_app: UserApp,
}

pub type AppId = String;

#[derive(CandidType, Serialize, Deserialize, Clone, Copy, Debug, Default, Ord, PartialOrd, Eq, PartialEq)]
pub struct Version {
  pub major: u32,
  pub minor: u32,
  pub patch: u32,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct UserApp {
  pub app_id: AppId,
  pub current_version: Version,
  pub frontend: Option<Canister>,
  pub backend: Option<Canister>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Eq, PartialEq)]
pub enum CanisterType {
  BACKEND,
  ASSET,
}


#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Canister {
  pub canister_id: Principal,
  pub canister_type: CanisterType
}

