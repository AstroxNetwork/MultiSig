export const idlFactory = ({ IDL }) => {
  const InitArg = IDL.Record({ 'init_caller' : IDL.Opt(IDL.Principal) });
  const AdminWalletCycleRechargeRequest = IDL.Record({
    'cycle' : IDL.Nat,
    'comment' : IDL.Text,
    'wallet_id' : IDL.Principal,
  });
  const EgoError = IDL.Record({ 'msg' : IDL.Text, 'code' : IDL.Nat16 });
  const Result = IDL.Variant({ 'Ok' : IDL.Bool, 'Err' : EgoError });
  const OrderStatus = IDL.Variant({ 'NEW' : IDL.Null, 'SUCCESS' : IDL.Null });
  const Order = IDL.Record({
    'to' : IDL.Vec(IDL.Nat8),
    'status' : OrderStatus,
    'from' : IDL.Vec(IDL.Nat8),
    'memo' : IDL.Nat64,
    'amount' : IDL.Float32,
    'wallet_id' : IDL.Principal,
  });
  const Result_1 = IDL.Variant({ 'Ok' : IDL.Vec(Order), 'Err' : EgoError });
  const AdminWalletProviderAddRequest = IDL.Record({
    'wallet_provider' : IDL.Principal,
    'wallet_app_id' : IDL.Text,
  });
  const AdminWalletProviderAddResponse = IDL.Record({ 'ret' : IDL.Bool });
  const Result_2 = IDL.Variant({
    'Ok' : AdminWalletProviderAddResponse,
    'Err' : EgoError,
  });
  const AppMainGetRequest = IDL.Record({ 'app_id' : IDL.Text });
  const Category = IDL.Variant({ 'System' : IDL.Null, 'Vault' : IDL.Null });
  const Version = IDL.Record({
    'major' : IDL.Nat32,
    'minor' : IDL.Nat32,
    'patch' : IDL.Nat32,
  });
  const App = IDL.Record({
    'logo' : IDL.Text,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'app_id' : IDL.Text,
    'category' : Category,
    'current_version' : Version,
    'price' : IDL.Float32,
  });
  const AppMainGetResponse = IDL.Record({ 'app' : App });
  const Result_3 = IDL.Variant({ 'Ok' : AppMainGetResponse, 'Err' : EgoError });
  const QueryParam = IDL.Variant({
    'ByCategory' : IDL.Record({ 'category' : Category }),
  });
  const AppMainListRequest = IDL.Record({ 'query_param' : QueryParam });
  const AppMainListResponse = IDL.Record({ 'apps' : IDL.Vec(App) });
  const Result_4 = IDL.Variant({
    'Ok' : AppMainListResponse,
    'Err' : EgoError,
  });
  const DeployMode = IDL.Variant({
    'DEDICATED' : IDL.Null,
    'SHARED' : IDL.Null,
  });
  const CanisterType = IDL.Variant({
    'BACKEND' : IDL.Null,
    'ASSET' : IDL.Null,
  });
  const Wasm = IDL.Record({
    'canister_id' : IDL.Principal,
    'version' : Version,
    'app_id' : IDL.Text,
    'canister_type' : CanisterType,
  });
  const EgoStoreApp = IDL.Record({
    'deploy_mode' : DeployMode,
    'logo' : IDL.Text,
    'name' : IDL.Text,
    'frontend' : IDL.Opt(Wasm),
    'description' : IDL.Text,
    'app_id' : IDL.Text,
    'category' : Category,
    'current_version' : Version,
    'price' : IDL.Float32,
    'backend' : IDL.Opt(Wasm),
  });
  const AppMainReleaseRequest = IDL.Record({ 'app' : EgoStoreApp });
  const AppMainReleaseResponse = IDL.Record({ 'ret' : IDL.Bool });
  const Result_5 = IDL.Variant({
    'Ok' : AppMainReleaseResponse,
    'Err' : EgoError,
  });
  const Result_6 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const Result_7 = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(IDL.Principal))),
    'Err' : IDL.Text,
  });
  const Canister = IDL.Record({
    'canister_id' : IDL.Principal,
    'canister_type' : CanisterType,
  });
  const AppInstalled = IDL.Record({
    'logo' : IDL.Text,
    'name' : IDL.Text,
    'frontend' : IDL.Opt(Canister),
    'description' : IDL.Text,
    'app_id' : IDL.Text,
    'category' : Category,
    'current_version' : Version,
    'backend' : IDL.Opt(Canister),
  });
  const WalletAppInstallResponse = IDL.Record({ 'user_app' : AppInstalled });
  const Result_8 = IDL.Variant({
    'Ok' : WalletAppInstallResponse,
    'Err' : EgoError,
  });
  const WalletAppListResponse = IDL.Record({ 'apps' : IDL.Vec(AppInstalled) });
  const Result_9 = IDL.Variant({
    'Ok' : WalletAppListResponse,
    'Err' : EgoError,
  });
  const Result_10 = IDL.Variant({ 'Ok' : IDL.Record({}), 'Err' : EgoError });
  const Result_11 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : EgoError });
  const WalletCycleChargeRequest = IDL.Record({
    'cycle' : IDL.Nat,
    'comment' : IDL.Text,
    'wallet_id' : IDL.Principal,
  });
  const CashFlowType = IDL.Variant({
    'CHARGE' : IDL.Null,
    'RECHARGE' : IDL.Null,
  });
  const CashFlow = IDL.Record({
    'balance' : IDL.Nat,
    'operator' : IDL.Principal,
    'created_at' : IDL.Nat64,
    'comment' : IDL.Text,
    'cycles' : IDL.Nat,
    'cash_flow_type' : CashFlowType,
  });
  const WalletCycleListResponse = IDL.Record({
    'cash_flows' : IDL.Vec(CashFlow),
  });
  const Result_12 = IDL.Variant({
    'Ok' : WalletCycleListResponse,
    'Err' : EgoError,
  });
  const WalletMainNewRequest = IDL.Record({ 'user_id' : IDL.Principal });
  const UserApp = IDL.Record({
    'frontend' : IDL.Opt(Canister),
    'app_id' : IDL.Text,
    'current_version' : Version,
    'backend' : IDL.Opt(Canister),
  });
  const WalletMainNewResponse = IDL.Record({ 'user_app' : UserApp });
  const Result_13 = IDL.Variant({
    'Ok' : WalletMainNewResponse,
    'Err' : EgoError,
  });
  const WalletMainRegisterResponse = IDL.Record({
    'tenant_id' : IDL.Principal,
  });
  const Result_14 = IDL.Variant({
    'Ok' : WalletMainRegisterResponse,
    'Err' : EgoError,
  });
  const WalletOrderListResponse = IDL.Record({ 'orders' : IDL.Vec(Order) });
  const Result_15 = IDL.Variant({
    'Ok' : WalletOrderListResponse,
    'Err' : EgoError,
  });
  const WalletOrderNewRequest = IDL.Record({ 'amount' : IDL.Float32 });
  const WalletOrderNewResponse = IDL.Record({ 'memo' : IDL.Nat64 });
  const Result_16 = IDL.Variant({
    'Ok' : WalletOrderNewResponse,
    'Err' : EgoError,
  });
  const WalletTenantGetResponse = IDL.Record({ 'tenant_id' : IDL.Principal });
  const Result_17 = IDL.Variant({
    'Ok' : WalletTenantGetResponse,
    'Err' : EgoError,
  });
  return IDL.Service({
    'admin_wallet_cycle_recharge' : IDL.Func(
        [AdminWalletCycleRechargeRequest],
        [Result],
        [],
      ),
    'admin_wallet_order_list' : IDL.Func([], [Result_1], []),
    'admin_wallet_provider_add' : IDL.Func(
        [AdminWalletProviderAddRequest],
        [Result_2],
        [],
      ),
    'app_main_get' : IDL.Func([AppMainGetRequest], [Result_3], ['query']),
    'app_main_list' : IDL.Func([AppMainListRequest], [Result_4], ['query']),
    'app_main_release' : IDL.Func([AppMainReleaseRequest], [Result_5], []),
    'balance_get' : IDL.Func([], [IDL.Nat], []),
    'canister_add' : IDL.Func([IDL.Text, IDL.Principal], [Result_6], []),
    'canister_list' : IDL.Func([], [Result_7], []),
    'canister_remove' : IDL.Func([IDL.Text, IDL.Principal], [Result_6], []),
    'ego_owner_add' : IDL.Func([IDL.Principal], [Result_6], []),
    'ego_user_add' : IDL.Func([IDL.Principal], [Result_6], []),
    'wallet_app_install' : IDL.Func([AppMainGetRequest], [Result_8], []),
    'wallet_app_list' : IDL.Func([], [Result_9], ['query']),
    'wallet_app_remove' : IDL.Func([AppMainGetRequest], [Result_10], []),
    'wallet_app_upgrade' : IDL.Func([AppMainGetRequest], [Result_8], []),
    'wallet_canister_track' : IDL.Func([AppMainGetRequest], [Result_11], []),
    'wallet_canister_untrack' : IDL.Func([AppMainGetRequest], [Result_11], []),
    'wallet_cycle_charge' : IDL.Func(
        [WalletCycleChargeRequest],
        [Result_5],
        [],
      ),
    'wallet_cycle_list' : IDL.Func([], [Result_12], []),
    'wallet_main_new' : IDL.Func([WalletMainNewRequest], [Result_13], []),
    'wallet_main_register' : IDL.Func([WalletMainNewRequest], [Result_14], []),
    'wallet_order_list' : IDL.Func([], [Result_15], []),
    'wallet_order_new' : IDL.Func([WalletOrderNewRequest], [Result_16], []),
    'wallet_order_notify' : IDL.Func([WalletOrderNewResponse], [Result_5], []),
    'wallet_tenant_get' : IDL.Func([], [Result_17], ['query']),
  });
};
export const init = ({ IDL }) => {
  const InitArg = IDL.Record({ 'init_caller' : IDL.Opt(IDL.Principal) });
  return [InitArg];
};
