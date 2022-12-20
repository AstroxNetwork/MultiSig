use std::collections::BTreeMap;

use async_trait::async_trait;
use ego_lib::ego_store::TEgoStore;
use ego_lib::ego_types::{App, AppId, Canister, CanisterType, EgoError, QueryParam, UserApp, Version, WalletApp};
use ic_cdk::export::Principal;
use mockall::mock;

use ms_provider_mod::model::Controller;
use ms_provider_mod::ms_controller::TMsController;
use ms_provider_mod::service::Service;
use ms_provider_mod::state::PROVIDER;

mock! {
  Store {}

  #[async_trait]
  impl TEgoStore for Store {
    async fn wallet_main_new(&self, user_id: Principal) -> Result<WalletApp, EgoError>;
    async fn app_main_list(&self, query_param: QueryParam) -> Result<Vec<App>, EgoError>;
    async fn wallet_app_install(&self, app_id: AppId) -> Result<UserApp, EgoError>;
    async fn wallet_app_upgrade(&self, app_id: AppId) -> Result<UserApp, EgoError>;
    async fn wallet_app_remove(&self, app_id: AppId) -> Result<(), EgoError>;
  }
}

mock! {
  Controller {}

  #[async_trait]
  impl TMsController for Controller {
    fn controller_init(&self, target_canister_id: Principal, total_user_amount: u16, threshold_user_amount: u16);
  }
}

static APP_NAME: &str = "btc_wallet";
static BTC_WALLET_ID: &str = "222v3-hyaaa-aaaaf-a35yq-cai";

static PROVIDER1_ID: &str = "2222s-4iaaa-aaaaf-ax2uq-cai";
static PROVIDER1_NAME: &str = "provider_1";

static PROVIDER2_ID: &str = "2227b-baaaa-aaaao-abd6a-cai";
static PROVIDER2_NAME: &str = "provider_2";

static USER1_ID: &str = "o2ivq-5dsz3-nba5d-pwbk2-hdd3i-vybeq-qfz35-rqg27-lyesf-xghzc-3ae";
static USER2_ID: &str = "3zjeh-xtbtx-mwebn-37a43-7nbck-qgquk-xtrny-42ujn-gzaxw-ncbzw-kqe";
static USER3_ID: &str = "cb53b-qsf7f-isr4v-tco56-pu475-66ehq-cfkko-doax3-xrnjh-pdo57-zae";

pub fn set_up() {
  let provider1_principal = Principal::from_text(PROVIDER1_ID).unwrap();
  let user1 = Principal::from_text(USER1_ID).unwrap();
  let user2 = Principal::from_text(USER2_ID).unwrap();
  let users = BTreeMap::from([(user1, 1), (user2, 1)]);

  PROVIDER.with(|provider| {
    let controller = Controller {
      id: provider1_principal,
      name: PROVIDER1_NAME.to_string(),
      users,
      total_user_amount: 5,
      threshold_user_amount: 2,
    };

    provider.borrow_mut().controllers.insert(provider1_principal, controller);

    provider.borrow_mut().user_controllers = BTreeMap::from([(user1, vec![provider1_principal]), (user2, vec![provider1_principal])]);
  });
}


#[test]
fn controller_main_list() {
  set_up();

  let user1 = Principal::from_text(USER1_ID).unwrap();
  let user2 = Principal::from_text(USER2_ID).unwrap();
  let user3 = Principal::from_text(USER3_ID).unwrap();

  let user1_controllers = Service::controller_main_list(&user1);
  assert_eq!(1, user1_controllers.len());

  let user2_controllers = Service::controller_main_list(&user2);
  assert_eq!(1, user2_controllers.len());

  let user3_controllers = Service::controller_main_list(&user3);
  assert_eq!(0, user3_controllers.len());
}

#[test]
fn controller_main_get() {
  set_up();

  let user1 = Principal::from_text(USER1_ID).unwrap();
  let provider1_principal = Principal::from_text(PROVIDER1_ID).unwrap();

  let result = Service::controller_main_get(&user1, &provider1_principal);
  assert!(result.is_some());

  let controller = result.unwrap();
  assert_eq!(PROVIDER1_NAME.to_string(), controller.name);
}

#[test]
fn controller_main_get_not_exists() {
  set_up();

  let user1 = Principal::from_text(USER1_ID).unwrap();
  let provider2_principal = Principal::from_text(PROVIDER2_ID).unwrap();

  let result = Service::controller_main_get(&user1, &provider2_principal);
  assert!(result.is_none());
}

#[tokio::test]
async fn controller_main_create() {
  let user2 = Principal::from_text(USER2_ID).unwrap();
  let provider2_principal = Principal::from_text(PROVIDER2_ID).unwrap();

  let mut store = MockStore::new();
  let mut ms_controller = MockController::new();


  store.expect_wallet_main_new().returning(move |_| {
    let user_app = WalletApp {
      app_id: APP_NAME.to_string(),
      current_version: Version {
        major: 1,
        minor: 0,
        patch: 0,
      },
      frontend: None,
      backend: Some(Canister {
        canister_id: provider2_principal,
        canister_type: CanisterType::BACKEND,
      }),
    };

    Ok(user_app)
  });

  ms_controller.expect_controller_init().returning(|_, _, _| ());

  let result = Service::controller_main_create(store, ms_controller, &user2, PROVIDER2_NAME.to_string(), 5, 2).await;
  assert!(result.is_ok());
  let controller = result.unwrap();
  assert_eq!(provider2_principal, controller.id);
  assert_eq!(PROVIDER2_NAME.to_string(), controller.name);
  assert_eq!(5, controller.total_user_amount);
  assert_eq!(2, controller.threshold_user_amount);
}

#[test]
fn controller_user_operation() {
  set_up();

  let user1 = Principal::from_text(USER1_ID).unwrap();
  let provider1_principal = Principal::from_text(PROVIDER1_ID).unwrap();

  let controllers = Service::controller_main_list(&user1);
  assert_eq!(1, controllers.len());
  assert_eq!(provider1_principal, controllers[0].id);

  PROVIDER.with(|provider| {
    assert!(provider.borrow().controllers.get(&provider1_principal).as_ref().unwrap().users.contains_key(&user1));
  });

  // remove the user
  Service::controller_user_remove(&provider1_principal, &user1);

  let controllers = Service::controller_main_list(&user1);
  assert_eq!(0, controllers.len());

  PROVIDER.with(|provider| {
    assert!(!provider.borrow().controllers.get(&provider1_principal).as_ref().unwrap().users.contains_key(&user1));
  });

  // add back the user
  Service::controller_user_add(&provider1_principal, &user1);

  let controllers = Service::controller_main_list(&user1);
  assert_eq!(1, controllers.len());
  assert_eq!(provider1_principal, controllers[0].id);

  PROVIDER.with(|provider| {
    assert!(provider.borrow().controllers.get(&provider1_principal).as_ref().unwrap().users.contains_key(&user1));
  });
}