import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface AdminAppCreateRequest {
  'deploy_mode' : DeployMode,
  'logo' : string,
  'name' : string,
  'frontend' : [] | [Principal],
  'description' : string,
  'version' : Version,
  'app_id' : string,
  'category' : Category,
  'backend_data' : Array<number>,
  'backend_hash' : string,
}
export interface AdminWalletCycleRechargeRequest {
  'cycle' : bigint,
  'comment' : string,
  'wallet_id' : Principal,
}
export interface AdminWalletProviderAddRequest {
  'wallet_provider' : Principal,
  'wallet_app_id' : string,
}
export type Category = { 'System' : null } |
  { 'Vault' : null };
export type DeployMode = { 'DEDICATED' : null } |
  { 'SHARED' : null };
export interface EgoError { 'msg' : string, 'code' : number }
export interface InitArg { 'init_caller' : [] | [Principal] }
export type Result = { 'Ok' : null } |
  { 'Err' : EgoError };
export type Result_1 = { 'Ok' : null } |
  { 'Err' : string };
export type Result_2 = { 'Ok' : Array<[string, Array<Principal>]> } |
  { 'Err' : string };
export interface Version {
  'major' : number,
  'minor' : number,
  'patch' : number,
}
export interface _SERVICE {
  'admin_app_create' : ActorMethod<[AdminAppCreateRequest], Result>,
  'admin_wallet_cycle_recharge' : ActorMethod<
    [AdminWalletCycleRechargeRequest],
    Result,
  >,
  'admin_wallet_order_new' : ActorMethod<[number], Result>,
  'admin_wallet_provider_add' : ActorMethod<
    [AdminWalletProviderAddRequest],
    Result,
  >,
  'balance_get' : ActorMethod<[], bigint>,
  'canister_add' : ActorMethod<[string, Principal], Result_1>,
  'canister_list' : ActorMethod<[], Result_2>,
  'canister_main_track' : ActorMethod<[], undefined>,
  'canister_relation_update' : ActorMethod<[string], undefined>,
  'canister_remove' : ActorMethod<[string, Principal], Result_1>,
  'ego_owner_add' : ActorMethod<[Principal], Result_1>,
  'ego_user_add' : ActorMethod<[Principal], Result_1>,
}
