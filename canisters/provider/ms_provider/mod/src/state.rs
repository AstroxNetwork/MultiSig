use std::cell::RefCell;

use crate::model::Provider;

thread_local! {
  pub static PROVIDER: RefCell<Provider> = RefCell::new(Provider::new());
}
