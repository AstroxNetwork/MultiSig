export const idlFactory = ({ IDL }) => {
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
  const Result = IDL.Variant({ 'Ok' : Controller, 'Err' : SystemErr });
  const Result_1 = IDL.Variant({
    'Ok' : IDL.Vec(Controller),
    'Err' : SystemErr,
  });
  return IDL.Service({
    'controller_main_create' : IDL.Func(
        [ControllerMainCreateRequest],
        [Result],
        [],
      ),
    'controller_main_get' : IDL.Func([IDL.Principal], [Result], ['query']),
    'controller_main_list' : IDL.Func([], [Result_1], ['query']),
    'controller_user_add' : IDL.Func([IDL.Principal], [], []),
    'controller_user_remove' : IDL.Func([IDL.Principal], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
