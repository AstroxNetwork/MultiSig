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
export interface AppActionCreateRequest {
  'path' : string,
  'to_address' : string,
  'amount_in_satoshi' : bigint,
  'extended' : Array<[string, string]>,
}
export type Result = { 'Ok' : Sign } |
  { 'Err' : SystemErr };
export type Result_1 = { 'Ok' : Action } |
  { 'Err' : SystemErr };
export type Result_2 = { 'Ok' : Array<Action> } |
  { 'Err' : SystemErr };
export type Result_3 = { 'Ok' : null } |
  { 'Err' : SystemErr };
export type Result_4 = { 'Ok' : [] | [Principal] } |
  { 'Err' : SystemErr };
export type Result_5 = { 'Ok' : Array<[Principal, string]> } |
  { 'Err' : SystemErr };
export interface Sign { 'sign_at' : bigint, 'user_id' : Principal }
export interface SystemErr { 'msg' : string, 'code' : number }
export interface _SERVICE {
  'action_sign_create' : ActorMethod<[bigint], Result>,
  'app_action_create' : ActorMethod<[AppActionCreateRequest], Result_1>,
  'app_action_get' : ActorMethod<[bigint], Result_1>,
  'app_action_list' : ActorMethod<[], Result_2>,
  'app_main_create' : ActorMethod<[], Result_3>,
  'app_main_get' : ActorMethod<[], Result_4>,
  'batch_user_add' : ActorMethod<[Array<[Principal, string]>], Result_3>,
  'controller_init' : ActorMethod<[number, number], undefined>,
  'role_user_list' : ActorMethod<[], Result_5>,
  'role_user_remove' : ActorMethod<[Principal], Result_3>,
}
