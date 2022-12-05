use candid::{candid_method};
use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk::{storage};
use ic_cdk_macros::*;
use serde::Serialize;

use astrox_macros::inject_canister_registry;
use astrox_macros::inject_canister_users;
use ms_controller_mod::ego_lib::ego_store::EgoStore;
use ms_controller_mod::model::{Action, Controller};
use ms_controller_mod::service::Service;
use ms_controller_mod::state::CONTROLLER;
use ms_controller_mod::types::{AppActionCreateRequest, SystemErr};

inject_canister_users!();
inject_canister_registry!();

/********************  methods for canister_registry_macro   ********************/
fn on_canister_added(_name: &str, _canister_id: Principal) {
}

#[init]
#[candid_method(init)]
pub fn init() {
  let caller = caller();
  ic_cdk::println!("ms_provider: init, caller is {}", caller.clone());

  ic_cdk::println!("==> add caller as the owner");
  users_init(caller.clone());
}

#[derive(CandidType, Deserialize, Serialize)]
struct PersistState {
  pub controller: Controller,
  pub user: User,
  pub registry: Registry,
}

#[pre_upgrade]
fn pre_upgrade() {
  ic_cdk::println!("controller:pre_upgrade");

  let controller = CONTROLLER.with(|controller| controller.borrow().clone());
  let user = users_pre_upgrade();
  let registry = registry_pre_upgrade();

  let state = PersistState { controller, user, registry };
  storage::stable_save((state,)).unwrap();
}

#[post_upgrade]
fn post_upgrade() {
  ic_cdk::println!("controller:post_upgrade");

  let (state,): (PersistState,) = storage::stable_restore().unwrap();
  CONTROLLER.with(|controller| *controller.borrow_mut() = state.controller);

  users_post_upgrade(state.user);
  registry_post_upgrade(state.registry)
}


/********************  methods for ego_store   ********************/
#[update(name = "install_app")]
#[candid_method(update, rename = "install_app")]
async fn install_app() -> Result<(), SystemErr> {
  ic_cdk::println!("controller: install_app");

  let canister_id = REGISTRY.with(|registry| registry.borrow().canister_get_one("ego_store")).unwrap();

  let ego_store = EgoStore::new(canister_id);

  Service::app_main_create(ego_store, "btc_wallet".to_string()).await
}

#[update(name = "app_action_create")]
#[candid_method(update, rename = "app_action_create")]
fn app_action_create(req: AppActionCreateRequest) -> Result<Action, SystemErr> {
  ic_cdk::println!("controller: app_action_create");

  let action = Service::app_action_create(req.params);
  Ok(action)
}

#[query(name = "app_action_list")]
#[candid_method(update, rename = "app_action_list")]
fn app_action_list() -> Result<Vec<Action>, SystemErr> {
  ic_cdk::println!("controller: app_action_list");

  let actions = Service::app_action_list();
  Ok(actions)
}
