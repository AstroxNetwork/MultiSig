import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Action {
  'id' : bigint,
  'status' : ActionStatus,
  'create_at' : bigint,
  'signs' : Array<Sign>,
  'due_at' : bigint,
  'params' : Array<[string, string]>,
}
export type ActionStatus = { 'INIT' : null } |
  { 'TIMEOUT' : null } |
  { 'APPROVED' : null };
export interface AppActionCreateRequest { 'params' : Array<[string, string]> }
export type Result = { 'Ok' : Action } |
  { 'Err' : SystemErr };
export type Result_1 = { 'Ok' : Array<Action> } |
  { 'Err' : SystemErr };
export type Result_2 = { 'Ok' : null } |
  { 'Err' : string };
export type Result_3 = { 'Ok' : Array<[string, Array<Principal>]> } |
  { 'Err' : string };
export type Result_4 = { 'Ok' : null } |
  { 'Err' : SystemErr };
export interface Sign { 'sign_at' : bigint, 'user_id' : Principal }
export interface SystemErr { 'msg' : string, 'code' : number }
export interface _SERVICE {
  'app_action_create' : ActorMethod<[AppActionCreateRequest], Result>,
  'app_action_list' : ActorMethod<[], Result_1>,
  'canister_add' : ActorMethod<[string, Principal], Result_2>,
  'canister_list' : ActorMethod<[], Result_3>,
  'canister_remove' : ActorMethod<[string, Principal], Result_2>,
  'install_app' : ActorMethod<[], Result_4>,
  'role_owner_add' : ActorMethod<[Principal], Result_2>,
  'role_owner_remove' : ActorMethod<[Principal], Result_2>,
  'role_owner_set' : ActorMethod<[Array<Principal>], Result_2>,
  'role_user_add' : ActorMethod<[Principal], Result_2>,
  'role_user_remove' : ActorMethod<[Principal], Result_2>,
  'role_user_set' : ActorMethod<[Array<Principal>], Result_2>,
}
