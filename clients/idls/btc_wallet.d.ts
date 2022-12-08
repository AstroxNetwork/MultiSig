import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Config {
  'blocks_source' : Principal,
  'fees' : Fees,
  'network' : Network,
  'stability_threshold' : bigint,
  'syncing' : Flag,
}
export interface Fees {
  'get_current_fee_percentiles' : bigint,
  'get_utxos_maximum' : bigint,
  'get_current_fee_percentiles_maximum' : bigint,
  'send_transaction_per_byte' : bigint,
  'get_balance' : bigint,
  'get_utxos_cycles_per_ten_instructions' : bigint,
  'get_utxos_base' : bigint,
  'get_balance_maximum' : bigint,
  'send_transaction_base' : bigint,
}
export type Flag = { 'disabled' : null } |
  { 'enabled' : null };
export interface GetBalanceRequest {
  'network' : NetworkInRequest,
  'address' : string,
  'min_confirmations' : [] | [number],
}
export interface GetCurrentFeePercentilesRequest {
  'network' : NetworkInRequest,
}
export interface GetUtxosRequest {
  'network' : NetworkInRequest,
  'filter' : [] | [UtxosFilterInRequest],
  'address' : string,
}
export interface GetUtxosResponse {
  'next_page' : [] | [Array<number>],
  'tip_height' : number,
  'tip_block_hash' : Array<number>,
  'utxos' : Array<Utxo>,
}
export interface HttpRequest {
  'url' : string,
  'method' : string,
  'body' : Array<number>,
  'headers' : Array<[string, string]>,
}
export interface HttpResponse {
  'body' : Array<number>,
  'headers' : Array<[string, string]>,
  'status_code' : number,
}
export type Network = { 'mainnet' : null } |
  { 'regtest' : null } |
  { 'testnet' : null };
export type NetworkInRequest = { 'Mainnet' : null } |
  { 'mainnet' : null } |
  { 'Regtest' : null } |
  { 'regtest' : null } |
  { 'Testnet' : null } |
  { 'testnet' : null };
export interface OutPoint { 'txid' : Array<number>, 'vout' : number }
export interface SendTransactionRequest {
  'transaction' : Array<number>,
  'network' : NetworkInRequest,
}
export interface SetConfigRequest {
  'fees' : [] | [Fees],
  'stability_threshold' : [] | [bigint],
  'syncing' : [] | [Flag],
}
export interface Utxo {
  'height' : number,
  'value' : bigint,
  'outpoint' : OutPoint,
}
export type UtxosFilterInRequest = { 'Page' : Array<number> } |
  { 'page' : Array<number> } |
  { 'min_confirmations' : number } |
  { 'MinConfirmations' : number };
export interface _SERVICE {
  'bitcoin_get_balance' : ActorMethod<[GetBalanceRequest], bigint>,
  'bitcoin_get_current_fee_percentiles' : ActorMethod<
    [GetCurrentFeePercentilesRequest],
    Array<bigint>,
  >,
  'bitcoin_get_utxos' : ActorMethod<[GetUtxosRequest], GetUtxosResponse>,
  'bitcoin_send_transaction' : ActorMethod<[SendTransactionRequest], undefined>,
  'get_config' : ActorMethod<[], Config>,
  'http_request' : ActorMethod<[HttpRequest], HttpResponse>,
  'set_config' : ActorMethod<[SetConfigRequest], undefined>,
  'wallet_config' : ActorMethod<[Config], undefined>,
}
