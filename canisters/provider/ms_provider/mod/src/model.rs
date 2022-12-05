use std::collections::{BTreeMap};

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
  pub users: BTreeMap<Principal, u16>,
  pub total_user_amount: u16,
  pub threshold_user_amount: u16
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
      users,
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