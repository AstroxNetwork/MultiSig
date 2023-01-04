mod actor;

#[allow(dead_code)]
#[cfg(any(target_arch = "wasm32", test))]
fn main() {}

#[allow(dead_code)]
#[cfg(not(any(target_arch = "wasm32", test)))]
fn main() {
  use ic_cdk::export::Principal;
  use ms_provider_mod::model::*;
  use ms_provider_mod::types::*;
  use ego_types::app::{AppId, Version};
  use ego_types::app_info::AppInfo;

  candid::export_service!();
  std::print!("{}", __export_service());
}
