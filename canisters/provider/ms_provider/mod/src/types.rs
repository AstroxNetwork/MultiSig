use ic_cdk::export::candid::{CandidType, Deserialize};
use serde::Serialize;
use crate::ego_types::EgoError;


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
