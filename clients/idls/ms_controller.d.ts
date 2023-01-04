import type {Principal} from '@dfinity/principal';
import type {ActorMethod} from '@dfinity/agent';

export interface Action {
  'id': bigint,
  'status': ActionStatus,
  'create_at': bigint,
  'path': string,
  'to_address': string,
  'signs': Array<Sign>,
  'due_at': bigint,
  'amount_in_satoshi': bigint,
  'extended': Array<[string, string]>,
}

export type ActionStatus = { 'INIT': null } |
  { 'SUCCESS': null } |
  { 'TIMEOUT': null } |
  { 'SINGING': null };

export interface AppActionCreateRequest {
  'path': string,
  'to_address': string,
  'amount_in_satoshi': bigint,
  'extended': Array<[string, string]>,
}

export interface AppInfo {
  'app_id': string,
  'current_version': Version,
  'latest_version': Version,
  'wallet_id': [] | [Principal],
}

export type Result = { 'Ok': Sign } |
  { 'Err': SystemErr };
export type Result_1 = { 'Ok': Action } |
  { 'Err': SystemErr };
export type Result_2 = { 'Ok': Array<Action> } |
  { 'Err': SystemErr };
export type Result_3 = { 'Ok': AppInfo } |
  { 'Err': string };
export type Result_4 = { 'Ok': null } |
  { 'Err': string };
export type Result_5 = { 'Ok': null } |
  { 'Err': SystemErr };
export type Result_6 = { 'Ok': [] | [Principal] } |
  { 'Err': SystemErr };
export type Result_7 = { 'Ok': bigint } |
  { 'Err': string };
export type Result_8 = { 'Ok': Array<string> } |
  { 'Err': string };
export type Result_9 = { 'Ok': Array<[Principal, string]> } |
  { 'Err': SystemErr };

export interface Sign {
  'sign_at': bigint,
  'user_id': Principal
}

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
  'action_sign_create': ActorMethod<[bigint], Result>,
  'app_action_create': ActorMethod<[AppActionCreateRequest], Result_1>,
  'app_action_get': ActorMethod<[bigint], Result_1>,
  'app_action_list': ActorMethod<[], Result_2>,
  'app_info_get': ActorMethod<[], Result_3>,
  'app_info_update': ActorMethod<[Principal, string, Version], Result_4>,
  'app_main_create': ActorMethod<[], Result_5>,
  'app_main_get': ActorMethod<[], Result_6>,
  'app_main_upgrade': ActorMethod<[], Result_5>,
  'app_version_check': ActorMethod<[], Result_3>,
  'balance_get': ActorMethod<[], Result_7>,
  'batch_user_add': ActorMethod<[Array<[Principal, string]>], Result_5>,
  'controller_init': ActorMethod<[number, number], undefined>,
  'ego_canister_add': ActorMethod<[string, Principal], Result_4>,
  'ego_canister_upgrade': ActorMethod<[], Result_4>,
  'ego_controller_add': ActorMethod<[Principal], Result_4>,
  'ego_controller_remove': ActorMethod<[Principal], Result_4>,
  'ego_controller_set': ActorMethod<[Array<Principal>], Result_4>,
  'ego_log_list': ActorMethod<[bigint], Result_8>,
  'ego_op_add': ActorMethod<[Principal], Result_4>,
  'ego_owner_add': ActorMethod<[Principal], Result_4>,
  'ego_owner_remove': ActorMethod<[Principal], Result_4>,
  'ego_owner_set': ActorMethod<[Array<Principal>], Result_4>,
  'ego_user_add': ActorMethod<[Principal], Result_4>,
  'ego_user_remove': ActorMethod<[Principal], Result_4>,
  'ego_user_set': ActorMethod<[Array<Principal>], Result_4>,
  'role_user_list': ActorMethod<[], Result_9>,
  'role_user_remove': ActorMethod<[Principal], Result_5>,
}
