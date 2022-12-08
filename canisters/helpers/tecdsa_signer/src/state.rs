use crate::types::{ManagerPayload, TSignerManager};
use ic_cdk::caller;
use ic_cdk::export::candid::Principal;
use std::cell::RefCell;
thread_local! {
    pub static SIGNER_STATE: RefCell<TSignerManager> = RefCell::new(TSignerManager::default());
}

pub fn init(principal: Principal, name: String) {
    SIGNER_STATE.with(|s| {
        let mut s = s.borrow_mut();
        s.add_manager(ManagerPayload { principal, name })
    });
}

pub fn pre_upgrade() -> TSignerManager {
    SIGNER_STATE.with(|s| s.take().into())
}

pub fn post_upgrade(stable_state: TSignerManager) {
    SIGNER_STATE.with(|s| s.replace(stable_state));
}
