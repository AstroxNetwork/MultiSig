declare namespace API {
  type User = {
    createTime: string;
    email: string;
    icon: string;
    id: number;
    loginTime: string;
    nickName: string;
    note: string;
    password: string;
    status: 0 | 1;
    username: string;
  }

  type Role = {
    adminCount: number;
    createTime: string;
    description: string;
    id: number;
    name: string;
    sort: number;
    status: 0 | 1;
  }

  type Menu = {
    createTime: string;
    hidden: boolean;
    icon: string;
    id: number;
    level: number;
    name: string;
    parentId: number;
    sort: number;
    title: string;
  }

  type Resrouce = {
    categoryId: number;
    createTime: string;
    description: string;
    id: number;
    name: string;
    url: string;
  }


  type ChannelPackage = {
    id: number;
    appId: number;
    name: string;
    nameDesc: string;
    packageFileId: number;
    packageHash: string;
    packageSize: number;
    plat: 'Android' | 'iOS',
    url: string;
    status: '0' |'1';
    updateTime: string;
    versionCode: number;
    versionNo: string;
  }

  type Application = {
    versionCode: number;
    versionNo:string;
    updateType: 'push' | 'force';
    status: string;
    content: string;
    userVersionForceUpdate?: string | string[];
    contentArr: any[]
    id: number;
    name: 'ME' | 'POP';
    updateTime: string;
  }


  type TokenDetail = {
    blockChain: 'ICP' | 'Ethereum';
    contractAddress: string;
    icon: string;
    id: number;
    digits: number;
    desc: string;
    serviceCharge: number | string;
    standard: string;
    symbol: string;
    totalSupply: number | string;
    weight: number;
  }

  type MEUser = {
    backuoMemoTime: string;
    createTime: string;
    id: number;
    ip: string;
    isAddDevice: 0 | 1;
    isBackupMemo: 0 | 1;
    latestLoginTime: string;
    numOfDevice: number;
    principalId: string;
    registerModel: number;
    registerTime: string;
    updateTime: string;
    userName: string;
    version: number;
  }

  type Message = {
    id: number;
    detailList?: {title: string, body: string, userLang: string}[];
    endTime?: string;
    platform?: string;
    title?: string;
    redirectMode?: 1 | 2; // 1->网页,2->App页面
    redirectTarget?: string;
    startTime?: string;
    versionsApplied?: string;
    status?: 10 | 11 | 12; //10:待发布,11:已发布,12:已过期
    isPush?: 0 | 1; // 消息是否引用推送，0：不推送，1：推送
    messageId?: string;
    enabled?: boolean;
    refId?: string;
  }

  type FeedBack = {
    appVersion: string;
    createTime: string;
    description: string;
    errorMessage: string;
    feedbackTime: string;
    id: number;
    models: string;
    principalId: string;
    systemVersion: string;
    title: string;
    updateTime: string;
    userName: string;
    version: string;
    imageUrl: string[];
  }

  type getUsersListResponse = {
    list: User[];
    pageNum: number;
    pageSize: number;
    total: number;
    totalPage: number;
  }


  type getRolesListResponse = {
    list: Role[];
    pageNum: number;
    pageSize: number;
    total: number;
    totalPage: number;
  }

  type getMenuListResponse = {
    list: Menu[];
    pageNum: number;
    pageSize: number;
    total: number;
    totalPage: number;
  }

  type getResourceListResponse = {
    list: Resrouce[];
    pageNum: number;
    pageSize: number;
    total: number;
    totalPage: number;
  }

  type getChannelPackageListRequest = {
    appId: number;
    name:string;
    pageSize: number;
    pageNum: number;
    plat: 'Android' | 'iOS';
    status: '1' | '0';
  }

  type getChannelPackageListResponse = {
    list: ChannelPackage[];
    pageNum: number;
    pageSize: number;
    total: number;
    totalPage: number;
  }


  type getApplicationListResponse = {
    list: Application[];
    pageNum: number;
    pageSize: number;
    total: number;
    totalPage: number;
  }

  type getTokenListResponse = {
    list: TokenDetail[];
    pageNum: number;
    pageSize: number;
    total: number;
    totalPage: number;
  }

  type getMessageResponse = {
    list: Message[];
    pageNum: number;
    pageSize: number;
    total: number;
    totalPage: number;
  }

  type getMeUserResponse = {
    list: MEUser[];
    pageNum: number;
    pageSize: number;
    total: number;
    totalPage: number;
  }

  type getFeedbackResponse = {
    list: FeedBack[];
    pageNum: number;
    pageSize: number;
    total: number;
    totalPage: number;
  }

}