use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk::export::Principal;
use ic_ledger_types::Memo;
use serde::Serialize;

use crate::app::EgoStoreApp;
use ego_types::app::{App, AppId, Category};
use ego_types::ego_error::EgoError;
use crate::cash_flow::CashFlow;

use crate::order::Order;
use crate::user_app::{AppInstalled, UserApp};

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub enum SystemErr {

}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct UserApp {
    pub app_id: AppId,
    pub current_version: Version,
    pub frontend: Option<Canister>,
    pub backend: Option<Canister>,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct WalletAppListResponse {
    pub apps: Vec<AppInstalled>,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct WalletAppInstallRequest {
    pub app_id: AppId,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct WalletAppInstallResponse {
    pub user_app: AppInstalled,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct WalletAppUpgradeRequest {
    pub app_id: AppId,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct WalletAppUpgradeResponse {
    pub user_app: AppInstalled,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct WalletAppRemoveRequest {
    pub app_id: AppId,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct WalletAppRemoveResponse {}

#[derive(CandidType, Deserialize, Serialize)]
pub enum QueryParam {
    ByCategory { category: Category },
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct AppMainListRequest {
    pub query_param: QueryParam,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct AppMainListResponse {
    pub apps: Vec<App>,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct AppMainGetRequest {
    pub app_id: AppId,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct AppMainGetResponse {
    pub app: App,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct WalletOrderNotifyRequest {
    pub memo: Memo,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct WalletOrderNotifyResponse {
    pub ret: bool,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct WalletCanisterTrackRequest {
    pub app_id: AppId,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct WalletCanisterUnTrackRequest {
    pub app_id: AppId,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct WalletOrderNewRequest {
    pub amount: f32,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct WalletOrderNewResponse {
    pub memo: Memo,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct WalletCycleListResponse {
    pub cash_flows: Vec<CashFlow>,
}


#[derive(CandidType, Deserialize, Serialize)]
pub struct WalletOrderListResponse {
    pub orders: Vec<Order>,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct WalletCycleChargeRequest {
    pub wallet_id: Principal,
    pub cycle: u128,
    pub comment: String,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct WalletCycleChargeResponse {
    pub ret: bool,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct WalletTenantGetResponse {
    pub tenant_id: Principal,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct WalletMainRegisterRequest {
    pub user_id: Principal,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct WalletMainRegisterResponse {
    pub tenant_id: Principal,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct WalletMainNewRequest {
    pub user_id: Principal,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct WalletMainNewResponse {
    pub user_app: UserApp,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct AdminEgoTenantAddRequest {
    pub tenant_id: Principal,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct AdminEgoTenantAddResponse {
    pub ret: bool,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct AppMainReleaseRequest {
    pub app: EgoStoreApp,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct AppMainReleaseResponse {
    pub ret: bool,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct AdminWalletProviderAddRequest {
    pub wallet_provider: Principal,
    pub wallet_app_id: AppId,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct AdminWalletProviderAddResponse {
    pub ret: bool,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct AdminWalletCycleRechargeRequest {
    pub wallet_id: Principal,
    pub cycle: u128,
    pub comment: String,
}
