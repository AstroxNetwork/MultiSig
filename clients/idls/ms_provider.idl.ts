export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const Result_1 = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(IDL.Principal))),
    'Err' : IDL.Text,
  });
  const ControllerMainCreateRequest = IDL.Record({
    'total_user_amount' : IDL.Nat16,
    'name' : IDL.Text,
    'threshold_user_amount' : IDL.Nat16,
  });
  const Controller = IDL.Record({
    'id' : IDL.Principal,
    'total_user_amount' : IDL.Nat16,
    'name' : IDL.Text,
    'users' : IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat16)),
    'threshold_user_amount' : IDL.Nat16,
  });
  const SystemErr = IDL.Record({ 'msg' : IDL.Text, 'code' : IDL.Nat16 });
  const Result_2 = IDL.Variant({ 'Ok' : Controller, 'Err' : SystemErr });
  const Result_3 = IDL.Variant({
    'Ok' : IDL.Vec(Controller),
    'Err' : SystemErr,
  });
  return IDL.Service({
    'canister_add' : IDL.Func([IDL.Text, IDL.Principal], [Result], []),
    'canister_list' : IDL.Func([], [Result_1], []),
    'canister_remove' : IDL.Func([IDL.Text, IDL.Principal], [Result], []),
    'controller_main_create' : IDL.Func(
        [ControllerMainCreateRequest],
        [Result_2],
        [],
      ),
    'controller_main_get' : IDL.Func([IDL.Principal], [Result_2], ['query']),
    'controller_main_list' : IDL.Func([], [Result_3], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
