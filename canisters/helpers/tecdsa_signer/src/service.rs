use ic_certified_map::Hash;
use itertools::Itertools;

use crate::state::SIGNER_STATE;
use crate::types::{
  EcdsaCurve, ECDSAPublicKeyPayload, ECDSASignerSetting, GenericSigner, ManagerPayload,
  SignatureReply, TecdsaSigner,
};
use crate::utils::cal_cache_key;

pub struct SignerService {}

impl SignerService {
  // pub fn add_manager(manager: ManagerPayload) {
  //     SIGNER_STATE.with(|s| s.borrow_mut().add_manager(manager))
  // }
  //
  // pub fn remove_manager(principal: Principal) {
  //     SIGNER_STATE.with(|s| s.borrow_mut().remove_manager(principal))
  // }
  //
  // pub fn is_manager(principal: Principal) -> bool {
  //     SIGNER_STATE.with(|s| s.borrow_mut().is_manager(principal))
  // }
  //
  // pub fn list_manager() -> Vec<ManagerPayload> {
  //     SIGNER_STATE.with(|s| s.borrow_mut().list_managers())
  // }

  pub async fn update_signer_setting(
    path: String,
    setting: ECDSASignerSetting,
  ) -> Result<(), String> {
    SIGNER_STATE.with(|s| {
      let mut sm = s.borrow_mut();
      match sm.get_signer_mut(path.clone()) {
        None => Err("Signer Not Found".to_string()),
        Some(r) => {
          r.settings(setting.clone());
          Ok(())
        }
      }
    })
  }

  pub async fn get_public_key(
    path: String,
    key_name: Option<String>,
  ) -> Result<ECDSAPublicKeyPayload, String> {
    let actual_key = {
      if key_name.is_some() {
        key_name.unwrap()
      } else {
        "dfx_test_key".to_string()
      }
    };
    match SIGNER_STATE.with(|s| {
      let mut sm = s.borrow_mut();
      match sm.get_signer_mut(path.clone()) {
        None => sm.create_signer(
          path.clone(),
          Some(ECDSASignerSetting {
            key_name: actual_key.clone(),
            cycle_signing: 10_000_000_000,
            curve: EcdsaCurve::Secp256k1,
          }),
        ),
        Some(r) => {
          r.settings(ECDSASignerSetting {
            key_name: actual_key.clone(),
            cycle_signing: 10_000_000_000,
            curve: EcdsaCurve::Secp256k1,
          });
          Ok(r.clone())
        }
      }
    }) {
      Ok(s) => s.get_public_key().await,
      Err(e) => Err(e),
    }
  }
  pub async fn sign(path: String, message_hash: Vec<u8>) -> Result<SignatureReply, String> {
    let hash_key = cal_cache_key(path.clone(), message_hash.clone());
    let state = SIGNER_STATE.with(|k| k.borrow().clone());
    let cached = state.get_sig_from_cache(hash_key.clone());
    if cached.is_some() {
      return Ok(cached.unwrap().clone());
    }
    match SIGNER_STATE.with(|s| {
      let mut sm = s.borrow_mut();
      match sm.get_signer(path) {
        None => Err("Signer Not found, please create first".to_string()),
        Some(r) => Ok(r),
      }
    }) {
      Ok(s) => s.sign(message_hash.clone()).await.and_then(|f| {
        SIGNER_STATE.with(|k| k.borrow_mut().cache_signature(hash_key.clone(), f.clone()));
        Ok(f.clone())
      }),
      Err(e) => Err(e),
    }
  }

  pub async fn sign_recoverable(
    path: String,
    message_hash: Vec<u8>,
  ) -> Result<SignatureReply, String> {
    let hash_key = cal_cache_key(path.clone(), message_hash.clone());
    let state = SIGNER_STATE.with(|k| k.borrow().clone());
    let cached = state.get_sig_from_cache(hash_key.clone());
    if cached.is_some() {
      return Ok(cached.unwrap().clone());
    }
    match SIGNER_STATE.with(|s| {
      let mut sm = s.borrow_mut();
      match sm.get_signer(path) {
        None => Err("Signer Not found, please create first".to_string()),
        Some(r) => Ok(r),
      }
    }) {
      Ok(s) => s
        .sign_recoverable(message_hash.clone())
        .await
        .and_then(|f| {
          SIGNER_STATE
            .with(|k| k.borrow_mut().cache_signature(hash_key.clone(), f.clone()));
          Ok(f.clone())
        }),
      Err(e) => Err(e),
    }
  }
}

// #[inline(always)]
// pub fn manager_guard() -> Result<(), String> {
//     if SIGNER_STATE.with(|b| b.borrow().is_manager(caller())) {
//         Ok(())
//     } else {
//         Err(String::from(
//             "The caller is not the app manager of contract",
//         ))
//     }
// }
