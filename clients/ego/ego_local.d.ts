import type {Principal} from '@dfinity/principal';
import type {ActorMethod} from '@dfinity/agent';

export interface Canister {
  'canister_id': Principal,
  'canister_type': CanisterType,
}

export type CanisterType = { 'BACKEND': null } |
  { 'ASSET': null };
export type Category = { 'System': null } |
  { 'Vault': null };

export interface EgoError {
  'msg': string,
  'code': number
}

export type Result = { 'Ok': null } |
  { 'Err': string };
export type Result_1 = { 'Ok': Array<string> } |
  { 'Err': string };
export type Result_2 = { 'Ok': UserApp } |
  { 'Err': EgoError };
export type Result_3 = { 'Ok': WalletApp } |
  { 'Err': EgoError };

export interface UserApp {
  'logo': string,
  'name': string,
  'frontend': [] | [Canister],
  'description': string,
  'app_id': string,
  'category': Category,
  'current_version': Version,
  'latest_version': Version,
  'backend': [] | [Canister],
}

export interface Version {
  'major': number,
  'minor': number,
  'patch': number,
}

export interface WalletApp {
  'frontend': [] | [Canister],
  'app_id': string,
  'current_version': Version,
  'backend': [] | [Canister],
}

export interface _SERVICE {
  'balance_get': ActorMethod<[], bigint>,
  'ego_canister_add': ActorMethod<[string, Principal], Result>,
  'ego_controller_add': ActorMethod<[Principal], Result>,
  'ego_controller_remove': ActorMethod<[Principal], Result>,
  'ego_controller_set': ActorMethod<[Array<Principal>], Result>,
  'ego_log_list': ActorMethod<[bigint], Result_1>,
  'ego_op_add': ActorMethod<[Principal], Result>,
  'ego_owner_add': ActorMethod<[Principal], Result>,
  'ego_owner_remove': ActorMethod<[Principal], Result>,
  'ego_owner_set': ActorMethod<[Array<Principal>], Result>,
  'ego_user_add': ActorMethod<[Principal], Result>,
  'ego_user_remove': ActorMethod<[Principal], Result>,
  'ego_user_set': ActorMethod<[Array<Principal>], Result>,
  'wallet_app_install': ActorMethod<[string], Result_2>,
  'wallet_main_new': ActorMethod<[Principal], Result_3>,
}
