use std::collections::{BTreeMap, BTreeSet};

use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk::export::Principal;
use ic_ledger_types::Memo;
use serde::Serialize;

use crate::app::EgoStoreApp;
use ego_types::app::{App, AppId};
use ego_types::ego_error::EgoError;
use ego_types::version::Version;
use crate::cash_flow::CashFlow;

use crate::order::{Order, OrderStatus};
use crate::tenant::Tenant;
use crate::types::{EgoStoreErr, QueryParam, SystemErr};
use crate::user_app::{AppInstalled, UserApp};
use crate::wallet::*;
use crate::wallet_provider::WalletProvider;

#[derive(CandidType, Deserialize, Serialize, Debug, Clone)]
pub struct Provider {
  pub controllers: BTreeMap<Principal, Controller>,
  pub user_controllers: BTreeMap<Principal, Vec<Principal>>,
}

pub struct Controller{
  pub id: Principal,
  pub name: String,
  pub app: Principal,
  pub users: Vec<User>,
  pub actions: BTreeSet<Action>,
  pub next_action_id: u64,
  pub total_user_amount: u16,
  pub threshold_user_amount: u16
}

pub struct Action{
  pub id: u64,
  pub params: Vec<String, String>,
  pub signs: Vec<Sign>,
  pub status: ActionStatus,
  pub create_at: u128,
  pub due_at: u128
}

pub enum ActionStatus{
  INIT,
  TIMEOUT,
  APPROVED
}

pub struct Sign{
  pub user_id: Principal,
  pub sign_at: u128
}

pub struct User{
  pub id: Principal,
  pub weight: u16
}

impl Provider {
  pub fn new() -> Self {
    Provider {
      controllers: BTreeMap::new(),
      user_controllers: BTreeMap::new()
    }
  }

  pub fn controller_main_list(&self, user_id: &Principal) -> Vec<Controller> {
    match self.user_controllers.get(user_id){
      None => {
        vec![]
      }
      Some(controller_ids) => {
        controller_ids.iter().map(|controller_id| self.controllers.get(controller_id).clone()).collect_vec()
      }
    }
  }

  pub fn controller_main_get(&self, user_id: &Principal, controller_id: &Principal) -> Option<Controller> {
    match self.user_controllers.get(user_id){
      None => {
        None
      }
      Some(controller_ids) => {
        match controller_ids.contains(controller_id) {
          true => {
            self.controllers.get(controller_id).unwrap()
          }
          false => {
            None
          }
        }
      }
    }
  }
}