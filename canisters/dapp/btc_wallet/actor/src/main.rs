mod lib;

#[allow(dead_code)]
#[cfg(any(target_arch = "wasm32", test))]
fn main() {}

#[allow(dead_code)]
#[cfg(not(any(target_arch = "wasm32", test)))]
fn main() {
    use ic_cdk::export::Principal;
    use std::collections::BTreeMap;

    candid::export_service!();
    std::print!("{}", __export_service());
}