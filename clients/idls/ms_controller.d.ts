import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Action {
  'id' : bigint,
  'status' : ActionStatus,
  'create_at' : bigint,
  'path' : string,
  'to_address' : string,
  'signs' : Array<Sign>,
  'due_at' : bigint,
  'amount_in_satoshi' : bigint,
  'extended' : Array<[string, string]>,
}
export type ActionStatus = { 'INIT' : null } |
  { 'SUCCESS' : null } |
  { 'TIMEOUT' : null } |
  { 'SINGING' : null };
export interface App {
  'logo' : string,
  'name' : string,
  'description' : string,
  'app_id' : string,
  'app_hash' : string,
  'category' : Category,
  'current_version' : Version,
  'price' : number,
}
export interface AppActionCreateRequest {
  'path' : string,
  'to_address' : string,
  'amount_in_satoshi' : bigint,
  'extended' : Array<[string, string]>,
}
export interface AppInfo {
  'app_id' : string,
  'current_version' : Version,
  'latest_version' : Version,
  'wallet_id' : [] | [Principal],
}
export interface Canister {
  'canister_id' : Principal,
  'canister_type' : CanisterType,
}
export type CanisterType = { 'BACKEND' : null } |
  { 'ASSET' : null };
export type Category = { 'System' : null } |
  { 'Vault' : null };
export interface CycleInfo {
  'records' : Array<CycleRecord>,
  'estimate_remaining' : bigint,
}
export interface CycleRecord { 'ts' : bigint, 'balance' : bigint }
export type Result = { 'Ok' : Sign } |
  { 'Err' : SystemErr };
export type Result_1 = { 'Ok' : Action } |
  { 'Err' : SystemErr };
export type Result_10 = { 'Ok' : Array<string> } |
  { 'Err' : string };
export type Result_11 = { 'Ok' : Array<[Principal, string]> } |
  { 'Err' : SystemErr };
export type Result_12 = { 'Ok' : Array<UserApp> } |
  { 'Err' : SystemErr };
export type Result_2 = { 'Ok' : Array<Action> } |
  { 'Err' : SystemErr };
export type Result_3 = { 'Ok' : null } |
  { 'Err' : SystemErr };
export type Result_4 = { 'Ok' : [] | [Principal] } |
  { 'Err' : SystemErr };
export type Result_5 = { 'Ok' : bigint } |
  { 'Err' : string };
export type Result_6 = { 'Ok' : AppInfo } |
  { 'Err' : string };
export type Result_7 = { 'Ok' : null } |
  { 'Err' : string };
export type Result_8 = { 'Ok' : Array<CycleRecord> } |
  { 'Err' : string };
export type Result_9 = { 'Ok' : CycleInfo } |
  { 'Err' : string };
export interface Sign { 'sign_at' : bigint, 'user_id' : Principal }
export interface SystemErr { 'msg' : string, 'code' : number }
export interface UserApp {
  'app' : App,
  'canister' : Canister,
  'latest_version' : Version,
}
export interface Version {
  'major' : number,
  'minor' : number,
  'patch' : number,
}
export interface _SERVICE {
  'action_sign_create' : ActorMethod<[bigint], Result>,
  'app_action_create' : ActorMethod<[AppActionCreateRequest], Result_1>,
  'app_action_get' : ActorMethod<[bigint], Result_1>,
  'app_action_list' : ActorMethod<[], Result_2>,
  'app_main_create' : ActorMethod<[], Result_3>,
  'app_main_get' : ActorMethod<[], Result_4>,
  'app_main_upgrade' : ActorMethod<[], Result_3>,
  'balance_get' : ActorMethod<[], Result_5>,
  'batch_user_add' : ActorMethod<[Array<[Principal, string]>], Result_3>,
  'controller_init' : ActorMethod<[number, number], undefined>,
  'ego_app_info_get' : ActorMethod<[], Result_6>,
  'ego_app_info_update' : ActorMethod<
    [[] | [Principal], string, Version],
    Result_7,
  >,
  'ego_app_version_check' : ActorMethod<[], Result_6>,
  'ego_canister_add' : ActorMethod<[string, Principal], Result_7>,
  'ego_canister_remove' : ActorMethod<[], Result_7>,
  'ego_canister_upgrade' : ActorMethod<[], Result_7>,
  'ego_controller_add' : ActorMethod<[Principal], Result_7>,
  'ego_controller_remove' : ActorMethod<[Principal], Result_7>,
  'ego_controller_set' : ActorMethod<[Array<Principal>], Result_7>,
  'ego_cycle_check' : ActorMethod<[], Result_7>,
  'ego_cycle_estimate_set' : ActorMethod<[bigint], Result_7>,
  'ego_cycle_history' : ActorMethod<[], Result_8>,
  'ego_cycle_info' : ActorMethod<[], Result_9>,
  'ego_log_list' : ActorMethod<[bigint], Result_10>,
  'ego_op_add' : ActorMethod<[Principal], Result_7>,
  'ego_owner_add' : ActorMethod<[Principal], Result_7>,
  'ego_owner_remove' : ActorMethod<[Principal], Result_7>,
  'ego_owner_set' : ActorMethod<[Array<Principal>], Result_7>,
  'ego_user_add' : ActorMethod<[Principal], Result_7>,
  'ego_user_remove' : ActorMethod<[Principal], Result_7>,
  'ego_user_set' : ActorMethod<[Array<Principal>], Result_7>,
  'role_user_list' : ActorMethod<[], Result_11>,
  'role_user_remove' : ActorMethod<[Principal], Result_3>,
  'wallet_app_list' : ActorMethod<[], Result_12>,
}
