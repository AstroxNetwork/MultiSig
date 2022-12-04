import { AppVersionStatus } from "@/canisters/ego_store";
import { AppVersionStatusEnum } from "./types";

export const getStatusByAppStatus  = (status: AppVersionStatus) => {
  let statusKey = '';
  for(const key in status) { 
    statusKey = key
  }
  switch (statusKey) { 
    case AppVersionStatusEnum.REJECTED:
      return 'REJECTED';
    case AppVersionStatusEnum.NEW:
      return 'NEW';
    case AppVersionStatusEnum.SUBMITTED:
      return 'SUBMITTED';
    case AppVersionStatusEnum.REVOKED:
      return 'REVOKED';
    case AppVersionStatusEnum.RELEASED:
      return 'RELEASED';
    case AppVersionStatusEnum.APPROVED:
      return 'APPROVED';
    default:
      return 'UNKNOWN';
  }

}

export const statusValueEnum = {
  '': { text: '全部', status: 'Default' },
  '1': {
    text: '有效',
    status: 'Success',
  },
  '0': {
    text: '失效',
    status: 'Error',
  },
};

export const messageStatusValueEnum = {
  '': { text: '全部', status: 'Default' },
  10: {
    text: '待发布',
    status: 'warning',
  },
  11: {
    text: '已发布',
    status: 'success',
  },
  12: {
    text: '已过期',
    status: 'error',
  },
};

export const messagePushStatusValueEnum = {
  '': { text: '全部', status: 'Default' },
  20: {
    text: '待推送',
    status: 'warning',
  },
  21: {
    text: '已快照',
    status: 'warning',
  },
  22: {
    text: '推送中',
    status: 'processing',
  },
  23: {
    text: '已完成',
    status: 'success',
  },
  24: {
    text: '已暂停',
    status: 'warning',
  },
  25: {
    text: '已过期',
    status: 'error',
  },
};

//20:待推送,21:推送中,22:已完成,23:已暂停,24:已过期

export const standardOptions = [
  {label: 'ICP', value: 'ICP'},
  {label: 'DIP20', value: 'DIP20'},
  {label: 'DRC20', value: 'DRC20'},
  {label: 'XTC', value: 'XTC'},
  {label: 'WICP', value: 'WICP'},
  {label: 'EXT', value: 'EXT'},
  {label: 'ICRC-1', value: 'ICRC-1'},
]

export const platformOptions = [
  {label: 'Android', value: 'android'},
  {label: 'iOS', value: 'ios'},
  {label: 'Web', value: 'web'},
]

export const langOptions = [
  {label: '英语', value: 'en'},
  {label: '日语', value: 'ja'},
  {label: '中文', value: 'zh'},
]

