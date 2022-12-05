use std::collections::BTreeMap;
use ego_lib::ego_types::EgoError;
use ic_cdk::export::candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(CandidType, Deserialize, Serialize)]
pub struct AppActionCreateRequest {
  pub params: BTreeMap<String, String>
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct SystemErr {
  pub code: u16,
  pub msg: String
}

impl From<EgoError> for SystemErr {
  fn from(e: EgoError) -> Self {
    SystemErr{
      code: e.code,
      msg: e.msg
    }
  }
}

impl From<std::string::String> for SystemErr {
  fn from(msg: String) -> Self {
    SystemErr{
      code: 500,
      msg
    }
  }
}
