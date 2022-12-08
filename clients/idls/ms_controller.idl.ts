export const idlFactory = ({ IDL }) => {
  const Sign = IDL.Record({ 'sign_at' : IDL.Nat64, 'user_id' : IDL.Principal });
  const SystemErr = IDL.Record({ 'msg' : IDL.Text, 'code' : IDL.Nat16 });
  const Result = IDL.Variant({ 'Ok' : Sign, 'Err' : SystemErr });
  const AppActionCreateRequest = IDL.Record({
    'params' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
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
    'signs' : IDL.Vec(Sign),
    'due_at' : IDL.Nat64,
    'params' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
  });
  const Result_1 = IDL.Variant({ 'Ok' : Action, 'Err' : SystemErr });
  const Result_2 = IDL.Variant({ 'Ok' : IDL.Vec(Action), 'Err' : SystemErr });
  const Result_3 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : SystemErr });
  const Result_4 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const Result_5 = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(IDL.Principal))),
    'Err' : IDL.Text,
  });
  const Result_6 = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Text)),
    'Err' : SystemErr,
  });
  return IDL.Service({
    'action_sign_create' : IDL.Func([IDL.Nat64], [Result], []),
    'app_action_create' : IDL.Func([AppActionCreateRequest], [Result_1], []),
    'app_action_get' : IDL.Func([IDL.Nat64], [Result_1], ['query']),
    'app_action_list' : IDL.Func([], [Result_2], []),
    'app_main_create' : IDL.Func([], [Result_3], []),
<<<<<<< HEAD
    'canister_add' : IDL.Func([IDL.Text, IDL.Principal], [Result_4], []),
    'canister_list' : IDL.Func([], [Result_5], []),
    'canister_remove' : IDL.Func([IDL.Text, IDL.Principal], [Result_4], []),
    'controller_init' : IDL.Func([IDL.Nat16, IDL.Nat16], [], []),
    'role_op_add' : IDL.Func([IDL.Principal], [Result_4], []),
    'role_owner_set' : IDL.Func([IDL.Vec(IDL.Principal)], [Result_4], []),
    'role_user_add' : IDL.Func(
=======
    'batch_user_add' : IDL.Func(
>>>>>>> 25d6209 (upgrade dep)
        [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Text))],
        [Result_3],
        [],
      ),
    'canister_add' : IDL.Func([IDL.Text, IDL.Principal], [Result_4], []),
    'canister_list' : IDL.Func([], [Result_5], []),
    'canister_remove' : IDL.Func([IDL.Text, IDL.Principal], [Result_4], []),
    'controller_init' : IDL.Func([IDL.Nat16, IDL.Nat16], [], []),
    'role_op_add' : IDL.Func([IDL.Principal], [Result_4], []),
    'role_owner_set' : IDL.Func([IDL.Vec(IDL.Principal)], [Result_4], []),
    'role_user_add' : IDL.Func([IDL.Principal], [Result_4], []),
    'role_user_list' : IDL.Func([], [Result_6], ['query']),
    'role_user_remove' : IDL.Func([IDL.Principal], [Result_4], []),
  });
};
export const init = ({ IDL }) => { return []; };
