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
    'backend_data_hash' : IDL.Text,
    'backend_data' : IDL.Vec(IDL.Nat8),
  });
  const AppVersionStatus = IDL.Variant({
    'NEW' : IDL.Null,
    'REJECTED' : IDL.Null,
    'SUBMITTED' : IDL.Null,
    'REVOKED' : IDL.Null,
    'RELEASED' : IDL.Null,
    'APPROVED' : IDL.Null,
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
  const AppVersion = IDL.Record({
    'status' : AppVersionStatus,
    'frontend' : IDL.Opt(Wasm),
    'version' : Version,
    'app_id' : IDL.Text,
    'backend' : IDL.Opt(Wasm),
    'file_id' : IDL.Principal,
  });
  const AdminAppCreateResponse = IDL.Record({ 'app_version' : AppVersion });
  const EgoError = IDL.Record({ 'msg' : IDL.Text, 'code' : IDL.Nat16 });
  const Result = IDL.Variant({
    'Ok' : AdminAppCreateResponse,
    'Err' : EgoError,
  });
  const AppVersionApproveRequest = IDL.Record({
    'version' : Version,
    'app_id' : IDL.Text,
  });
  const AppVersionNewRequest = IDL.Record({
    'version' : Version,
    'app_id' : IDL.Text,
  });
  const AppVersionNewResponse = IDL.Record({ 'app_version' : AppVersion });
  const Result_1 = IDL.Variant({
    'Ok' : AppVersionNewResponse,
    'Err' : EgoError,
  });
  const AppVersionSetFrontendAddressRequest = IDL.Record({
    'canister_id' : IDL.Principal,
    'version' : Version,
    'app_id' : IDL.Text,
  });
  const AppVersionSetFrontendAddressResponse = IDL.Record({ 'ret' : IDL.Bool });
  const Result_2 = IDL.Variant({
    'Ok' : AppVersionSetFrontendAddressResponse,
    'Err' : EgoError,
  });
  const AppVersionUploadWasmRequest = IDL.Record({
    'data' : IDL.Vec(IDL.Nat8),
    'hash' : IDL.Text,
    'version' : Version,
    'app_id' : IDL.Text,
  });
  const AppVersionUploadWasmResponse = IDL.Record({ 'ret' : IDL.Bool });
  const Result_3 = IDL.Variant({
    'Ok' : AppVersionUploadWasmResponse,
    'Err' : EgoError,
  });
  const EgoDevApp = IDL.Record({
    'deploy_mode' : DeployMode,
    'logo' : IDL.Text,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'app_id' : IDL.Text,
    'release_version' : IDL.Opt(Version),
    'category' : Category,
    'developer_id' : IDL.Principal,
    'price' : IDL.Float32,
    'versions' : IDL.Vec(AppVersion),
    'audit_version' : IDL.Opt(Version),
  });
  const AppVersionWaitForAuditResponse = IDL.Record({
    'apps' : IDL.Vec(EgoDevApp),
  });
  const Result_4 = IDL.Variant({
    'Ok' : AppVersionWaitForAuditResponse,
    'Err' : EgoError,
  });
  const AppMainGetRequest = IDL.Record({ 'app_id' : IDL.Text });
  const AppMainGetResponse = IDL.Record({ 'app' : EgoDevApp });
  const Result_5 = IDL.Variant({ 'Ok' : AppMainGetResponse, 'Err' : EgoError });
  const DeveloperAppListResponse = IDL.Record({ 'apps' : IDL.Vec(EgoDevApp) });
  const Result_6 = IDL.Variant({
    'Ok' : DeveloperAppListResponse,
    'Err' : EgoError,
  });
  const AppMainNewRequest = IDL.Record({
    'logo' : IDL.Text,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'app_id' : IDL.Text,
    'category' : Category,
    'price' : IDL.Float32,
  });
  const Developer = IDL.Record({
    'name' : IDL.Text,
    'user_id' : IDL.Principal,
    'is_app_auditor' : IDL.Bool,
    'created_apps' : IDL.Vec(IDL.Text),
    'is_manager' : IDL.Bool,
  });
  const DeveloperMainGetResponse = IDL.Record({ 'developer' : Developer });
  const Result_7 = IDL.Variant({
    'Ok' : DeveloperMainGetResponse,
    'Err' : EgoError,
  });
  const DeveloperMainRegisterRequest = IDL.Record({ 'name' : IDL.Text });
  const Result_8 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const Result_9 = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(IDL.Principal))),
    'Err' : IDL.Text,
  });
  const UserMainListRequest = IDL.Record({ 'name' : IDL.Text });
  const UserMainListResponse = IDL.Record({ 'users' : IDL.Vec(Developer) });
  const Result_10 = IDL.Variant({
    'Ok' : UserMainListResponse,
    'Err' : EgoError,
  });
  const UserRoleSetRequest = IDL.Record({
    'user_id' : IDL.Principal,
    'is_app_auditor' : IDL.Bool,
    'is_manager' : IDL.Bool,
  });
  const UserRoleSetResponse = IDL.Record({ 'ret' : IDL.Bool });
  const Result_11 = IDL.Variant({
    'Ok' : UserRoleSetResponse,
    'Err' : EgoError,
  });
  return IDL.Service({
    'admin_app_create' : IDL.Func([AdminAppCreateRequest], [Result], []),
    'app_version_approve' : IDL.Func([AppVersionApproveRequest], [Result], []),
    'app_version_new' : IDL.Func([AppVersionNewRequest], [Result_1], []),
    'app_version_reject' : IDL.Func([AppVersionNewRequest], [Result_1], []),
    'app_version_release' : IDL.Func([AppVersionNewRequest], [Result_1], []),
    'app_version_revoke' : IDL.Func([AppVersionNewRequest], [Result_1], []),
    'app_version_set_frontend_address' : IDL.Func(
        [AppVersionSetFrontendAddressRequest],
        [Result_2],
        [],
      ),
    'app_version_submit' : IDL.Func([AppVersionNewRequest], [Result_1], []),
    'app_version_upload_wasm' : IDL.Func(
        [AppVersionUploadWasmRequest],
        [Result_3],
        [],
      ),
    'app_version_wait_for_audit' : IDL.Func([], [Result_4], ['query']),
    'balance_get' : IDL.Func([], [IDL.Nat], []),
    'developer_app_get' : IDL.Func([AppMainGetRequest], [Result_5], ['query']),
    'developer_app_list' : IDL.Func([], [Result_6], ['query']),
    'developer_app_new' : IDL.Func([AppMainNewRequest], [Result_5], []),
    'developer_main_get' : IDL.Func([], [Result_7], ['query']),
    'developer_main_register' : IDL.Func(
        [DeveloperMainRegisterRequest],
        [Result_7],
        [],
      ),
    'ego_canister_add' : IDL.Func([IDL.Text, IDL.Principal], [Result_8], []),
    'ego_canister_list' : IDL.Func([], [Result_9], []),
    'ego_owner_add' : IDL.Func([IDL.Principal], [Result_8], []),
    'ego_user_add' : IDL.Func([IDL.Principal], [Result_8], []),
    'user_main_list' : IDL.Func([UserMainListRequest], [Result_10], ['query']),
    'user_role_set' : IDL.Func([UserRoleSetRequest], [Result_11], []),
  });
};
export const init = ({ IDL }) => {
  const InitArg = IDL.Record({ 'init_caller' : IDL.Opt(IDL.Principal) });
  return [InitArg];
};
