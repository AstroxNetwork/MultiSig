use ego_lib::ego_types::EgoError;
use ic_cdk::export::candid::{CandidType, Deserialize};
use serde::Serialize;


#[derive(CandidType, Deserialize, Serialize)]
pub struct ControllerMainCreateRequest {
    pub name: String,
    pub total_user_amount: u16,
    pub threshold_user_amount: u16,
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

pub enum Errors {
    NotFound
}

impl From<Errors> for SystemErr {
    fn from(e: Errors) -> Self {
        match e {
            Errors::NotFound => SystemErr::new(1000, "Not Found"),
        }
    }
}
