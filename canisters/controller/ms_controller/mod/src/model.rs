use std::cmp::Ordering;
use std::collections::BTreeMap;

use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk::export::Principal;
use serde::Serialize;

use crate::app_wallet::TAppWallet;
use crate::types::{Errors, SystemErr};

#[derive(CandidType, Deserialize, Serialize, Debug, Clone)]
pub struct Controller {
  pub app: Option<Principal>,
  pub users: BTreeMap<Principal, u16>,
  pub actions: Vec<Action>,
  pub next_action_id: u64,
  pub total_user_amount: u16,
  pub threshold_user_amount: u16,
}

#[derive(CandidType, Deserialize, Serialize, Debug, Clone)]
pub struct Action {
  pub id: u64,
  pub path: String,
  pub to_address: String,
  pub amount_in_satoshi: u64,
  pub extended: BTreeMap<String, String>,
  pub signs: Vec<Sign>,
  pub status: ActionStatus,
  pub create_at: u64,
  pub due_at: u64,
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

#[derive(
CandidType, Serialize, Deserialize, Clone, Copy, Debug, Ord, PartialOrd, Eq, PartialEq,
)]
pub enum ActionStatus {
  INIT,
  SINGING,
  SUCCESS,
  TIMEOUT,
}

#[derive(CandidType, Deserialize, Serialize, Debug, Clone)]
pub struct Sign {
  pub user_id: Principal,
  pub sign_at: u64,
}

impl Controller {
  pub fn new() -> Self {
    Controller {
      app: None,
      users: Default::default(),
      actions: Default::default(),
      next_action_id: 1,
      total_user_amount: 0,
      threshold_user_amount: 0,
    }
  }

  pub fn app_action_get(&self, action_id: u64) -> Result<Action, SystemErr> {
    match self.actions.iter().find(|action| action.id == action_id) {
      None => Err(SystemErr::from(Errors::NotFound)),
      Some(action) => Ok(action.clone()),
    }
  }

  pub fn app_action_list(&self) -> Vec<Action> {
    self.actions.clone()
  }

  pub fn app_action_create(
    &mut self,
    path: String,
    to_address: String,
    amount_in_satoshi: u64,
    extended: BTreeMap<String, String>,
    create_at: u64,
  ) -> Action {
    let action_id = self.next_action_id;
    self.next_action_id += 1;

    let action = Action {
      id: action_id,
      path,
      to_address,
      amount_in_satoshi,
      extended,
      signs: vec![],
      status: ActionStatus::INIT,
      create_at,
      due_at: 0,
    };
    self.actions.insert(0, action.clone());

    action
  }

  pub fn action_sign_create<W: TAppWallet>(
    &mut self,
    app_wallet: W,
    action_id: u64,
    user_id: &Principal,
    sign_at: u64,
  ) -> Result<Sign, SystemErr> {
    match self
      .actions
      .iter_mut()
      .find(|action| action.id == action_id)
    {
      None => Err(SystemErr::from(Errors::NotFound)),
      Some(action) => {
        if ActionStatus::INIT == action.status || ActionStatus::SINGING == action.status {
          match action.signs.iter().find(|sign| sign.user_id == *user_id) {
            None => {
              let sign = Sign {
                user_id: user_id.clone(),
                sign_at,
              };
              action.signs.push(sign.clone());

              if action.signs.len() as u16 >= self.threshold_user_amount {
                action.status = ActionStatus::SUCCESS;
                app_wallet.action_main_invoke(
                  action_id,
                  action.path.clone(),
                  action.to_address.clone(),
                  action.amount_in_satoshi,
                  action.extended.clone(),
                );
              } else {
                action.status = ActionStatus::SINGING;
              }

              Ok(sign)
            }
            Some(_sign) => Err(SystemErr::from(Errors::Signed)),
          }
        } else {
          Err(SystemErr::from(Errors::WrongStatus))
        }
      }
    }
  }
}
