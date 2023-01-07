import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface AppInfo {
  'app_id' : string,
  'current_version' : Version,
  'latest_version' : Version,
  'wallet_id' : [] | [Principal],
}
export interface Controller {
  'id' : Principal,
  'total_user_amount' : number,
  'name' : string,
  'users' : Array<[Principal, number]>,
  'threshold_user_amount' : number,
}
export interface ControllerMainCreateRequest {
  'total_user_amount' : number,
  'name' : string,
  'threshold_user_amount' : number,
}
export type Result = { 'Ok' : bigint } |
  { 'Err' : string };
export type Result_1 = { 'Ok' : Controller } |
  { 'Err' : SystemErr };
export type Result_2 = { 'Ok' : Array<Controller> } |
  { 'Err' : SystemErr };
export type Result_3 = { 'Ok' : AppInfo } |
  { 'Err' : string };
export type Result_4 = { 'Ok' : null } |
  { 'Err' : string };
export type Result_5 = { 'Ok' : Array<string> } |
  { 'Err' : string };
export interface SystemErr { 'msg' : string, 'code' : number }
export interface Version {
  'major' : number,
  'minor' : number,
  'patch' : number,
}
export interface _SERVICE {
  'balance_get' : ActorMethod<[], Result>,
  'controller_main_create' : ActorMethod<
    [ControllerMainCreateRequest],
    Result_1,
  >,
  'controller_main_get' : ActorMethod<[Principal], Result_1>,
  'controller_main_list' : ActorMethod<[], Result_2>,
  'controller_user_add' : ActorMethod<[Principal], undefined>,
  'controller_user_remove' : ActorMethod<[Principal], undefined>,
  'ego_app_info_get' : ActorMethod<[], Result_3>,
  'ego_app_info_update' : ActorMethod<
    [[] | [Principal], string, Version],
    Result_4,
  >,
  'ego_app_version_check' : ActorMethod<[], Result_3>,
  'ego_canister_add' : ActorMethod<[string, Principal], Result_4>,
  'ego_canister_remove' : ActorMethod<[], Result_4>,
  'ego_canister_upgrade' : ActorMethod<[], Result_4>,
  'ego_controller_add' : ActorMethod<[Principal], Result_4>,
  'ego_controller_remove' : ActorMethod<[Principal], Result_4>,
  'ego_controller_set' : ActorMethod<[Array<Principal>], Result_4>,
  'ego_log_list' : ActorMethod<[bigint], Result_5>,
  'ego_op_add' : ActorMethod<[Principal], Result_4>,
  'ego_owner_add' : ActorMethod<[Principal], Result_4>,
  'ego_owner_remove' : ActorMethod<[Principal], Result_4>,
  'ego_owner_set' : ActorMethod<[Array<Principal>], Result_4>,
  'ego_user_add' : ActorMethod<[Principal], Result_4>,
  'ego_user_remove' : ActorMethod<[Principal], Result_4>,
  'ego_user_set' : ActorMethod<[Array<Principal>], Result_4>,
}
