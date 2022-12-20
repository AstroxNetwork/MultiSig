mod actor;

#[allow(dead_code)]
#[cfg(any(target_arch = "wasm32", test))]
fn main() {}

#[allow(dead_code)]
#[cfg(not(any(target_arch = "wasm32", test)))]
fn main() {
  use btc_wallet_mod::types::*;
  use ic_btc_types::*;
  use ic_cdk::export::Principal;
  use btc_wallet_mod::service::LogEntry;

  candid::export_service!();
  std::print!("{}", __export_service());
}
