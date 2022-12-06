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

impl SystemErr {
  pub fn new(code: u16, msg: &str) -> Self {
    SystemErr {
      code,
      msg: msg.to_string(),
    }
  }
}

pub enum Errors {
  NotFound,
  SystemError,
  Signed,
  WrongStatus,
  TooManyUser,
  AppNotInstalled
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

impl From<Errors> for SystemErr {
  fn from(e: Errors) -> Self {
    match e {
      Errors::NotFound => SystemErr::new(1000, "Not Found"),
      Errors::SystemError => SystemErr::new(1001, "System Error"),
      Errors::Signed => SystemErr::new(1002, "Already Signed"),
      Errors::WrongStatus  => SystemErr::new(1003, "Wrong Status"),
      Errors::TooManyUser  => SystemErr::new(1004, "Too Many Users"),
      Errors::AppNotInstalled => SystemErr::new(1005, "Wallet App Not Installed"),
    }
  }
}
