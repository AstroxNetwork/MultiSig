export const idlFactory = ({ IDL }) => {
  const GetAddressResponse = IDL.Record({ 'address' : IDL.Text });
  const EgoBtcError = IDL.Variant({
    'UnknownError' : IDL.Text,
    'AddressNotFound' : IDL.Null,
  });
  const Result = IDL.Variant({
    'Ok' : GetAddressResponse,
    'Err' : EgoBtcError,
  });
  const UserBalanceResponse = IDL.Record({ 'balance' : IDL.Nat64 });
  const Result_1 = IDL.Variant({
    'Ok' : UserBalanceResponse,
    'Err' : EgoBtcError,
  });
  const Network = IDL.Variant({
    'Mainnet' : IDL.Null,
    'Regtest' : IDL.Null,
    'Testnet' : IDL.Null,
  });
  const SendRequest = IDL.Record({
    'request_id' : IDL.Nat64,
    'path' : IDL.Text,
    'to_address' : IDL.Text,
    'amount_in_satoshi' : IDL.Nat64,
    'extended' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
  });
  const SendResponse = IDL.Record({
    'tx_id' : IDL.Text,
    'from_address' : IDL.Text,
    'amount_in_satoshi' : IDL.Nat64,
  });
  const Result_2 = IDL.Variant({ 'Ok' : SendResponse, 'Err' : EgoBtcError });
  const OutPoint = IDL.Record({
    'txid' : IDL.Vec(IDL.Nat8),
    'vout' : IDL.Nat32,
  });
  const Utxo = IDL.Record({
    'height' : IDL.Nat32,
    'value' : IDL.Nat64,
    'outpoint' : OutPoint,
  });
  return IDL.Service({
    'btc_address_get' : IDL.Func([IDL.Text], [Result], ['query']),
    'btc_address_get_all' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'btc_address_set' : IDL.Func([IDL.Text], [IDL.Text], []),
    'btc_balance_get' : IDL.Func([IDL.Text], [IDL.Nat64], []),
    'btc_balance_path_get' : IDL.Func([IDL.Text], [Result_1], []),
    'btc_fee_get' : IDL.Func([], [IDL.Vec(IDL.Nat64)], []),
    'btc_get_txid' : IDL.Func([IDL.Nat64], [IDL.Opt(IDL.Text)], ['query']),
    'btc_is_owner' : IDL.Func([], [IDL.Bool], ['query']),
    'btc_is_user' : IDL.Func([], [IDL.Bool], ['query']),
    'btc_key_get' : IDL.Func([], [IDL.Text], ['query']),
    'btc_network_get' : IDL.Func([], [Network], ['query']),
    'btc_network_set' : IDL.Func([Network], [Network], []),
    'btc_tx_send' : IDL.Func([SendRequest], [Result_2], []),
    'btc_utxos_get' : IDL.Func([IDL.Text], [IDL.Vec(Utxo)], []),
  });
};
export const init = ({ IDL }) => { return []; };
