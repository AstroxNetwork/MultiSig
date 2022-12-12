export const idlFactory = ({ IDL }) => {
  const InitArg = IDL.Record({ 'init_caller' : IDL.Opt(IDL.Principal) });
  const DeployMode = IDL.Variant({
    'DEDICATED' : IDL.Null,
    'SHARED' : IDL.Null,
  });
  const Version = IDL.Record({
    'major' : IDL.Nat32,
    'minor' : IDL.Nat32,
    'patch' : IDL.Nat32,
  });
  const Category = IDL.Variant({ 'System' : IDL.Null, 'Vault' : IDL.Null });
  const AdminAppCreateRequest = IDL.Record({
    'deploy_mode' : DeployMode,
    'logo' : IDL.Text,
    'name' : IDL.Text,
    'frontend' : IDL.Opt(IDL.Principal),
    'description' : IDL.Text,
    'version' : Version,
    'app_id' : IDL.Text,
    'category' : Category,
    'backend_data' : IDL.Vec(IDL.Nat8),
    'backend_hash' : IDL.Text,
  });
  const EgoError = IDL.Record({ 'msg' : IDL.Text, 'code' : IDL.Nat16 });
  const Result = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : EgoError });
  const AdminWalletCycleRechargeRequest = IDL.Record({
    'cycle' : IDL.Nat,
    'comment' : IDL.Text,
    'wallet_id' : IDL.Principal,
  });
  const AdminWalletProviderAddRequest = IDL.Record({
    'wallet_provider' : IDL.Principal,
    'wallet_app_id' : IDL.Text,
  });
  const Result_1 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const Result_2 = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(IDL.Principal))),
    'Err' : IDL.Text,
  });
  return IDL.Service({
    'admin_app_create' : IDL.Func([AdminAppCreateRequest], [Result], []),
    'admin_wallet_cycle_recharge' : IDL.Func(
        [AdminWalletCycleRechargeRequest],
        [Result],
        [],
      ),
    'admin_wallet_order_new' : IDL.Func([IDL.Float32], [Result], []),
    'admin_wallet_provider_add' : IDL.Func(
        [AdminWalletProviderAddRequest],
        [Result],
        [],
      ),
    'balance_get' : IDL.Func([], [IDL.Nat], []),
    'canister_main_track' : IDL.Func([], [], []),
    'canister_relation_update' : IDL.Func([IDL.Text], [], []),
    'ego_canister_add' : IDL.Func([IDL.Text, IDL.Principal], [Result_1], []),
    'ego_canister_list' : IDL.Func([], [Result_2], []),
    'ego_owner_add' : IDL.Func([IDL.Principal], [Result_1], []),
    'ego_user_add' : IDL.Func([IDL.Principal], [Result_1], []),
  });
};
export const init = ({ IDL }) => {
  const InitArg = IDL.Record({ 'init_caller' : IDL.Opt(IDL.Principal) });
  return [InitArg];
};
