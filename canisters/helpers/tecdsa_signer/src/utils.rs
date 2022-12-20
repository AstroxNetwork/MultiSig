use std::str::FromStr;

use bitcoin::util::bip32::{ChildNumber, DerivationPath};
use hdpath::{Error, HDPath, StandardHDPath};
use ic_certified_map::Hash;
use itertools::Itertools;

use crate::hash;
use crate::types::DerivedPath;

pub fn get_derive_path_bytes(path: String) -> Result<DerivedPath, String> {
  match StandardHDPath::from_str(&path.as_str()) {
    Ok(r) => Ok(DerivationPath::from(r)
      .as_ref()
      .iter()
      .map(|f| f.to_string().as_bytes().to_vec())
      .collect_vec()),
    Err(_) => Err(String::from("DerivePath incorrect")),
  }
}

pub fn get_derive_path_from_string(path: String) -> Result<DerivationPath, String> {
  match StandardHDPath::from_str(&path.as_str()) {
    Ok(r) => Ok(DerivationPath::from(r)),
    Err(_) => Err(String::from("DerivePath incorrect")),
  }
}

pub fn cal_cache_key(path: String, message: Vec<u8>) -> Hash {
  let mut blob: Vec<u8> = vec![];
  let string_anchor_blob = path.bytes();
  blob.push(string_anchor_blob.len() as u8);
  blob.extend(string_anchor_blob);
  blob.push(message.len() as u8);
  blob.extend_from_slice(&message.as_slice());
  hash::hash_bytes(blob)
}
