use std::cell::RefCell;

use ego_macros::{inject_app_info, inject_ego_data};

use crate::model::Provider;

inject_ego_data!();
inject_app_info!();

/********************  methods for canister_registry_macro   ********************/
fn on_canister_added(name: &str, canister_id: Principal) {
  info_log_add(format!("on_canister_added name: {}, canister_id: {}", name, canister_id).as_str());
}

thread_local! {
  pub static PROVIDER: RefCell<Provider> = RefCell::new(Provider::new());
}
