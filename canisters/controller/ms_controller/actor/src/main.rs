mod actor;

#[allow(dead_code)]
#[cfg(any(target_arch = "wasm32", test))]
fn main() {}

#[allow(dead_code)]
#[cfg(not(any(target_arch = "wasm32", test)))]
fn main() {
  use ic_cdk::export::Principal;
  use ms_controller_mod::model::*;
  use ms_controller_mod::types::*;
  use std::collections::BTreeMap;
  use ego_types::app::{UserApp, AppId, Version};
  use ego_types::app_info::AppInfo;
  use ego_types::cycle_info::*;

  candid::export_service!();
  std::print!("{}", __export_service());
}
