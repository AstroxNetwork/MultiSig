export const idlFactory = ({IDL}) => {
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
  const Result = IDL.Variant({'Ok': AppInfo, 'Err': IDL.Text});
  const Result_1 = IDL.Variant({'Ok': IDL.Null, 'Err': IDL.Text});
  const Result_2 = IDL.Variant({'Ok': IDL.Nat, 'Err': IDL.Text});
  const ControllerMainCreateRequest = IDL.Record({
    'total_user_amount': IDL.Nat16,
    'name': IDL.Text,
    'threshold_user_amount': IDL.Nat16,
  });
  const Controller = IDL.Record({
    'id': IDL.Principal,
    'total_user_amount': IDL.Nat16,
    'name': IDL.Text,
    'users': IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat16)),
    'threshold_user_amount': IDL.Nat16,
  });
  const SystemErr = IDL.Record({'msg': IDL.Text, 'code': IDL.Nat16});
  const Result_3 = IDL.Variant({'Ok': Controller, 'Err': SystemErr});
  const Result_4 = IDL.Variant({
    'Ok': IDL.Vec(Controller),
    'Err': SystemErr,
  });
  const Result_5 = IDL.Variant({'Ok': IDL.Vec(IDL.Text), 'Err': IDL.Text});
  return IDL.Service({
    'app_info_get': IDL.Func([], [Result], ['query']),
    'app_info_update': IDL.Func(
      [IDL.Principal, IDL.Text, Version],
      [Result_1],
      [],
    ),
    'app_version_check': IDL.Func([], [Result], []),
    'balance_get': IDL.Func([], [Result_2], ['query']),
    'controller_main_create': IDL.Func(
      [ControllerMainCreateRequest],
      [Result_3],
      [],
    ),
    'controller_main_get': IDL.Func([IDL.Principal], [Result_3], ['query']),
    'controller_main_list': IDL.Func([], [Result_4], ['query']),
    'controller_user_add': IDL.Func([IDL.Principal], [], []),
    'controller_user_remove': IDL.Func([IDL.Principal], [], []),
    'ego_canister_add': IDL.Func([IDL.Text, IDL.Principal], [Result_1], []),
    'ego_canister_upgrade': IDL.Func([], [Result_1], []),
    'ego_controller_add': IDL.Func([IDL.Principal], [Result_1], []),
    'ego_controller_remove': IDL.Func([IDL.Principal], [Result_1], []),
    'ego_controller_set': IDL.Func([IDL.Vec(IDL.Principal)], [Result_1], []),
    'ego_log_list': IDL.Func([IDL.Nat64], [Result_5], ['query']),
    'ego_op_add': IDL.Func([IDL.Principal], [Result_1], []),
    'ego_owner_add': IDL.Func([IDL.Principal], [Result_1], []),
    'ego_owner_remove': IDL.Func([IDL.Principal], [Result_1], []),
    'ego_owner_set': IDL.Func([IDL.Vec(IDL.Principal)], [Result_1], []),
    'ego_user_add': IDL.Func([IDL.Principal], [Result_1], []),
    'ego_user_remove': IDL.Func([IDL.Principal], [Result_1], []),
    'ego_user_set': IDL.Func([IDL.Vec(IDL.Principal)], [Result_1], []),
  });
};
export const init = ({IDL}) => {
  return [];
};
