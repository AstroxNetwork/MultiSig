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
export type Result = { 'Ok' : null } |
  { 'Err' : string };
export type Result_1 = { 'Ok' : Array<[string, Array<Principal>]> } |
  { 'Err' : string };
export type Result_2 = { 'Ok' : Controller } |
  { 'Err' : SystemErr };
export type Result_3 = { 'Ok' : Array<Controller> } |
  { 'Err' : SystemErr };
export interface SystemErr { 'msg' : string, 'code' : number }
export interface _SERVICE {
  'canister_add' : ActorMethod<[string, Principal], Result>,
  'canister_list' : ActorMethod<[], Result_1>,
  'canister_remove' : ActorMethod<[string, Principal], Result>,
  'controller_main_create' : ActorMethod<
    [ControllerMainCreateRequest],
    Result_2,
  >,
  'controller_main_get' : ActorMethod<[Principal], Result_2>,
  'controller_main_list' : ActorMethod<[], Result_3>,
}
