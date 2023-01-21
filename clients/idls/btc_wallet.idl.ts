export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : IDL.Text });
  const GetAddressResponse = IDL.Record({ 'address' : IDL.Text });
  const EgoBtcError = IDL.Variant({
    'UnknownError' : IDL.Text,
    'AddressNotFound' : IDL.Null,
  });
  const Result_1 = IDL.Variant({
    'Ok' : GetAddressResponse,
    'Err' : EgoBtcError,
  });
  const UserBalanceResponse = IDL.Record({ 'balance' : IDL.Nat64 });
  const Result_2 = IDL.Variant({
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
  const Result_3 = IDL.Variant({ 'Ok' : SendResponse, 'Err' : EgoBtcError });
  const OutPoint = IDL.Record({
    'txid' : IDL.Vec(IDL.Nat8),
    'vout' : IDL.Nat32,
  });
  const Utxo = IDL.Record({
    'height' : IDL.Nat32,
    'value' : IDL.Nat64,
    'outpoint' : OutPoint,
  });
  const Version = IDL.Record({
    'major' : IDL.Nat32,
    'minor' : IDL.Nat32,
    'patch' : IDL.Nat32,
  });
  const AppInfo = IDL.Record({
    'app_id' : IDL.Text,
    'current_version' : Version,
    'latest_version' : Version,
    'wallet_id' : IDL.Opt(IDL.Principal),
  });
  const Result_4 = IDL.Variant({ 'Ok' : AppInfo, 'Err' : IDL.Text });
  const Result_5 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const CycleRecord = IDL.Record({ 'ts' : IDL.Nat64, 'balance' : IDL.Nat });
  const Result_6 = IDL.Variant({
    'Ok' : IDL.Vec(CycleRecord),
    'Err' : IDL.Text,
  });
  const CycleInfo = IDL.Record({
    'records' : IDL.Vec(CycleRecord),
    'estimate_remaining' : IDL.Nat64,
  });
  const Result_7 = IDL.Variant({ 'Ok' : CycleInfo, 'Err' : IDL.Text });
  const Result_8 = IDL.Variant({ 'Ok' : IDL.Vec(IDL.Text), 'Err' : IDL.Text });
  return IDL.Service({
    'balance_get' : IDL.Func([], [Result], ['query']),
    'btc_address_get' : IDL.Func([IDL.Text], [Result_1], ['query']),
    'btc_address_get_all' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'btc_address_set' : IDL.Func([IDL.Text], [IDL.Text], []),
    'btc_balance_get' : IDL.Func([IDL.Text], [IDL.Nat64], []),
    'btc_balance_path_get' : IDL.Func([IDL.Text], [Result_2], []),
    'btc_fee_get' : IDL.Func([], [IDL.Vec(IDL.Nat64)], []),
    'btc_get_txid' : IDL.Func([IDL.Nat64], [IDL.Opt(IDL.Text)], ['query']),
    'btc_is_owner' : IDL.Func([], [IDL.Bool], ['query']),
    'btc_is_user' : IDL.Func([], [IDL.Bool], ['query']),
    'btc_key_get' : IDL.Func([], [IDL.Text], ['query']),
    'btc_network_get' : IDL.Func([], [Network], ['query']),
    'btc_network_set' : IDL.Func([Network], [Network], []),
    'btc_tx_send' : IDL.Func([SendRequest], [Result_3], []),
    'btc_utxos_get' : IDL.Func([IDL.Text], [IDL.Vec(Utxo)], []),
    'ego_app_info_get' : IDL.Func([], [Result_4], ['query']),
    'ego_app_info_update' : IDL.Func(
        [IDL.Opt(IDL.Principal), IDL.Text, Version],
        [Result_5],
        [],
      ),
    'ego_app_version_check' : IDL.Func([], [Result_4], []),
    'ego_canister_add' : IDL.Func([IDL.Text, IDL.Principal], [Result_5], []),
    'ego_canister_remove' : IDL.Func([], [Result_5], []),
    'ego_canister_upgrade' : IDL.Func([], [Result_5], []),
    'ego_controller_add' : IDL.Func([IDL.Principal], [Result_5], []),
    'ego_controller_remove' : IDL.Func([IDL.Principal], [Result_5], []),
    'ego_controller_set' : IDL.Func([IDL.Vec(IDL.Principal)], [Result_5], []),
    'ego_cycle_check' : IDL.Func([], [Result_5], []),
    'ego_cycle_estimate_set' : IDL.Func([IDL.Nat64], [Result_5], []),
    'ego_cycle_history' : IDL.Func([], [Result_6], ['query']),
    'ego_cycle_info' : IDL.Func([], [Result_7], []),
    'ego_cycle_recharge' : IDL.Func([IDL.Nat], [Result_5], []),
    'ego_cycle_threshold_get' : IDL.Func([], [Result], []),
    'ego_log_list' : IDL.Func([IDL.Nat64], [Result_8], ['query']),
    'ego_op_add' : IDL.Func([IDL.Principal], [Result_5], []),
    'ego_owner_add' : IDL.Func([IDL.Principal], [Result_5], []),
    'ego_owner_remove' : IDL.Func([IDL.Principal], [Result_5], []),
    'ego_owner_set' : IDL.Func([IDL.Vec(IDL.Principal)], [Result_5], []),
    'ego_user_add' : IDL.Func([IDL.Principal], [Result_5], []),
    'ego_user_remove' : IDL.Func([IDL.Principal], [Result_5], []),
    'ego_user_set' : IDL.Func([IDL.Vec(IDL.Principal)], [Result_5], []),
  });
};
export const init = ({ IDL }) => { return []; };
