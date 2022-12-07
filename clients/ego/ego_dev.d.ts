import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface AdminAppCreateRequest {
  'deploy_mode' : DeployMode,
  'logo' : string,
  'name' : string,
  'frontend' : [] | [Principal],
  'description' : string,
  'version' : Version,
  'app_id' : string,
  'category' : Category,
  'backend_data_hash' : string,
  'backend_data' : Array<number>,
}
export interface AdminAppCreateResponse { 'app_version' : AppVersion }
export interface AppMainGetRequest { 'app_id' : string }
export interface AppMainGetResponse { 'app' : EgoDevApp }
export interface AppMainNewRequest {
  'logo' : string,
  'name' : string,
  'description' : string,
  'app_id' : string,
  'category' : Category,
  'price' : number,
}
export interface AppVersion {
  'status' : AppVersionStatus,
  'frontend' : [] | [Wasm],
  'version' : Version,
  'app_id' : string,
  'backend' : [] | [Wasm],
  'file_id' : Principal,
}
export interface AppVersionApproveRequest {
  'version' : Version,
  'app_id' : string,
}
export interface AppVersionNewRequest { 'version' : Version, 'app_id' : string }
export interface AppVersionNewResponse { 'app_version' : AppVersion }
export interface AppVersionSetFrontendAddressRequest {
  'canister_id' : Principal,
  'version' : Version,
  'app_id' : string,
}
export interface AppVersionSetFrontendAddressResponse { 'ret' : boolean }
export type AppVersionStatus = { 'NEW' : null } |
  { 'REJECTED' : null } |
  { 'SUBMITTED' : null } |
  { 'REVOKED' : null } |
  { 'RELEASED' : null } |
  { 'APPROVED' : null };
export interface AppVersionUploadWasmRequest {
  'data' : Array<number>,
  'hash' : string,
  'version' : Version,
  'app_id' : string,
}
export interface AppVersionUploadWasmResponse { 'ret' : boolean }
export interface AppVersionWaitForAuditResponse { 'apps' : Array<EgoDevApp> }
export type CanisterType = { 'BACKEND' : null } |
  { 'ASSET' : null };
export type Category = { 'System' : null } |
  { 'Vault' : null };
export type DeployMode = { 'DEDICATED' : null } |
  { 'SHARED' : null };
export interface Developer {
  'name' : string,
  'user_id' : Principal,
  'is_app_auditor' : boolean,
  'created_apps' : Array<string>,
  'is_manager' : boolean,
}
export interface DeveloperAppListResponse { 'apps' : Array<EgoDevApp> }
export interface DeveloperMainGetResponse { 'developer' : Developer }
export interface DeveloperMainRegisterRequest { 'name' : string }
export interface EgoDevApp {
  'deploy_mode' : DeployMode,
  'logo' : string,
  'name' : string,
  'description' : string,
  'app_id' : string,
  'release_version' : [] | [Version],
  'category' : Category,
  'developer_id' : Principal,
  'price' : number,
  'versions' : Array<AppVersion>,
  'audit_version' : [] | [Version],
}
export interface EgoError { 'msg' : string, 'code' : number }
export interface InitArg { 'init_caller' : [] | [Principal] }
export type Result = { 'Ok' : AdminAppCreateResponse } |
  { 'Err' : EgoError };
export type Result_1 = { 'Ok' : AppVersionNewResponse } |
  { 'Err' : EgoError };
export type Result_10 = { 'Ok' : UserMainListResponse } |
  { 'Err' : EgoError };
export type Result_11 = { 'Ok' : UserRoleSetResponse } |
  { 'Err' : EgoError };
export type Result_2 = { 'Ok' : AppVersionSetFrontendAddressResponse } |
  { 'Err' : EgoError };
export type Result_3 = { 'Ok' : AppVersionUploadWasmResponse } |
  { 'Err' : EgoError };
export type Result_4 = { 'Ok' : AppVersionWaitForAuditResponse } |
  { 'Err' : EgoError };
export type Result_5 = { 'Ok' : null } |
  { 'Err' : string };
export type Result_6 = { 'Ok' : Array<[string, Array<Principal>]> } |
  { 'Err' : string };
export type Result_7 = { 'Ok' : AppMainGetResponse } |
  { 'Err' : EgoError };
export type Result_8 = { 'Ok' : DeveloperAppListResponse } |
  { 'Err' : EgoError };
export type Result_9 = { 'Ok' : DeveloperMainGetResponse } |
  { 'Err' : EgoError };
export interface UserMainListRequest { 'name' : string }
export interface UserMainListResponse { 'users' : Array<Developer> }
export interface UserRoleSetRequest {
  'user_id' : Principal,
  'is_app_auditor' : boolean,
  'is_manager' : boolean,
}
export interface UserRoleSetResponse { 'ret' : boolean }
export interface Version {
  'major' : number,
  'minor' : number,
  'patch' : number,
}
export interface Wasm {
  'canister_id' : Principal,
  'version' : Version,
  'app_id' : string,
  'canister_type' : CanisterType,
}
export interface _SERVICE {
  'admin_app_create' : ActorMethod<[AdminAppCreateRequest], Result>,
  'app_version_approve' : ActorMethod<[AppVersionApproveRequest], Result>,
  'app_version_new' : ActorMethod<[AppVersionNewRequest], Result_1>,
  'app_version_reject' : ActorMethod<[AppVersionNewRequest], Result_1>,
  'app_version_release' : ActorMethod<[AppVersionNewRequest], Result_1>,
  'app_version_revoke' : ActorMethod<[AppVersionNewRequest], Result_1>,
  'app_version_set_frontend_address' : ActorMethod<
    [AppVersionSetFrontendAddressRequest],
    Result_2,
  >,
  'app_version_submit' : ActorMethod<[AppVersionNewRequest], Result_1>,
  'app_version_upload_wasm' : ActorMethod<
    [AppVersionUploadWasmRequest],
    Result_3,
  >,
  'app_version_wait_for_audit' : ActorMethod<[], Result_4>,
  'balance_get' : ActorMethod<[], bigint>,
  'canister_add' : ActorMethod<[string, Principal], Result_5>,
  'canister_list' : ActorMethod<[], Result_6>,
  'canister_remove' : ActorMethod<[string, Principal], Result_5>,
  'developer_app_get' : ActorMethod<[AppMainGetRequest], Result_7>,
  'developer_app_list' : ActorMethod<[], Result_8>,
  'developer_app_new' : ActorMethod<[AppMainNewRequest], Result_7>,
  'developer_main_get' : ActorMethod<[], Result_9>,
  'developer_main_register' : ActorMethod<
    [DeveloperMainRegisterRequest],
    Result_9,
  >,
  'ego_owner_add' : ActorMethod<[Principal], Result_5>,
  'ego_user_add' : ActorMethod<[Principal], Result_5>,
  'user_main_list' : ActorMethod<[UserMainListRequest], Result_10>,
  'user_role_set' : ActorMethod<[UserRoleSetRequest], Result_11>,
}
