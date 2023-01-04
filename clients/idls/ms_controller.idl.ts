export const idlFactory = ({IDL}) => {
  const Sign = IDL.Record({'sign_at': IDL.Nat64, 'user_id': IDL.Principal});
  const SystemErr = IDL.Record({'msg': IDL.Text, 'code': IDL.Nat16});
  const Result = IDL.Variant({'Ok': Sign, 'Err': SystemErr});
  const AppActionCreateRequest = IDL.Record({
    'path': IDL.Text,
    'to_address': IDL.Text,
    'amount_in_satoshi': IDL.Nat64,
    'extended': IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
  });
  const ActionStatus = IDL.Variant({
    'INIT': IDL.Null,
    'SUCCESS': IDL.Null,
    'TIMEOUT': IDL.Null,
    'SINGING': IDL.Null,
  });
  const Action = IDL.Record({
    'id': IDL.Nat64,
    'status': ActionStatus,
    'create_at': IDL.Nat64,
    'path': IDL.Text,
    'to_address': IDL.Text,
    'signs': IDL.Vec(Sign),
    'due_at': IDL.Nat64,
    'amount_in_satoshi': IDL.Nat64,
    'extended': IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
  });
  const Result_1 = IDL.Variant({'Ok': Action, 'Err': SystemErr});
  const Result_2 = IDL.Variant({'Ok': IDL.Vec(Action), 'Err': SystemErr});
  const Version = IDL.Record({
    'major': IDL.Nat32,
    'minor': IDL.Nat32,
    'patch': IDL.Nat32,
  });
  const AppInfo = IDL.Record({
    'app_id': IDL.Text,
    'current_version': Version,
    'latest_version': Version,
    'wallet_id': IDL.Opt(IDL.Principal),
  });
  const Result_3 = IDL.Variant({'Ok': AppInfo, 'Err': IDL.Text});
  const Result_4 = IDL.Variant({'Ok': IDL.Null, 'Err': IDL.Text});
  const Result_5 = IDL.Variant({'Ok': IDL.Null, 'Err': SystemErr});
  const Result_6 = IDL.Variant({
    'Ok': IDL.Opt(IDL.Principal),
    'Err': SystemErr,
  });
  const Result_7 = IDL.Variant({'Ok': IDL.Nat, 'Err': IDL.Text});
  const Result_8 = IDL.Variant({'Ok': IDL.Vec(IDL.Text), 'Err': IDL.Text});
  const Result_9 = IDL.Variant({
    'Ok': IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Text)),
    'Err': SystemErr,
  });
  return IDL.Service({
    'action_sign_create': IDL.Func([IDL.Nat64], [Result], []),
    'app_action_create': IDL.Func([AppActionCreateRequest], [Result_1], []),
    'app_action_get': IDL.Func([IDL.Nat64], [Result_1], ['query']),
    'app_action_list': IDL.Func([], [Result_2], ['query']),
    'app_info_get': IDL.Func([], [Result_3], ['query']),
    'app_info_update': IDL.Func(
      [IDL.Principal, IDL.Text, Version],
      [Result_4],
      [],
    ),
    'app_main_create': IDL.Func([], [Result_5], []),
    'app_main_get': IDL.Func([], [Result_6], ['query']),
    'app_main_upgrade': IDL.Func([], [Result_5], []),
    'app_version_check': IDL.Func([], [Result_3], []),
    'balance_get': IDL.Func([], [Result_7], ['query']),
    'batch_user_add': IDL.Func(
      [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Text))],
      [Result_5],
      [],
    ),
    'controller_init': IDL.Func([IDL.Nat16, IDL.Nat16], [], []),
    'ego_canister_add': IDL.Func([IDL.Text, IDL.Principal], [Result_4], []),
    'ego_canister_upgrade': IDL.Func([], [Result_4], []),
    'ego_controller_add': IDL.Func([IDL.Principal], [Result_4], []),
    'ego_controller_remove': IDL.Func([IDL.Principal], [Result_4], []),
    'ego_controller_set': IDL.Func([IDL.Vec(IDL.Principal)], [Result_4], []),
    'ego_log_list': IDL.Func([IDL.Nat64], [Result_8], ['query']),
    'ego_op_add': IDL.Func([IDL.Principal], [Result_4], []),
    'ego_owner_add': IDL.Func([IDL.Principal], [Result_4], []),
    'ego_owner_remove': IDL.Func([IDL.Principal], [Result_4], []),
    'ego_owner_set': IDL.Func([IDL.Vec(IDL.Principal)], [Result_4], []),
    'ego_user_add': IDL.Func([IDL.Principal], [Result_4], []),
    'ego_user_remove': IDL.Func([IDL.Principal], [Result_4], []),
    'ego_user_set': IDL.Func([IDL.Vec(IDL.Principal)], [Result_4], []),
    'role_user_list': IDL.Func([], [Result_9], ['query']),
    'role_user_remove': IDL.Func([IDL.Principal], [Result_5], []),
  });
};
export const init = ({IDL}) => {
  return [];
};
