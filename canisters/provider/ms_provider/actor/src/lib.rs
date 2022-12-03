use candid::{candid_method, Principal};
use candid::parser::token::Token::Service;
use ic_cdk::api::time;
use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk::{caller, storage};
use ic_cdk_macros::*;
use serde::Serialize;
use ms_provider_mod::types::UserApp;


#[init]
#[candid_method(init)]
pub fn init() {
    let caller = caller();
    ic_cdk::println!("provider: init, caller is {}", caller.clone());

    ic_cdk::println!("==> add caller as the owner");
    users_init(caller.clone());
}

#[derive(CandidType, Deserialize, Serialize)]
struct PersistState {
    pub ego_store: EgoStore,
    pub user: User,
    pub registry: Registry,
}

#[pre_upgrade]
fn pre_upgrade() {
    ic_cdk::println!("provider: pre_upgrade");

    let ego_store = EGO_STORE.with(|ego_store| ego_store.borrow().clone());
    let user = users_pre_upgrade();
    let registry = registry_pre_upgrade();

    let state = PersistState { ego_store, user, registry };
    storage::stable_save((state,)).unwrap();
}

#[post_upgrade]
fn post_upgrade() {
    ic_cdk::println!("provider: post_upgrade");

    let (state,): (PersistState,) = storage::stable_restore().unwrap();
    EGO_STORE.with(|ego_store| *ego_store.borrow_mut() = state.ego_store);

    users_post_upgrade(state.user);
    registry_post_upgrade(state.registry)
}

#[query(name = "controller_main_list")]
#[candid_method(query, rename = "controller_main_list")]
fn controller_main_list() {
    ic_cdk::println!("provider: controller_main_list");
    Service
}

#[query(name = "controller_main_get")]
#[candid_method(query, rename = "controller_main_get")]
pub fn controller_main_get(request: AppMainListRequest) -> Result<AppMainListResponse, EgoError> {
    ego_log("provider: app_main_list");
    match EgoStoreService::app_main_list(request.query_param) {
        Ok(apps) => Ok(AppMainListResponse { apps }),
        Err(e) => Err(e),
    }
}

#[update(name = "controller_main_create")]
#[candid_method(query, rename = "controller_main_create")]
pub fn controller_main_create(request: AppMainListRequest) -> Result<AppMainListResponse, EgoError> {
    ego_log("provider: app_main_list");
    match EgoStoreService::app_main_list(request.query_param) {
        Ok(apps) => Ok(AppMainListResponse { apps }),
        Err(e) => Err(e),
    }
}
