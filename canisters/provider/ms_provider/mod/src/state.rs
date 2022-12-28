use std::cell::RefCell;

use crate::model::Provider;

use ego_macros::{inject_canister_all};

inject_canister_all!();

/********************  methods for canister_registry_macro   ********************/
fn on_canister_added(name: &str, canister_id: Principal) {
  log_add(format!("on_canister_added name: {}, canister_id: {}", name, canister_id).as_str());
}

thread_local! {
  pub static PROVIDER: RefCell<Provider> = RefCell::new(Provider::new());
}
