use ic_cdk::api;
use ic_cdk::export::Principal;
use tracing::error;
use async_trait::async_trait;
use crate::ego_types::{EgoError, UserApp, WalletMainNewResponse};


#[async_trait]
pub trait TEgoStore {
  async fn wallet_main_new(&self) -> Result<UserApp, EgoError>;
}

pub struct EgoStore {
  pub canister_id: Principal,
}

impl EgoStore {
  pub fn new(canister_id: Principal) -> Self {
    EgoStore{
      canister_id
    }
  }
}

#[async_trait]
impl TEgoStore for EgoStore {
  async fn wallet_main_new(&self) -> Result<UserApp, EgoError>{
    let (resp, ): (WalletMainNewResponse, ) = match api::call::call(
      self.canister_id,
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

    Ok(resp.user_app)
  }
}