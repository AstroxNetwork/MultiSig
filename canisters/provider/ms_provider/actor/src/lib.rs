use candid::{candid_method};
use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk::{storage};
use ic_cdk_macros::*;
use serde::Serialize;
use ms_provider_mod::types::{ControllerMainCreateRequest, Errors, SystemErr};

use astrox_macros::inject_canister_registry;
use astrox_macros::inject_canister_users;
use ms_provider_mod::ego_lib::ego_store::EgoStore;
use ms_provider_mod::model::{Controller, Provider};
use ms_provider_mod::ms_controller::{MsController};
use ms_provider_mod::state::PROVIDER;
use ms_provider_mod::service::Service;

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
    pub provider: Provider,
    pub user: User,
    pub registry: Registry,
}

#[pre_upgrade]
fn pre_upgrade() {
    ic_cdk::println!("ms_provider: pre_upgrade");

    let provider = PROVIDER.with(|provider| provider.borrow().clone());
    let user = users_pre_upgrade();
    let registry = registry_pre_upgrade();

    let state = PersistState { provider, user, registry };
    storage::stable_save((state,)).unwrap();
}

#[post_upgrade]
fn post_upgrade() {
    ic_cdk::println!("ms_provider: post_upgrade");

    let (state,): (PersistState,) = storage::stable_restore().unwrap();
    PROVIDER.with(|provider| *provider.borrow_mut() = state.provider);

    users_post_upgrade(state.user);
    registry_post_upgrade(state.registry)
}

#[query(name = "controller_main_list")]
#[candid_method(query, rename = "controller_main_list")]
fn controller_main_list() -> Result<Vec<Controller>, SystemErr>{
    ic_cdk::println!("ms_provider: controller_main_list");
    let user = caller();
    let controllers = Service::controller_main_list(&user);
    Ok(controllers)
}

#[query(name = "controller_main_get")]
#[candid_method(query, rename = "controller_main_get")]
pub fn controller_main_get(controller_id: Principal) -> Result<Controller, SystemErr> {
    ic_cdk::println!("ms_provider: controller_main_get");
    let user = caller();
    match Service::controller_main_get(&user, &controller_id) {
        Some(controller) => Ok(controller),
        None => Err(SystemErr::from(Errors::NotFound)),
    }
}

#[update(name = "controller_main_create")]
#[candid_method(update, rename = "controller_main_create")]
pub async fn controller_main_create(request: ControllerMainCreateRequest) -> Result<Controller, SystemErr> {
    ic_cdk::println!("ms_provider: controller_main_create");
    let user = caller();

    let canister_id = REGISTRY.with(|registry| registry.borrow().canister_get_one("ego_store")).unwrap();
    let ego_store = EgoStore::new(canister_id);

    let ms_controller = MsController::new();


    match Service::controller_main_create(ego_store, ms_controller, &user, request.name, request.total_user_amount, request.threshold_user_amount).await {
        Ok(controller) => {
            Ok(controller)
        },
        Err(e) => Err(e),
    }
}

#[update(name = "controller_user_add")]
#[candid_method(update, rename = "controller_user_add")]
pub fn controller_user_add(user_id: Principal)  {
    ic_cdk::println!("ms_provider: controller_user_add");
    let controller_id = caller();

    Service::controller_user_add(&controller_id, &user_id);
}

#[update(name = "controller_user_remove")]
#[candid_method(update, rename = "controller_user_remove")]
pub fn controller_user_remove(user_id: Principal)  {
    ic_cdk::println!("ms_provider: controller_user_remove");
    let controller_id = caller();

    Service::controller_user_remove(&controller_id, &user_id);
}

