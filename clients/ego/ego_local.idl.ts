export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'Ok' : IDL.Vec(IDL.Text), 'Err' : IDL.Text });
  const CanisterType = IDL.Variant({
    'BACKEND' : IDL.Null,
    'ASSET' : IDL.Null,
  });
  const Canister = IDL.Record({
    'canister_id' : IDL.Principal,
    'canister_type' : CanisterType,
  });
  const Category = IDL.Variant({ 'System' : IDL.Null, 'Vault' : IDL.Null });
  const Version = IDL.Record({
    'major' : IDL.Nat32,
    'minor' : IDL.Nat32,
    'patch' : IDL.Nat32,
  });
  const UserApp = IDL.Record({
    'logo' : IDL.Text,
    'name' : IDL.Text,
    'frontend' : IDL.Opt(Canister),
    'description' : IDL.Text,
    'app_id' : IDL.Text,
    'category' : Category,
    'current_version' : Version,
    'latest_version' : Version,
    'backend' : IDL.Opt(Canister),
  });
  const EgoError = IDL.Record({ 'msg' : IDL.Text, 'code' : IDL.Nat16 });
  const Result_2 = IDL.Variant({ 'Ok' : UserApp, 'Err' : EgoError });
  const WalletApp = IDL.Record({
    'frontend' : IDL.Opt(Canister),
    'app_id' : IDL.Text,
    'current_version' : Version,
    'backend' : IDL.Opt(Canister),
  });
  const Result_3 = IDL.Variant({ 'Ok' : WalletApp, 'Err' : EgoError });
  return IDL.Service({
    'balance_get' : IDL.Func([], [IDL.Nat], ['query']),
    'ego_canister_add' : IDL.Func([IDL.Text, IDL.Principal], [Result], []),
    'ego_controller_add' : IDL.Func([IDL.Principal], [Result], []),
    'ego_controller_remove' : IDL.Func([IDL.Principal], [Result], []),
    'ego_controller_set' : IDL.Func([IDL.Vec(IDL.Principal)], [Result], []),
    'ego_log_list' : IDL.Func([IDL.Nat64], [Result_1], ['query']),
    'ego_op_add' : IDL.Func([IDL.Principal], [Result], []),
    'ego_owner_add' : IDL.Func([IDL.Principal], [Result], []),
    'ego_owner_remove' : IDL.Func([IDL.Principal], [Result], []),
    'ego_owner_set' : IDL.Func([IDL.Vec(IDL.Principal)], [Result], []),
    'ego_user_add' : IDL.Func([IDL.Principal], [Result], []),
    'ego_user_remove' : IDL.Func([IDL.Principal], [Result], []),
    'ego_user_set' : IDL.Func([IDL.Vec(IDL.Principal)], [Result], []),
    'wallet_app_install' : IDL.Func([IDL.Text], [Result_2], []),
    'wallet_main_new' : IDL.Func([IDL.Principal], [Result_3], []),
  });
};
export const init = ({ IDL }) => { return []; };
