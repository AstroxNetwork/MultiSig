export const idlFactory = ({ IDL }) => {
  const AppActionCreateRequest = IDL.Record({
    'params' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
  });
  const ActionStatus = IDL.Variant({
    'INIT' : IDL.Null,
    'TIMEOUT' : IDL.Null,
    'APPROVED' : IDL.Null,
  });
  const Sign = IDL.Record({ 'sign_at' : IDL.Nat64, 'user_id' : IDL.Principal });
  const Action = IDL.Record({
    'id' : IDL.Nat64,
    'status' : ActionStatus,
    'create_at' : IDL.Nat64,
    'signs' : IDL.Vec(Sign),
    'due_at' : IDL.Nat64,
    'params' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
  });
  const SystemErr = IDL.Record({ 'msg' : IDL.Text, 'code' : IDL.Nat16 });
  const Result = IDL.Variant({ 'Ok' : Action, 'Err' : SystemErr });
  const Result_1 = IDL.Variant({ 'Ok' : IDL.Vec(Action), 'Err' : SystemErr });
  const Result_2 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const Result_3 = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(IDL.Principal))),
    'Err' : IDL.Text,
  });
  const Result_4 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : SystemErr });
  return IDL.Service({
    'app_action_create' : IDL.Func([AppActionCreateRequest], [Result], []),
    'app_action_list' : IDL.Func([], [Result_1], []),
    'canister_add' : IDL.Func([IDL.Text, IDL.Principal], [Result_2], []),
    'canister_list' : IDL.Func([], [Result_3], []),
    'canister_remove' : IDL.Func([IDL.Text, IDL.Principal], [Result_2], []),
    'install_app' : IDL.Func([], [Result_4], []),
    'role_owner_add' : IDL.Func([IDL.Principal], [Result_2], []),
    'role_owner_remove' : IDL.Func([IDL.Principal], [Result_2], []),
    'role_owner_set' : IDL.Func([IDL.Vec(IDL.Principal)], [Result_2], []),
    'role_user_add' : IDL.Func([IDL.Principal], [Result_2], []),
    'role_user_remove' : IDL.Func([IDL.Principal], [Result_2], []),
    'role_user_set' : IDL.Func([IDL.Vec(IDL.Principal)], [Result_2], []),
  });
};
export const init = ({ IDL }) => { return []; };
