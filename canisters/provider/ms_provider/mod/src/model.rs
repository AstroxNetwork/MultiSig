use std::cmp::Ordering;
use std::collections::{BTreeMap, BTreeSet};

use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk::export::Principal;
use serde::Serialize;

#[derive(CandidType, Deserialize, Serialize, Debug, Clone)]
pub struct Provider {
  pub controllers: BTreeMap<Principal, Controller>,
  pub user_controllers: BTreeMap<Principal, Vec<Principal>>,
}

#[derive(CandidType, Deserialize, Serialize, Debug, Clone)]
pub struct Controller{
  pub id: Principal,
  pub name: String,
  pub app: Option<Principal>,
  pub users: BTreeMap<Principal, u16>,
  pub actions: BTreeSet<Action>,
  pub next_action_id: u64,
  pub total_user_amount: u16,
  pub threshold_user_amount: u16
}

#[derive(CandidType, Deserialize, Serialize, Debug, Clone)]
pub struct Action{
  pub id: u64,
  pub params: BTreeMap<String, String>,
  pub signs: Vec<Sign>,
  pub status: ActionStatus,
  pub create_at: u128,
  pub due_at: u128
}

impl Eq for Action {}

impl PartialEq<Self> for Action {
  fn eq(&self, other: &Self) -> bool {
    self.id == other.id
  }
}

impl PartialOrd<Self> for Action {
  fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
    Some(self.id.cmp(&other.id))
  }
}

impl Ord for Action {
  fn cmp(&self, other: &Self) -> Ordering {
    self.id.cmp(&other.id)
  }
}

#[derive(CandidType, Deserialize, Serialize, Debug, Clone)]
pub enum ActionStatus{
  INIT,
  TIMEOUT,
  APPROVED
}

#[derive(CandidType, Deserialize, Serialize, Debug, Clone)]
pub struct Sign{
  pub user_id: Principal,
  pub sign_at: u128
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
        controller_ids.iter().map(|controller_id| self.controllers.get(controller_id).unwrap().clone()).collect()
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
            self.controllers.get(controller_id).cloned()
          }
          false => {
            None
          }
        }
      }
    }
  }

  pub fn controller_main_create(&mut self, id: &Principal, user_id: &Principal, name: String, total_user_amount: u16, threshold_user_amount: u16) -> Controller{
    let mut users = BTreeMap::default();
    users.insert(user_id.clone(), 1);

    let controller = Controller{
      id: id.clone(),
      name,
      app: None,
      users,
      actions: Default::default(),
      next_action_id: 0,
      total_user_amount,
      threshold_user_amount
    };

    self.controllers.entry(id.clone()).or_insert(controller.clone());

    if self.user_controllers.contains_key(user_id) {
      self.user_controllers.get_mut(user_id).unwrap().push(id.clone());
    } else {
      self.user_controllers.insert(user_id.clone(), vec![id.clone()]);
    }

    controller
  }
}