use std::collections::BTreeMap;

use async_trait::async_trait;
use ego_lib::ego_canister::TEgoCanister;
use ego_lib::ego_store::TEgoStore;
use ego_lib::{inject_mock_ego_canister, inject_mock_ego_store};
use ego_types::app::{App, AppId, Canister, CanisterType, Category, EgoError, UserApp, Version};
use ego_types::app_info::AppInfo;
use ic_cdk::export::Principal;
use mockall::mock;

use ms_controller_mod::app_wallet::TAppWallet;
use ms_controller_mod::model::{Action, ActionStatus};
use ms_controller_mod::service::Service;
use ms_controller_mod::state::CONTROLLER;

inject_mock_ego_store!();
inject_mock_ego_canister!();

mock! {
  Wallet {}

  #[async_trait]
  impl TAppWallet for Wallet {
    fn action_main_invoke(&self, request_id: u64, path: String, to_address: String, amount_in_satoshi: u64, extended: BTreeMap<String, String>);
  }
}


static APP_NAME: &str = "btc_wallet";
static BTC_WALLET_ID: &str = "222v3-hyaaa-aaaaf-a35yq-cai";

static USER1_ID: &str = "o2ivq-5dsz3-nba5d-pwbk2-hdd3i-vybeq-qfz35-rqg27-lyesf-xghzc-3ae";
static USER2_ID: &str = "3zjeh-xtbtx-mwebn-37a43-7nbck-qgquk-xtrny-42ujn-gzaxw-ncbzw-kqe";

pub fn set_up() {
  CONTROLLER.with(|controller| {
    controller.borrow_mut().actions.push(Action {
      id: 1,
      path: "path".to_string(),
      to_address: "to_address".to_string(),
      amount_in_satoshi: 1,
      signs: vec![],
      status: ActionStatus::INIT,
      create_at: 0,
      due_at: 0,
      extended: Default::default(),
    });

    controller.borrow_mut().next_action_id = 2;
    controller.borrow_mut().total_user_amount = 5;
    controller.borrow_mut().threshold_user_amount = 2;
  });
}

#[tokio::test]
async fn app_main_create() {
  let btc_wallet_principal = Principal::from_text(BTC_WALLET_ID.to_string()).unwrap();
  let user1_principal = Principal::from_text(USER1_ID.to_string()).unwrap();

  let mut ego_store = MockStore::new();
  let mut ego_canister = MockCanister::new();


  ego_store.expect_wallet_app_install().returning(|app_id| {
    assert_eq!(APP_NAME.to_string(), app_id);
    let app = App {
      app_id: "btc_wallet".to_string(),
      name: "btc_wallet".to_string(),
      category: Category::System,
      logo: "".to_string(),
      description: "".to_string(),
      current_version: Default::default(),
      price: 0f32,
    };
    let user_app = UserApp {
      app,
      canister: Canister {
        canister_id: Principal::from_text(BTC_WALLET_ID.to_string()).unwrap(),
        canister_type: CanisterType::BACKEND,
      },
      latest_version: Default::default(),
    };
    Ok(user_app)
  });


  ego_canister.expect_ego_user_add().returning(|_, _| ());
  ego_canister.expect_ego_owner_remove().returning(|_, _| ());


  Service::app_main_create(
    ego_store,
    ego_canister,
    user1_principal,
    APP_NAME.to_string(),
  )
    .await
    .expect("btc_wallet created failed");


  CONTROLLER.with(|controller| {
    assert_eq!(btc_wallet_principal, controller.borrow().app.unwrap());
  })
}

#[test]
fn app_action_list() {
  set_up();

  let actions = Service::app_action_list();

  assert_eq!(1, actions.len());
}

#[test]
fn app_action_create() {
  let create_at: u64 = 123;
  let extended = BTreeMap::default();
  let action = Service::app_action_create(
    "path".to_string(),
    "to_address".to_string(),
    1,
    extended,
    create_at,
  );

  assert_eq!(1, action.id);
  assert_eq!(create_at, action.create_at);
  assert_eq!(ActionStatus::INIT, action.status);
}

// actions list is ordered descent
#[test]
fn app_action_create_ordering() {
  set_up();

  let create_at: u64 = 123;
  let extended = BTreeMap::default();
  let action = Service::app_action_create(
    "path".to_string(),
    "to_address".to_string(),
    1,
    extended,
    create_at,
  );

  assert_eq!(2, action.id);

  let actions = Service::app_action_list();

  assert_eq!(2, actions.len());
  assert_eq!(2, actions.get(0).unwrap().id);
  assert_eq!(1, actions.get(1).unwrap().id);
}

#[test]
fn action_sign_create() {
  set_up();

  let wallet = MockWallet::new();

  let mut action = Service::app_action_get(1).unwrap();
  assert_eq!(0, action.signs.len());
  assert_eq!(ActionStatus::INIT, action.status);

  let user1_signat = 1;
  let user1_principal = Principal::from_text(USER1_ID.to_string()).unwrap();

  let sign1 = Service::action_sign_create(wallet, 1, &user1_principal, user1_signat).unwrap();
  assert_eq!(user1_signat, sign1.sign_at);
  action = Service::app_action_get(1).unwrap();
  assert_eq!(1, action.signs.len());
  assert_eq!(ActionStatus::SINGING, action.status);
}

#[test]
fn action_sign_create_multi_time() {
  set_up();

  let mut action = Service::app_action_get(1).unwrap();
  assert_eq!(0, action.signs.len());

  let user1_principal = Principal::from_text(USER1_ID.to_string()).unwrap();

  let wallet1 = MockWallet::new();
  Service::action_sign_create(wallet1, 1, &user1_principal, 1).unwrap();
  action = Service::app_action_get(1).unwrap();
  assert_eq!(1, action.signs.len());

  let wallet2 = MockWallet::new();
  let result = Service::action_sign_create(wallet2, 1, &user1_principal, 2);
  assert!(result.is_err());

  assert_eq!(404, result.unwrap_err().code);
}

#[test]
fn action_sign_create_success() {
  set_up();

  let mut action = Service::app_action_get(1).unwrap();
  assert_eq!(0, action.signs.len());

  let user1_signat = 1;
  let user1_principal = Principal::from_text(USER1_ID.to_string()).unwrap();

  let user2_signat = 2;
  let user2_principal = Principal::from_text(USER2_ID.to_string()).unwrap();

  let wallet1 = MockWallet::new();
  let sign1 = Service::action_sign_create(wallet1, 1, &user1_principal, user1_signat).unwrap();
  assert_eq!(user1_signat, sign1.sign_at);
  action = Service::app_action_get(1).unwrap();
  assert_eq!(1, action.signs.len());
  assert_eq!(ActionStatus::SINGING, action.status);


  let mut wallet2 = MockWallet::new();
  wallet2.expect_action_main_invoke().returning(
    |request_id, path, to_address, amount_in_satoshi, _extended| {
      assert_eq!("path".to_string(), path);
      assert_eq!("to_address".to_string(), to_address);
      assert_eq!(1, amount_in_satoshi);
      ()
    },
  );


  let sign2 = Service::action_sign_create(wallet2, 1, &user2_principal, user2_signat).unwrap();
  assert_eq!(user2_signat, sign2.sign_at);
  action = Service::app_action_get(1).unwrap();
  assert_eq!(2, action.signs.len());
  assert_eq!(ActionStatus::SUCCESS, action.status);
}
