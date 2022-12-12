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
  const Result_3 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  return IDL.Service({
    'btc_address_get' : IDL.Func([IDL.Text], [Result], ['query']),
    'btc_address_get_all' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'btc_address_set' : IDL.Func([IDL.Text], [IDL.Text], []),
    'btc_balance_get' : IDL.Func([IDL.Text], [IDL.Nat64], []),
    'btc_balance_path_get' : IDL.Func([IDL.Text], [Result_1], []),
    'btc_fee_get' : IDL.Func([], [IDL.Vec(IDL.Nat64)], []),
    'btc_key_get' : IDL.Func([], [IDL.Text], ['query']),
    'btc_network_get' : IDL.Func([], [Network], ['query']),
    'btc_network_set' : IDL.Func([Network], [Network], []),
    'btc_tx_send' : IDL.Func([SendRequest], [Result_2], []),
    'btc_utxos_get' : IDL.Func([IDL.Text], [IDL.Vec(Utxo)], []),
    'canister_controller_add' : IDL.Func([IDL.Principal], [Result_3], []),
    'canister_controller_remove' : IDL.Func([IDL.Principal], [Result_3], []),
    'role_op_add' : IDL.Func([IDL.Principal], [Result_3], []),
    'role_owner_add' : IDL.Func([IDL.Principal], [Result_3], []),
    'role_owner_remove' : IDL.Func([IDL.Principal], [Result_3], []),
    'role_owner_set' : IDL.Func([IDL.Vec(IDL.Principal)], [Result_3], []),
  });
};
export const init = ({ IDL }) => { return []; };
