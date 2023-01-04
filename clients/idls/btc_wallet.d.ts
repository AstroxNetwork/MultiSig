import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface AppInfo {
  'app_id' : string,
  'current_version' : Version,
  'latest_version' : Version,
  'wallet_id' : [] | [Principal],
}
export type EgoBtcError = { 'UnknownError' : string } |
  { 'AddressNotFound' : null };
export interface GetAddressResponse { 'address' : string }
export type Network = { 'Mainnet' : null } |
  { 'Regtest' : null } |
  { 'Testnet' : null };
export interface OutPoint { 'txid' : Array<number>, 'vout' : number }
export type Result = { 'Ok' : AppInfo } |
  { 'Err' : string };
export type Result_1 = { 'Ok' : null } |
  { 'Err' : string };
export type Result_2 = { 'Ok' : bigint } |
  { 'Err' : string };
export type Result_3 = { 'Ok' : GetAddressResponse } |
  { 'Err' : EgoBtcError };
export type Result_4 = { 'Ok' : UserBalanceResponse } |
  { 'Err' : EgoBtcError };
export type Result_5 = { 'Ok' : SendResponse } |
  { 'Err' : EgoBtcError };
export type Result_6 = { 'Ok' : Array<string> } |
  { 'Err' : string };
export interface SendRequest {
  'request_id' : bigint,
  'path' : string,
  'to_address' : string,
  'amount_in_satoshi' : bigint,
  'extended' : Array<[string, string]>,
}
export interface SendResponse {
  'tx_id' : string,
  'from_address' : string,
  'amount_in_satoshi' : bigint,
}
export interface UserBalanceResponse { 'balance' : bigint }
export interface Utxo {
  'height' : number,
  'value' : bigint,
  'outpoint' : OutPoint,
}
export interface Version {
  'major' : number,
  'minor' : number,
  'patch' : number,
}
export interface _SERVICE {
  'app_info_get' : ActorMethod<[], Result>,
  'app_info_update' : ActorMethod<[Principal, string, Version], Result_1>,
  'app_version_check' : ActorMethod<[], Result>,
  'balance_get' : ActorMethod<[], Result_2>,
  'btc_address_get' : ActorMethod<[string], Result_3>,
  'btc_address_get_all' : ActorMethod<[], Array<string>>,
  'btc_address_set' : ActorMethod<[string], string>,
  'btc_balance_get' : ActorMethod<[string], bigint>,
  'btc_balance_path_get' : ActorMethod<[string], Result_4>,
  'btc_fee_get' : ActorMethod<[], Array<bigint>>,
  'btc_get_txid' : ActorMethod<[bigint], [] | [string]>,
  'btc_is_owner' : ActorMethod<[], boolean>,
  'btc_is_user' : ActorMethod<[], boolean>,
  'btc_key_get' : ActorMethod<[], string>,
  'btc_network_get' : ActorMethod<[], Network>,
  'btc_network_set' : ActorMethod<[Network], Network>,
  'btc_tx_send' : ActorMethod<[SendRequest], Result_5>,
  'btc_utxos_get' : ActorMethod<[string], Array<Utxo>>,
  'ego_canister_add' : ActorMethod<[string, Principal], Result_1>,
  'ego_canister_upgrade' : ActorMethod<[], Result_1>,
  'ego_controller_add' : ActorMethod<[Principal], Result_1>,
  'ego_controller_remove' : ActorMethod<[Principal], Result_1>,
  'ego_controller_set' : ActorMethod<[Array<Principal>], Result_1>,
  'ego_log_list' : ActorMethod<[bigint], Result_6>,
  'ego_op_add' : ActorMethod<[Principal], Result_1>,
  'ego_owner_add' : ActorMethod<[Principal], Result_1>,
  'ego_owner_remove' : ActorMethod<[Principal], Result_1>,
  'ego_owner_set' : ActorMethod<[Array<Principal>], Result_1>,
  'ego_user_add' : ActorMethod<[Principal], Result_1>,
  'ego_user_remove' : ActorMethod<[Principal], Result_1>,
  'ego_user_set' : ActorMethod<[Array<Principal>], Result_1>,
}
