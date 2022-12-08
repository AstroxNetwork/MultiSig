export const idlFactory = ({ IDL }) => {
  const NetworkInRequest = IDL.Variant({
    'Mainnet' : IDL.Null,
    'mainnet' : IDL.Null,
    'Regtest' : IDL.Null,
    'regtest' : IDL.Null,
    'Testnet' : IDL.Null,
    'testnet' : IDL.Null,
  });
  const GetBalanceRequest = IDL.Record({
    'network' : NetworkInRequest,
    'address' : IDL.Text,
    'min_confirmations' : IDL.Opt(IDL.Nat32),
  });
  const GetCurrentFeePercentilesRequest = IDL.Record({
    'network' : NetworkInRequest,
  });
  const UtxosFilterInRequest = IDL.Variant({
    'Page' : IDL.Vec(IDL.Nat8),
    'page' : IDL.Vec(IDL.Nat8),
    'min_confirmations' : IDL.Nat32,
    'MinConfirmations' : IDL.Nat32,
  });
  const GetUtxosRequest = IDL.Record({
    'network' : NetworkInRequest,
    'filter' : IDL.Opt(UtxosFilterInRequest),
    'address' : IDL.Text,
  });
  const OutPoint = IDL.Record({
    'txid' : IDL.Vec(IDL.Nat8),
    'vout' : IDL.Nat32,
  });
  const Utxo = IDL.Record({
    'height' : IDL.Nat32,
    'value' : IDL.Nat64,
    'outpoint' : OutPoint,
  });
  const GetUtxosResponse = IDL.Record({
    'next_page' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'tip_height' : IDL.Nat32,
    'tip_block_hash' : IDL.Vec(IDL.Nat8),
    'utxos' : IDL.Vec(Utxo),
  });
  const SendTransactionRequest = IDL.Record({
    'transaction' : IDL.Vec(IDL.Nat8),
    'network' : NetworkInRequest,
  });
  const Fees = IDL.Record({
    'get_current_fee_percentiles' : IDL.Nat,
    'get_utxos_maximum' : IDL.Nat,
    'get_current_fee_percentiles_maximum' : IDL.Nat,
    'send_transaction_per_byte' : IDL.Nat,
    'get_balance' : IDL.Nat,
    'get_utxos_cycles_per_ten_instructions' : IDL.Nat,
    'get_utxos_base' : IDL.Nat,
    'get_balance_maximum' : IDL.Nat,
    'send_transaction_base' : IDL.Nat,
  });
  const Network = IDL.Variant({
    'mainnet' : IDL.Null,
    'regtest' : IDL.Null,
    'testnet' : IDL.Null,
  });
  const Flag = IDL.Variant({ 'disabled' : IDL.Null, 'enabled' : IDL.Null });
  const Config = IDL.Record({
    'blocks_source' : IDL.Principal,
    'fees' : Fees,
    'network' : Network,
    'stability_threshold' : IDL.Nat,
    'syncing' : Flag,
  });
  const HttpRequest = IDL.Record({
    'url' : IDL.Text,
    'method' : IDL.Text,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
  });
  const HttpResponse = IDL.Record({
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    'status_code' : IDL.Nat16,
  });
  const SetConfigRequest = IDL.Record({
    'fees' : IDL.Opt(Fees),
    'stability_threshold' : IDL.Opt(IDL.Nat),
    'syncing' : IDL.Opt(Flag),
  });
  return IDL.Service({
    'bitcoin_get_balance' : IDL.Func([GetBalanceRequest], [IDL.Nat64], []),
    'bitcoin_get_current_fee_percentiles' : IDL.Func(
        [GetCurrentFeePercentilesRequest],
        [IDL.Vec(IDL.Nat64)],
        [],
      ),
    'bitcoin_get_utxos' : IDL.Func([GetUtxosRequest], [GetUtxosResponse], []),
    'bitcoin_send_transaction' : IDL.Func([SendTransactionRequest], [], []),
    'get_config' : IDL.Func([], [Config], ['query']),
    'http_request' : IDL.Func([HttpRequest], [HttpResponse], ['query']),
    'set_config' : IDL.Func([SetConfigRequest], [], []),
    'wallet_config' : IDL.Func([Config], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
