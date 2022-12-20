use std::collections::BTreeMap;

use candid::candid_method;
use ic_cdk::{api, caller, storage};
use ic_cdk::api::time;
use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk::export::Principal;
use ic_cdk_macros::*;
use serde::Serialize;

use ms_controller_mod::app_wallet::AppWallet;
use ms_controller_mod::ego_lib::ego_canister::EgoCanister;
use ms_controller_mod::ego_lib::ego_store::EgoStore;
use ms_controller_mod::ego_lib::inject_ego_macros;
use ms_controller_mod::model::{Action, Controller, Sign};
use ms_controller_mod::service::{Service, user_add_with_name, users};
use ms_controller_mod::service::{canister_add, canister_get_one, ego_log, is_owner, log_list_after, LogEntry, op_add, owner_add, owner_remove, owners_set, Registry, registry_post_upgrade, registry_pre_upgrade, User, USER, user_add, user_remove, users_post_upgrade, users_pre_upgrade, users_set};
use ms_controller_mod::state::CONTROLLER;
use ms_controller_mod::types::{AppActionCreateRequest, Errors, SystemErr};
use ms_controller_mod::types::Errors::TooManyUser;

inject_ego_macros!();


#[init]
#[candid_method(init)]
pub fn init() {
  let caller = caller();
  ego_log(format!("controller: init, caller is {}", caller.clone()).as_str());

  ego_log("==> add caller as the owner");
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
  ego_log("controller: pre_upgrade");

  let controller = CONTROLLER.with(|controller| controller.borrow().clone());
  let user = users_pre_upgrade();
  let registry = registry_pre_upgrade();

  let state = PersistState {
    controller,
    user,
    registry,
  };
  storage::stable_save((state, )).unwrap();
}

#[post_upgrade]
fn post_upgrade() {
  ego_log("controller: post_upgrade");

  let (state, ): (PersistState, ) = storage::stable_restore().unwrap();
  CONTROLLER.with(|controller| *controller.borrow_mut() = state.controller);

  users_post_upgrade(state.user);
  registry_post_upgrade(state.registry)
}

#[update(name = "controller_init", guard = "owner_guard")]
#[candid_method(update, rename = "controller_init")]
fn controller_init(total_user_amount: u16, threshold_user_amount: u16) {
  ego_log("controller: controller_init");

  CONTROLLER.with(|controller| {
    controller.borrow_mut().total_user_amount = total_user_amount;
    controller.borrow_mut().threshold_user_amount = threshold_user_amount;
  });
}

/* ===== begin user relative method ===== */
#[update(name = "batch_user_add", guard = "owner_guard")]
#[candid_method(update, rename = "batch_user_add")]
fn batch_user_add(pusers: BTreeMap<Principal, String>) -> Result<(), SystemErr> {
  ego_log("controller: batch_user_add");

  CONTROLLER.with(|controller| {
    let user_count = users().unwrap().len();
    if controller.borrow().total_user_amount >= (user_count as u16 + pusers.len() as u16) {
      let provider_id = canister_get_one("provider").unwrap();

      pusers.iter().for_each(|(user_id, name)| {
        user_add_with_name(name.clone(), user_id.clone());
        let _result = api::call::notify(provider_id, "controller_user_add", (user_id, ));
      });

      Ok(())
    } else {
      Err(SystemErr::from(TooManyUser))
    }
  })
}

#[update(name = "role_user_remove", guard = "owner_guard")]
#[candid_method(update, rename = "role_user_remove")]
pub fn role_user_remove(user_id: Principal) -> Result<(), SystemErr> {
  if is_owner(user_id) {
    Err(SystemErr::new(404, "Owner can not be removed"))
  } else {
    user_remove(user_id);

    let provider_id = canister_get_one("provider").unwrap();
    let _result = api::call::notify(provider_id, "controller_user_remove", (user_id, ));

    Ok(())
  }
}

#[query(name = "role_user_list", guard = "user_guard")]
#[candid_method(query, rename = "role_user_list")]
fn role_user_list() -> Result<BTreeMap<Principal, String>, SystemErr> {
  ego_log("controller: role_user_list");

  Ok(users().unwrap())
}
/* ===== end user relative method ===== */

#[update(name = "app_main_create", guard = "owner_guard")]
#[candid_method(update, rename = "app_main_create")]
async fn app_main_create() -> Result<(), SystemErr> {
  ego_log("controller: app_main_create");

  let user_id = caller();

  let canister_id = canister_get_one("ego_store").unwrap();

  let ego_store = EgoStore::new(canister_id);

  let ego_canister = EgoCanister::new();

  match Service::app_main_create(
    ego_store,
    ego_canister,
    user_id,
    "ms_btc_wallet".to_string(),
  )
    .await
  {
    Ok(_) => Ok(()),
    Err(e) => Err(e),
  }
}

#[query(name = "app_main_get", guard = "user_guard")]
#[candid_method(query, rename = "app_main_get")]
async fn app_main_get() -> Result<Option<Principal>, SystemErr> {
  ego_log("controller: app_main_get");

  CONTROLLER.with(|controller| Ok(controller.borrow().app.clone()))
}

#[update(name = "app_action_create", guard = "user_guard")]
#[candid_method(update, rename = "app_action_create")]
fn app_action_create(req: AppActionCreateRequest) -> Result<Action, SystemErr> {
  ego_log("controller: app_action_create");

  let action = Service::app_action_create(
    req.path,
    req.to_address,
    req.amount_in_satoshi,
    req.extended,
    time(),
  );
  Ok(action)
}

#[query(name = "app_action_get", guard = "user_guard")]
#[candid_method(query, rename = "app_action_get")]
fn app_action_get(action_id: u64) -> Result<Action, SystemErr> {
  ego_log("controller: app_action_get");

  Service::app_action_get(action_id)
}

#[query(name = "app_action_list", guard = "user_guard")]
#[candid_method(query, rename = "app_action_list")]
fn app_action_list() -> Result<Vec<Action>, SystemErr> {
  ego_log("controller: app_action_list");

  let actions = Service::app_action_list();
  Ok(actions)
}

#[update(name = "action_sign_create", guard = "user_guard")]
#[candid_method(update, rename = "action_sign_create")]
fn action_sign_create(action_id: u64) -> Result<Sign, SystemErr> {
  ego_log("controller: action_sign_create");

  let app = CONTROLLER.with(|controller| controller.borrow().app);

  match app {
    None => Err(SystemErr::from(Errors::AppNotInstalled)),
    Some(canister_id) => {
      let app_wallet = AppWallet::new(canister_id);
      let user_id = caller();
      Service::action_sign_create(app_wallet, action_id, &user_id, time())
    }
  }
}
