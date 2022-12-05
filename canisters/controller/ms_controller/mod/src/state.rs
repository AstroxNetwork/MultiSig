use std::cell::RefCell;

use crate::model::Controller;

thread_local! {
  pub static CONTROLLER: RefCell<Controller> = RefCell::new(Controller::new());
}
