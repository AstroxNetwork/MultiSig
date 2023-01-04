import type {Principal} from '@dfinity/principal';
import type {ActorMethod} from '@dfinity/agent';

export interface AdminAppCreateBackendRequest {
  'logo': string,
  'name': string,
  'description': string,
  'version': Version,
  'app_id': string,
  'category': Category,
  'backend_data_hash': string,
  'backend_data': Array<number>,
}

export interface App {
  'logo': string,
  'name': string,
  'description': string,
  'app_id': string,
  'category': Category,
  'current_version': Version,
  'price': number,
}

export interface AppMainNewRequest {
  'logo': string,
  'name': string,
  'description': string,
  'app_id': string,
  'category': Category,
  'price': number,
}

export interface AppVersion {
  'status': AppVersionStatus,
  'wasm': [] | [Wasm],
  'version': Version,
  'app_id': string,
  'file_id': Principal,
}

export interface AppVersionSetFrontendAddressRequest {
  'canister_id': Principal,
  'version': Version,
  'app_id': string,
}

export type AppVersionStatus = { 'NEW': null } |
  { 'REJECTED': null } |
  { 'SUBMITTED': null } |
  { 'REVOKED': null } |
  { 'RELEASED': null } |
  { 'APPROVED': null };

export interface AppVersionUploadWasmRequest {
  'data': Array<number>,
  'hash': string,
  'version': Version,
  'app_id': string,
}

export type CanisterType = { 'BACKEND': null } |
  { 'ASSET': null };
export type Category = { 'System': null } |
  { 'Vault': null };

export interface Developer {
  'name': string,
  'is_app_auditor': boolean,
  'developer_id': Principal,
  'created_apps': Array<string>,
  'is_manager': boolean,
}

export interface EgoDevApp {
  'app': App,
  'developer_id': Principal,
  'versions': Array<AppVersion>,
  'audit_version': [] | [Version],
}

export interface EgoError {
  'msg': string,
  'code': number
}

export interface InitArg {
  'init_caller': [] | [Principal]
}

export type Result = { 'Ok': AppVersion } |
  { 'Err': EgoError };
export type Result_1 = { 'Ok': boolean } |
  { 'Err': EgoError };
export type Result_2 = { 'Ok': Array<EgoDevApp> } |
  { 'Err': EgoError };
export type Result_3 = { 'Ok': bigint } |
  { 'Err': string };
export type Result_4 = { 'Ok': EgoDevApp } |
  { 'Err': EgoError };
export type Result_5 = { 'Ok': Developer } |
  { 'Err': EgoError };
export type Result_6 = { 'Ok': null } |
  { 'Err': string };
export type Result_7 = { 'Ok': Array<string> } |
  { 'Err': string };
export type Result_8 = { 'Ok': Array<Developer> } |
  { 'Err': EgoError };

export interface UserRoleSetRequest {
  'user_id': Principal,
  'is_app_auditor': boolean,
  'is_manager': boolean,
}

export interface Version {
  'major': number,
  'minor': number,
  'patch': number,
}

export interface Wasm {
  'canister_id': Principal,
  'version': Version,
  'app_id': string,
  'canister_type': CanisterType,
}

export interface _SERVICE {
  'admin_app_create': ActorMethod<[AdminAppCreateBackendRequest], Result>,
  'app_version_approve': ActorMethod<[string, Version], Result>,
  'app_version_new': ActorMethod<[string, Version], Result>,
  'app_version_reject': ActorMethod<[string, Version], Result>,
  'app_version_release': ActorMethod<[string, Version], Result>,
  'app_version_revoke': ActorMethod<[string, Version], Result>,
  'app_version_set_frontend_address': ActorMethod<[AppVersionSetFrontendAddressRequest],
    Result_1,
    >,
  'app_version_submit': ActorMethod<[string, Version], Result>,
  'app_version_upload_wasm': ActorMethod<[AppVersionUploadWasmRequest],
    Result_1,
    >,
  'app_version_wait_for_audit': ActorMethod<[], Result_2>,
  'balance_get': ActorMethod<[], Result_3>,
  'developer_app_get': ActorMethod<[string], Result_4>,
  'developer_app_list': ActorMethod<[], Result_2>,
  'developer_app_new': ActorMethod<[AppMainNewRequest], Result_4>,
  'developer_main_get': ActorMethod<[], Result_5>,
  'developer_main_register': ActorMethod<[string], Result_5>,
  'ego_canister_add': ActorMethod<[string, Principal], Result_6>,
  'ego_controller_add': ActorMethod<[Principal], Result_6>,
  'ego_controller_remove': ActorMethod<[Principal], Result_6>,
  'ego_controller_set': ActorMethod<[Array<Principal>], Result_6>,
  'ego_log_list': ActorMethod<[bigint], Result_7>,
  'ego_op_add': ActorMethod<[Principal], Result_6>,
  'ego_owner_add': ActorMethod<[Principal], Result_6>,
  'ego_owner_remove': ActorMethod<[Principal], Result_6>,
  'ego_owner_set': ActorMethod<[Array<Principal>], Result_6>,
  'ego_user_add': ActorMethod<[Principal], Result_6>,
  'ego_user_remove': ActorMethod<[Principal], Result_6>,
  'ego_user_set': ActorMethod<[Array<Principal>], Result_6>,
  'user_main_list': ActorMethod<[string], Result_8>,
  'user_role_set': ActorMethod<[UserRoleSetRequest], Result_1>,
}
