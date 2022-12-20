use std::str::Bytes;

use ic_cdk::export::Principal;
use ic_certified_map::Hash;

use crate::hash;
use crate::types::EcdsaCurve;

impl EcdsaCurve {
  pub const PREFIX_256K1: &'static str = "\x0Atecdsa";
  // pub const PREFIX_25519: &'static str = "\x0Aedward";

  fn get_prefix(&self) -> Vec<u8> {
    match self {
      // Self::Ed25519 => EcdsaCurve::PREFIX_25519.as_bytes().to_vec(),
      Self::Secp256k1 => EcdsaCurve::PREFIX_256K1.as_bytes().to_vec(),
    }
  }

  pub fn get_key_name(&self, principal: Principal, name: String, salt: Option<Bytes>) -> String {
    let ret = calculate_seed(principal.to_text(), name.as_bytes().to_vec(), salt);
    let output = multibase::encode(multibase::Base::Base58Btc, ret);
    output
  }
}

pub fn calculate_seed(string_anchor: String, fix_bytes: Vec<u8>, ext_bytes: Option<Bytes>) -> Hash {
  let mut blob: Vec<u8> = vec![];
  blob.push(fix_bytes.len() as u8);
  blob.extend_from_slice(&fix_bytes.as_slice());

  let string_anchor_str = string_anchor.to_string();
  let string_anchor_blob = string_anchor_str.bytes();
  blob.push(string_anchor_blob.len() as u8);
  blob.extend(string_anchor_blob);
  if ext_bytes.is_some() {
    let b = ext_bytes.unwrap();
    blob.push(b.len() as u8);
    blob.extend(b.clone());
  }
  hash::hash_bytes(blob)
}
