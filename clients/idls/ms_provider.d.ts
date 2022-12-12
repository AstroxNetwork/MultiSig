import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

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
export type Result_3 = { 'Ok' : null } |
  { 'Err' : string };
export interface SystemErr { 'msg' : string, 'code' : number }
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
  'ego_canister_add' : ActorMethod<[string, Principal], Result_3>,
  'ego_controller_add' : ActorMethod<[Principal], Result_3>,
  'ego_controller_remove' : ActorMethod<[Principal], Result_3>,
  'ego_controller_set' : ActorMethod<[Array<Principal>], Result_3>,
  'ego_op_add' : ActorMethod<[Principal], Result_3>,
  'ego_owner_add' : ActorMethod<[Principal], Result_3>,
  'ego_owner_remove' : ActorMethod<[Principal], Result_3>,
  'ego_owner_set' : ActorMethod<[Array<Principal>], Result_3>,
  'ego_user_add' : ActorMethod<[Principal], Result_3>,
  'ego_user_remove' : ActorMethod<[Principal], Result_3>,
  'ego_user_set' : ActorMethod<[Array<Principal>], Result_3>,
}
