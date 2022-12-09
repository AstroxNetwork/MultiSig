import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

<<<<<<< HEAD
export type EgoBtcError = { UnknownError: string } | { AddressNotFound: null };
export interface GetAddressResponse {
  address: string;
}
export type Network = { Mainnet: null } | { Regtest: null } | { Testnet: null };
export interface OutPoint {
  txid: Array<number>;
  vout: number;
}
export type Result = { Ok: GetAddressResponse } | { Err: EgoBtcError };
export type Result_1 = { Ok: UserBalanceResponse } | { Err: EgoBtcError };
export type Result_2 = { Ok: SendResponse } | { Err: EgoBtcError };
export type Result_3 = { Ok: null } | { Err: string };
export interface SendRequest {
  path: string;
  to_address: string;
  amount_in_satoshi: bigint;
}
export interface SendResponse {
  tx_id: string;
  from_address: string;
  amount_in_satoshi: bigint;
}
export interface UserBalanceResponse {
  balance: bigint;
=======
export type EgoBtcError = { 'UnknownError' : string } |
  { 'AddressNotFound' : null };
export interface GetAddressResponse { 'address' : string }
export type Network = { 'Mainnet' : null } |
  { 'Regtest' : null } |
  { 'Testnet' : null };
export interface OutPoint { 'txid' : Array<number>, 'vout' : number }
export type Result = { 'Ok' : GetAddressResponse } |
  { 'Err' : EgoBtcError };
export type Result_1 = { 'Ok' : UserBalanceResponse } |
  { 'Err' : EgoBtcError };
export type Result_2 = { 'Ok' : SendResponse } |
  { 'Err' : EgoBtcError };
export type Result_3 = { 'Ok' : null } |
  { 'Err' : string };
export interface SendRequest {
  'path' : string,
  'to_address' : string,
  'amount_in_satoshi' : bigint,
}
export interface SendResponse {
  'tx_id' : string,
  'from_address' : string,
  'amount_in_satoshi' : bigint,
>>>>>>> 1325793 (user add callback, canister management)
}
export interface UserBalanceResponse { 'balance' : bigint }
export interface Utxo {
  height: number;
  value: bigint;
  outpoint: OutPoint;
}
export interface _SERVICE {
<<<<<<< HEAD
  btc_address_get: ActorMethod<[string], Result>;
  btc_address_get_all: ActorMethod<[], Array<string>>;
  btc_address_set: ActorMethod<[string], string>;
  btc_balance_get: ActorMethod<[string], bigint>;
  btc_balance_path_get: ActorMethod<[string], Result_1>;
  btc_fee_get: ActorMethod<[], Array<bigint>>;
  btc_key_get: ActorMethod<[], string>;
  btc_network_get: ActorMethod<[], Network>;
  btc_network_set: ActorMethod<[Network], Network>;
  btc_tx_send: ActorMethod<[SendRequest], Result_2>;
  btc_utxos_get: ActorMethod<[string], Array<Utxo>>;
  role_op_add: ActorMethod<[Principal], Result_3>;
  role_owner_set: ActorMethod<[Array<Principal>], Result_3>;
  role_user_add: ActorMethod<[Principal], Result_3>;
  role_user_remove: ActorMethod<[Principal], Result_3>;
=======
  'btc_address_get' : ActorMethod<[string], Result>,
  'btc_address_get_all' : ActorMethod<[string], Array<string>>,
  'btc_address_set' : ActorMethod<[string], string>,
  'btc_balance_get' : ActorMethod<[string], bigint>,
  'btc_balance_path_get' : ActorMethod<[string], Result_1>,
  'btc_fee_get' : ActorMethod<[], Array<bigint>>,
  'btc_network_set' : ActorMethod<[Network], Network>,
  'btc_tx_send' : ActorMethod<[SendRequest], Result_2>,
  'btc_utxos_get' : ActorMethod<[string], Array<Utxo>>,
  'role_op_add' : ActorMethod<[Principal], Result_3>,
  'role_owner_set' : ActorMethod<[Array<Principal>], Result_3>,
  'role_user_add' : ActorMethod<[Principal], Result_3>,
  'role_user_remove' : ActorMethod<[Principal], Result_3>,
>>>>>>> 1325793 (user add callback, canister management)
}
