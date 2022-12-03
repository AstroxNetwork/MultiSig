use ic_cdk::api;
use ic_cdk::export::Principal;
use async_trait::async_trait;
use tracing::error;

use crate::ego_types::{App, AppId, EgoError, Memo, WalletAppInstallRequest, WalletAppInstallResponse, WalletAppRemoveRequest, WalletMainNewResponse, WalletOrderNewRequest, WalletOrderNewResponse};
use crate::types::{AppMainListRequest, AppMainListResponse, QueryParam};

#[async_trait]
pub trait TEgoStore {
  async fn wallet_main_new(&self, ego_store_canister_id: Principal) -> Result<Principal, EgoError>;
}

pub struct EgoStore {

}

impl EgoStore{
  pub fn new() -> Self {
    EgoStore{}
  }
}

#[async_trait]
impl TEgoStore for EgoStore {
  async fn wallet_main_new(&self, ego_store_canister_id: Principal) -> Result<Principal, EgoError>{
    let (resp, ): (WalletMainNewResponse, ) = match api::call::call(
      ego_store_canister_id,
      "wallet_main_new",
      ()
    )
      .await
    {
      Ok(x) => x,
      Err((code, msg)) => {
        let code = code as u16;
        error!(
          error_code = code,
          error_message = msg.as_str(),
          "Error calling wallet_main_new"
        );
        return Err(EgoError { code, msg });
      }
    };

    Ok(resp.tenant_id)
  }
}