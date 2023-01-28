export const idlFactory = ({ IDL }) => {
  const Sign = IDL.Record({ 'sign_at' : IDL.Nat64, 'user_id' : IDL.Principal });
  const SystemErr = IDL.Record({ 'msg' : IDL.Text, 'code' : IDL.Nat16 });
  const Result = IDL.Variant({ 'Ok' : Sign, 'Err' : SystemErr });
  const AppActionCreateRequest = IDL.Record({
    'path' : IDL.Text,
    'to_address' : IDL.Text,
    'amount_in_satoshi' : IDL.Nat64,
    'extended' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
  });
  const ActionStatus = IDL.Variant({
    'INIT' : IDL.Null,
    'SUCCESS' : IDL.Null,
    'TIMEOUT' : IDL.Null,
    'SINGING' : IDL.Null,
  });
  const Action = IDL.Record({
    'id' : IDL.Nat64,
    'status' : ActionStatus,
    'create_at' : IDL.Nat64,
    'path' : IDL.Text,
    'to_address' : IDL.Text,
    'signs' : IDL.Vec(Sign),
    'due_at' : IDL.Nat64,
    'amount_in_satoshi' : IDL.Nat64,
    'extended' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
  });
  const Result_1 = IDL.Variant({ 'Ok' : Action, 'Err' : SystemErr });
  const Result_2 = IDL.Variant({ 'Ok' : IDL.Vec(Action), 'Err' : SystemErr });
  const Result_3 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : SystemErr });
  const Result_4 = IDL.Variant({
    'Ok' : IDL.Opt(IDL.Principal),
    'Err' : SystemErr,
  });
  const Result_5 = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : IDL.Text });
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
  const Result_6 = IDL.Variant({ 'Ok' : AppInfo, 'Err' : IDL.Text });
  const Result_7 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const CycleRecord = IDL.Record({ 'ts' : IDL.Nat64, 'balance' : IDL.Nat });
  const Result_8 = IDL.Variant({
    'Ok' : IDL.Vec(CycleRecord),
    'Err' : IDL.Text,
  });
  const CycleInfo = IDL.Record({
    'records' : IDL.Vec(CycleRecord),
    'estimate_remaining' : IDL.Nat64,
  });
  const Result_9 = IDL.Variant({ 'Ok' : CycleInfo, 'Err' : IDL.Text });
  const Result_10 = IDL.Variant({ 'Ok' : IDL.Bool, 'Err' : IDL.Text });
  const Result_11 = IDL.Variant({ 'Ok' : IDL.Vec(IDL.Text), 'Err' : IDL.Text });
  const Result_12 = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Text)),
    'Err' : SystemErr,
  });
  const Category = IDL.Variant({ 'System' : IDL.Null, 'Vault' : IDL.Null });
  const App = IDL.Record({
    'logo' : IDL.Text,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'app_id' : IDL.Text,
    'app_hash' : IDL.Text,
    'category' : Category,
    'current_version' : Version,
    'price' : IDL.Float32,
  });
  const CanisterType = IDL.Variant({
    'BACKEND' : IDL.Null,
    'ASSET' : IDL.Null,
  });
  const Canister = IDL.Record({
    'canister_id' : IDL.Principal,
    'canister_type' : CanisterType,
  });
  const UserApp = IDL.Record({
    'app' : App,
    'canister' : Canister,
    'latest_version' : Version,
  });
  const Result_13 = IDL.Variant({ 'Ok' : IDL.Vec(UserApp), 'Err' : SystemErr });
  return IDL.Service({
    'action_sign_create' : IDL.Func([IDL.Nat64], [Result], []),
    'app_action_create' : IDL.Func([AppActionCreateRequest], [Result_1], []),
    'app_action_get' : IDL.Func([IDL.Nat64], [Result_1], ['query']),
    'app_action_list' : IDL.Func([], [Result_2], ['query']),
    'app_main_create' : IDL.Func([], [Result_3], []),
    'app_main_get' : IDL.Func([], [Result_4], ['query']),
    'app_main_upgrade' : IDL.Func([], [Result_3], []),
    'balance_get' : IDL.Func([], [Result_5], ['query']),
    'batch_user_add' : IDL.Func(
        [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Text))],
        [Result_3],
        [],
      ),
    'controller_init' : IDL.Func([IDL.Nat16, IDL.Nat16], [], []),
    'ego_app_info_get' : IDL.Func([], [Result_6], ['query']),
    'ego_app_info_update' : IDL.Func(
        [IDL.Opt(IDL.Principal), IDL.Text, Version],
        [Result_7],
        [],
      ),
    'ego_app_version_check' : IDL.Func([], [Result_6], []),
    'ego_canister_add' : IDL.Func([IDL.Text, IDL.Principal], [Result_7], []),
    'ego_canister_remove' : IDL.Func([], [Result_7], []),
    'ego_canister_upgrade' : IDL.Func([], [Result_7], []),
    'ego_controller_add' : IDL.Func([IDL.Principal], [Result_7], []),
    'ego_controller_remove' : IDL.Func([IDL.Principal], [Result_7], []),
    'ego_controller_set' : IDL.Func([IDL.Vec(IDL.Principal)], [Result_7], []),
    'ego_cycle_check' : IDL.Func([], [Result_7], []),
    'ego_cycle_estimate_set' : IDL.Func([IDL.Nat64], [Result_7], []),
    'ego_cycle_history' : IDL.Func([], [Result_8], ['query']),
    'ego_cycle_info' : IDL.Func([], [Result_9], []),
    'ego_cycle_recharge' : IDL.Func([IDL.Nat], [Result_7], []),
    'ego_cycle_threshold_get' : IDL.Func([], [Result_5], []),
    'ego_is_owner' : IDL.Func([], [Result_10], ['query']),
    'ego_is_user' : IDL.Func([], [Result_10], ['query']),
    'ego_log_list' : IDL.Func([IDL.Nat64], [Result_11], ['query']),
    'ego_op_add' : IDL.Func([IDL.Principal], [Result_7], []),
    'ego_owner_add' : IDL.Func([IDL.Principal], [Result_7], []),
    'ego_owner_remove' : IDL.Func([IDL.Principal], [Result_7], []),
    'ego_owner_set' : IDL.Func([IDL.Vec(IDL.Principal)], [Result_7], []),
    'ego_runtime_cycle_threshold_get' : IDL.Func([], [Result_5], []),
    'ego_user_add' : IDL.Func([IDL.Principal], [Result_7], []),
    'ego_user_remove' : IDL.Func([IDL.Principal], [Result_7], []),
    'ego_user_set' : IDL.Func([IDL.Vec(IDL.Principal)], [Result_7], []),
    'role_user_list' : IDL.Func([], [Result_12], ['query']),
    'role_user_remove' : IDL.Func([IDL.Principal], [Result_3], []),
    'wallet_app_list' : IDL.Func([], [Result_13], []),
  });
};
export const init = ({ IDL }) => { return []; };
