import type {Principal} from '@dfinity/principal';
import type {ActorMethod} from '@dfinity/agent';

export interface AppInfo {
  'app_id': string,
  'current_version': Version,
  'latest_version': Version,
  'wallet_id': [] | [Principal],
}

export interface Controller {
  'id': Principal,
  'total_user_amount': number,
  'name': string,
  'users': Array<[Principal, number]>,
  'threshold_user_amount': number,
}

export interface ControllerMainCreateRequest {
  'total_user_amount': number,
  'name': string,
  'threshold_user_amount': number,
}

export type Result = { 'Ok': AppInfo } |
  { 'Err': string };
export type Result_1 = { 'Ok': null } |
  { 'Err': string };
export type Result_2 = { 'Ok': bigint } |
  { 'Err': string };
export type Result_3 = { 'Ok': Controller } |
  { 'Err': SystemErr };
export type Result_4 = { 'Ok': Array<Controller> } |
  { 'Err': SystemErr };
export type Result_5 = { 'Ok': Array<string> } |
  { 'Err': string };

export interface SystemErr {
  'msg': string,
  'code': number
}

export interface Version {
  'major': number,
  'minor': number,
  'patch': number,
}

export interface _SERVICE {
  'app_info_get': ActorMethod<[], Result>,
  'app_info_update': ActorMethod<[Principal, string, Version], Result_1>,
  'app_version_check': ActorMethod<[], Result>,
  'balance_get': ActorMethod<[], Result_2>,
  'controller_main_create': ActorMethod<[ControllerMainCreateRequest],
    Result_3,
    >,
  'controller_main_get': ActorMethod<[Principal], Result_3>,
  'controller_main_list': ActorMethod<[], Result_4>,
  'controller_user_add': ActorMethod<[Principal], undefined>,
  'controller_user_remove': ActorMethod<[Principal], undefined>,
  'ego_canister_add': ActorMethod<[string, Principal], Result_1>,
  'ego_canister_upgrade': ActorMethod<[], Result_1>,
  'ego_controller_add': ActorMethod<[Principal], Result_1>,
  'ego_controller_remove': ActorMethod<[Principal], Result_1>,
  'ego_controller_set': ActorMethod<[Array<Principal>], Result_1>,
  'ego_log_list': ActorMethod<[bigint], Result_5>,
  'ego_op_add': ActorMethod<[Principal], Result_1>,
  'ego_owner_add': ActorMethod<[Principal], Result_1>,
  'ego_owner_remove': ActorMethod<[Principal], Result_1>,
  'ego_owner_set': ActorMethod<[Array<Principal>], Result_1>,
  'ego_user_add': ActorMethod<[Principal], Result_1>,
  'ego_user_remove': ActorMethod<[Principal], Result_1>,
  'ego_user_set': ActorMethod<[Array<Principal>], Result_1>,
}
