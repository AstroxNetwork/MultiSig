use std::collections::BTreeMap;

use candid::candid_method;
use ic_cdk::{caller, id, storage};
use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk::export::Principal;
use ic_cdk_macros::*;
use serde::Serialize;

use ms_provider_mod::ego_lib;
use ms_provider_mod::ego_lib::ego_canister::{EgoCanister, TEgoCanister};
use ms_provider_mod::ego_lib::ego_store::EgoStore;
use ms_provider_mod::ego_lib::inject_ego_macros;
use ms_provider_mod::model::{Controller, Provider};
use ms_provider_mod::ms_controller::MsController;
use ms_provider_mod::service::{canister_add, canister_get_one, ego_log, is_owner, log_list, op_add, owner_add, owner_remove, owners_set, Registry, registry_post_upgrade, registry_pre_upgrade, Service, User, USER, user_add, user_remove, users_post_upgrade, users_pre_upgrade, users_set};
use ms_provider_mod::state::PROVIDER;
use ms_provider_mod::types::{ControllerMainCreateRequest, Errors, SystemErr};

inject_ego_macros!();



#[init]
#[candid_method(init)]
pub fn init() {
  let caller = caller();
  ego_log(format!("ms_provider: init, caller is {}", caller.clone()).as_str());

  ego_log("==> add caller as the owner");
  owner_add(caller.clone());
}

#[derive(CandidType, Deserialize, Serialize)]
struct PersistState {
  pub provider: Provider,
  pub user: User,
  pub registry: Registry,
}

#[pre_upgrade]
fn pre_upgrade() {
  ego_log("ms_provider: pre_upgrade");

  let provider = PROVIDER.with(|provider| provider.borrow().clone());
  let user = users_pre_upgrade();
  let registry = registry_pre_upgrade();

  let state = PersistState { provider, user, registry };
  storage::stable_save((state, )).unwrap();
}

#[post_upgrade]
fn post_upgrade() {
  ego_log("ms_provider: post_upgrade");

  let (state, ): (PersistState, ) = storage::stable_restore().unwrap();
  PROVIDER.with(|provider| *provider.borrow_mut() = state.provider);

  users_post_upgrade(state.user);
  registry_post_upgrade(state.registry)
}

#[query(name = "controller_main_list")]
#[candid_method(query, rename = "controller_main_list")]
fn controller_main_list() -> Result<Vec<Controller>, SystemErr> {
  ego_log("ms_provider: controller_main_list");
  let user = caller();
  let controllers = Service::controller_main_list(&user);
  Ok(controllers)
}

#[query(name = "controller_main_get")]
#[candid_method(query, rename = "controller_main_get")]
pub fn controller_main_get(controller_id: Principal) -> Result<Controller, SystemErr> {
  ego_log("ms_provider: controller_main_get");
  let user = caller();
  match Service::controller_main_get(&user, &controller_id) {
    Some(controller) => Ok(controller),
    None => Err(SystemErr::from(Errors::NotFound)),
  }
}

#[update(name = "controller_main_create")]
#[candid_method(update, rename = "controller_main_create")]
pub async fn controller_main_create(request: ControllerMainCreateRequest) -> Result<Controller, SystemErr> {
  ego_log("ms_provider: controller_main_create");
  let user = caller();

  let canister_id = canister_get_one("ego_store").unwrap();
  let ego_store = EgoStore::new(canister_id);

  let ms_controller = MsController::new();

  match Service::controller_main_create(ego_store, ms_controller, &user, request.name, request.total_user_amount, request.threshold_user_amount).await {
    Ok(controller) => {
      let provider_principal = id();
      ego_log("3. register provider");
      let ego_canister = EgoCanister::new();
      ego_canister.ego_canister_add(controller.id, "provider".to_string(), provider_principal);

      ego_log("4. remove provider as controller");
      ego_canister.ego_controller_remove(controller.id, provider_principal);

      ego_log("5. remove provider as owner");
      ego_canister.ego_owner_remove(controller.id, provider_principal);


      Ok(controller)
    }
    Err(e) => Err(e),
  }
}

#[update(name = "controller_user_add")]
#[candid_method(update, rename = "controller_user_add")]
pub fn controller_user_add(user_id: Principal) {
  ego_log("ms_provider: controller_user_add");
  let controller_id = caller();

  Service::controller_user_add(&controller_id, &user_id);
}

#[update(name = "controller_user_remove")]
#[candid_method(update, rename = "controller_user_remove")]
pub fn controller_user_remove(user_id: Principal) {
  ego_log("ms_provider: controller_user_remove");
  let controller_id = caller();

  Service::controller_user_remove(&controller_id, &user_id);
}

