import type {Principal} from '@dfinity/principal';
import type {ActorMethod} from '@dfinity/agent';

export interface AdminWalletCycleRechargeRequest {
  'cycle': bigint,
  'comment': string,
  'wallet_id': Principal,
}

export interface AdminWalletProviderAddRequest {
  'wallet_provider': Principal,
  'wallet_app_id': string,
}

export interface App {
  'logo': string,
  'name': string,
  'description': string,
  'app_id': string,
  'category': Category,
  'current_version': Version,
  'price': number,
}

export interface Canister {
  'canister_id': Principal,
  'canister_type': CanisterType,
}

export type CanisterType = { 'BACKEND': null } |
  { 'ASSET': null };

export interface CashFlow {
  'balance': bigint,
  'operator': Principal,
  'created_at': bigint,
  'comment': string,
  'cycles': bigint,
  'cash_flow_type': CashFlowType,
}

export type CashFlowType = { 'CHARGE': null } |
  { 'RECHARGE': null };
export type Category = { 'System': null } |
  { 'Vault': null };

export interface EgoError {
  'msg': string,
  'code': number
}

export interface EgoStoreApp {
  'app': App,
  'wasm': Wasm
}

export interface InitArg {
  'init_caller': [] | [Principal]
}

export interface Order {
  'to': Array<number>,
  'status': OrderStatus,
  'from': Array<number>,
  'memo': bigint,
  'amount': number,
  'wallet_id': Principal,
}

export type OrderStatus = { 'NEW': null } |
  { 'SUCCESS': null };
export type Result = { 'Ok': boolean } |
  { 'Err': EgoError };
export type Result_1 = { 'Ok': Array<Order> } |
  { 'Err': EgoError };
export type Result_10 = { 'Ok': WalletCycleChargeResponse } |
  { 'Err': EgoError };
export type Result_11 = { 'Ok': WalletCycleListResponse } |
  { 'Err': EgoError };
export type Result_12 = { 'Ok': Principal } |
  { 'Err': EgoError };
export type Result_13 = { 'Ok': WalletOrderListResponse } |
  { 'Err': EgoError };
export type Result_14 = { 'Ok': WalletOrderNewResponse } |
  { 'Err': EgoError };
export type Result_2 = { 'Ok': null } |
  { 'Err': EgoError };
export type Result_3 = { 'Ok': App } |
  { 'Err': EgoError };
export type Result_4 = { 'Ok': Array<App> } |
  { 'Err': EgoError };
export type Result_5 = { 'Ok': bigint } |
  { 'Err': string };
export type Result_6 = { 'Ok': null } |
  { 'Err': string };
export type Result_7 = { 'Ok': Array<string> } |
  { 'Err': string };
export type Result_8 = { 'Ok': UserApp } |
  { 'Err': EgoError };
export type Result_9 = { 'Ok': Array<UserApp> } |
  { 'Err': EgoError };

export interface UserApp {
  'app': App,
  'canister': Canister,
  'current_version': Version,
}

export interface Version {
  'major': number,
  'minor': number,
  'patch': number,
}

export interface WalletCycleChargeRequest {
  'cycle': bigint,
  'comment': string,
  'wallet_id': Principal,
}

export interface WalletCycleChargeResponse {
  'ret': boolean
}

export interface WalletCycleListResponse {
  'cash_flows': Array<CashFlow>
}

export interface WalletOrderListResponse {
  'orders': Array<Order>
}

export interface WalletOrderNewRequest {
  'amount': number
}

export interface WalletOrderNewResponse {
  'memo': bigint
}

export interface Wasm {
  'canister_id': Principal,
  'version': Version,
  'app_id': string,
  'canister_type': CanisterType,
}

export interface _SERVICE {
  'admin_wallet_cycle_recharge': ActorMethod<[AdminWalletCycleRechargeRequest],
    Result,
    >,
  'admin_wallet_order_list': ActorMethod<[], Result_1>,
  'admin_wallet_provider_add': ActorMethod<[AdminWalletProviderAddRequest],
    Result_2,
    >,
  'app_main_get': ActorMethod<[string], Result_3>,
  'app_main_list': ActorMethod<[], Result_4>,
  'app_main_release': ActorMethod<[EgoStoreApp], Result>,
  'balance_get': ActorMethod<[], Result_5>,
  'ego_canister_add': ActorMethod<[string, Principal], Result_6>,
  'ego_controller_add': ActorMethod<[Principal], Result_6>,
  'ego_controller_remove': ActorMethod<[Principal], Result_6>,
  'ego_controller_set': ActorMethod<[Array<Principal>], Result_6>,
  'ego_log_list': ActorMethod<[bigint], Result_7>,
  'ego_op_add': ActorMethod<[Principal], Result_6>,
  'ego_owner_add': ActorMethod<[Principal], Result_6>,
  'ego_owner_remove': ActorMethod<[Principal], Result_6>,
  'ego_owner_set': ActorMethod<[Array<Principal>], Result_6>,
  'ego_user_add': ActorMethod<[Principal], Result_6>,
  'ego_user_remove': ActorMethod<[Principal], Result_6>,
  'ego_user_set': ActorMethod<[Array<Principal>], Result_6>,
  'wallet_app_install': ActorMethod<[string], Result_8>,
  'wallet_app_list': ActorMethod<[], Result_9>,
  'wallet_app_remove': ActorMethod<[Principal], Result_2>,
  'wallet_app_upgrade': ActorMethod<[Principal], Result_2>,
  'wallet_canister_track': ActorMethod<[Principal], Result_2>,
  'wallet_canister_untrack': ActorMethod<[Principal], Result_2>,
  'wallet_cycle_charge': ActorMethod<[WalletCycleChargeRequest], Result_10>,
  'wallet_cycle_list': ActorMethod<[], Result_11>,
  'wallet_main_new': ActorMethod<[Principal], Result_8>,
  'wallet_main_register': ActorMethod<[Principal], Result_12>,
  'wallet_order_list': ActorMethod<[], Result_13>,
  'wallet_order_new': ActorMethod<[WalletOrderNewRequest], Result_14>,
  'wallet_order_notify': ActorMethod<[WalletOrderNewResponse], Result_10>,
  'wallet_tenant_get': ActorMethod<[], Result_12>,
}
