use std::cmp::Ordering;
use std::collections::{BTreeMap};
use ic_cdk::api::time;

use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk::export::Principal;
use serde::Serialize;
use crate::types::SystemErr;


#[derive(CandidType, Deserialize, Serialize, Debug, Clone)]
pub struct Controller{
  pub app: Option<Principal>,
  pub users: BTreeMap<Principal, u16>,
  pub actions: Vec<Action>,
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
  pub create_at: u64,
  pub due_at: u64
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
  pub sign_at: u64
}

impl Controller {
  pub fn new() -> Self {
    Controller{
      app: None,
      users: Default::default(),
      actions: Default::default(),
      next_action_id: 0,
      total_user_amount: 0,
      threshold_user_amount: 0
    }
  }

  pub fn app_action_list(&self) -> Vec<Action> {
    self.actions.clone()
  }

  pub fn app_action_create(&mut self, params: BTreeMap<String, String>) -> Action{
    self.next_action_id += 1;
    let action_id = self.next_action_id;

    let action = Action{
      id: action_id,
      params,
      signs: vec![],
      status: ActionStatus::INIT,
      create_at: time(),
      due_at: 0
    };
    self.actions.insert(0, action.clone());

    action
  }

  pub fn app_sign_create(&mut self, action_id: u64, user_id: &Principal) -> Result<Sign, SystemErr>{
    match self.actions.iter_mut().find(|action| action.id == action_id){
      None => {
        Err(SystemErr{code: 404, msg: "Action Not Found".to_string()})
      }
      Some(action) => {
        match action.signs.iter().find(|sign| sign.user_id == *user_id) {
          None => {
            let sign = Sign{
              user_id: user_id.clone(),
              sign_at: time()
            };
            action.signs.push(sign.clone());
            Ok(sign)
          },
          Some(_sign) => {
            Err(SystemErr{code: 404, msg: "Already Signed".to_string()})
          }
        }
      }
    }
  }
}