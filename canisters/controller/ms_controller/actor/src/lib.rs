use candid::{candid_method};
use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk::{storage};
use ic_cdk_macros::*;
use serde::Serialize;

use astrox_macros::inject_canister_registry;
use astrox_macros::inject_canister_users;
use ic_cdk::api::time;
use ms_controller_mod::app_wallet::AppWallet;
use ms_controller_mod::ego_lib::ego_store::EgoStore;
use ms_controller_mod::model::{Action, Controller, Sign};
use ms_controller_mod::service::Service;
use ms_controller_mod::state::CONTROLLER;
use ms_controller_mod::types::{AppActionCreateRequest, Errors, SystemErr};
use ms_controller_mod::types::Errors::TooManyUser;

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
  owner_add(caller.clone());
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


#[update(name = "controller_init")]
#[candid_method(update, rename = "controller_init")]
fn controller_init(total_user_amount: u16, threshold_user_amount: u16) {
  ic_cdk::println!("controller: controller_init");

  CONTROLLER.with(|controller| {
    controller.borrow_mut().total_user_amount = total_user_amount;
    controller.borrow_mut().threshold_user_amount = threshold_user_amount;
  });
}

/* ===== begin user relative method ===== */
#[update(name = "role_user_add", guard = "owner_guard")]
#[candid_method(update, rename = "role_user_add")]
fn role_user_add(name: String, user_id: Principal) -> Result<(), SystemErr> {
  ic_cdk::println!("controller: role_user_add");

  CONTROLLER.with(|controller| {
    let user_count = users().unwrap().len() as u16;
    if controller.borrow().total_user_amount > user_count {
      user_add_with_name(name, user_id);
      Ok(())
    } else {
      Err(SystemErr::from(TooManyUser))
    }
  })
}

#[update(name = "role_user_remove", guard = "owner_guard")]
#[candid_method(update, rename = "role_user_remove")]
fn role_user_remove(user_id: Principal) -> Result<(), SystemErr> {
  ic_cdk::println!("controller: role_user_remove");

  user_remove(user_id);

  Ok(())
}

#[query(name = "user_list", guard = "owner_guard")]
#[candid_method(query, rename = "user_list")]
fn user_list() -> Result<BTreeMap<Principal, String>, SystemErr> {
  ic_cdk::println!("controller: user_list");

  Ok(users().unwrap())
}
/* ===== end user relative method ===== */

#[update(name = "app_main_create")]
#[candid_method(update, rename = "app_main_create")]
async fn app_main_create() -> Result<(), SystemErr> {
  ic_cdk::println!("controller: install_app");

  let canister_id = REGISTRY.with(|registry| registry.borrow().canister_get_one("ego_store")).unwrap();

  let ego_store = EgoStore::new(canister_id);

  Service::app_main_create(ego_store, "btc_wallet".to_string()).await
}

#[update(name = "app_action_create")]
#[candid_method(update, rename = "app_action_create")]
fn app_action_create(req: AppActionCreateRequest) -> Result<Action, SystemErr> {
  ic_cdk::println!("controller: app_action_create");

  let action = Service::app_action_create(req.params, time());
  Ok(action)
}

#[query(name = "app_action_get")]
#[candid_method(query, rename = "app_action_get")]
fn app_action_get(action_id: u64) -> Result<Action, SystemErr> {
  ic_cdk::println!("controller: app_action_get");

  Service::app_action_get(action_id)
}


#[query(name = "app_action_list")]
#[candid_method(update, rename = "app_action_list")]
fn app_action_list() -> Result<Vec<Action>, SystemErr> {
  ic_cdk::println!("controller: app_action_list");

  let actions = Service::app_action_list();
  Ok(actions)
}

#[query(name = "action_sign_create")]
#[candid_method(update, rename = "action_sign_create")]
fn action_sign_create(action_id: u64) -> Result<Sign, SystemErr> {
  ic_cdk::println!("controller: app_action_list");

  let app = CONTROLLER.with(|controller| controller.borrow().app);

  match app {
    None => {
      Err(SystemErr::from(Errors::AppNotInstalled))
    }
    Some(canister_id) => {
      let app_wallet = AppWallet::new(canister_id);
      let user_id = caller();
      Service::action_sign_create(app_wallet, action_id, &user_id, time())
    }
  }
}