



export const PATH = {
  FILE_S3: '/s3/upload',
  USER_ADMIN: {
    REGISTER: '/admin/register',
    LOGIN: '/admin/login',
    LOGOUT: '/admin/logout',
    REFRESHTOKEN: '/admin/refreshToken',
    QUERY: '/admin/list',
    UPDATE: '/admin/update/{id}',
    INFO: '/admin/info',
    ROLE: {
      SET: '/admin/role/update',
      GET: '/admin/role/{adminId}'
    },
  },
  RESOURCE: {
    ADD: '/resource/create',
    QUERY: '/resource/list',
    QUERYALL: '/resource/listAll',
    DEL: '/resource/delete/{id}',
    UPDATE: '/resource/update/{id}'
  },
  ROLE: {
    ALLOC_MENU: '/role/allocMenu',
    ALLOC_RESOURCE: '/role/allocResource',
    ADD: '/role/create',
    DEL: '/role/delete',
    QUERY: '/role/list',
    QUERYALL: '/role/listAll',
    ROLE_MENU: '/role/listmenu/{roleId}',
    ROLE_RESOURCE: '/role/listresource/{roleId}',
    UPDATE: '/role/update/{id}',
    UPDATE_STATUS: '/role/updateStatus/{id}',
  },
  PACKAGE: {
    APP: {
      QUERY: '/opApp/pageQueryApplicationList',
      QUERYALL:'/opApp/queryAllAppList',
      QUERY_BY_NAME: '/opApp/queryAllVersionNoList',
      QUERY_APP: '/opApp/queryAllVersionNoList',
      ADD: '/opApp/save',
      UPDATE: '/opApp/update'
    },
    CHANNEL: {
      QUERY: '/opChannelPackage/pageQueryChannelPackageList',
      ADD: '/opChannelPackage/save',
      UPDATE: '/opChannelPackage/update',
      QUERYNAME: '/opChannelPackage/queryAllChannelNameList',
    },
  },
  CONFIG: {
    QUERY_APP_CUSTOM_LINK: '/opConfig/queryRedirectRouteList'
  },
  FEEDBACK: {
    DETAIL: '/oper/getUserFeedBackDetail',
    QUERY: '/oper/queryUserFeedBack',
    ADD: '/oper/saveUserFeedBack',
  },
  TOKEN: {
    QUERY: '/oper/queryTokenList',
    ADD: '/oper/saveToken',
    UPDATE: '/oper/updateToken',
    DELETE: '/oper/deleteToken',
  },
  USER: {
    QUERY: '​/oper​/listUserInfo',
    DETAIL: '/oper/queryUserInfo',
  },
  MESSAGE: {
    QUERY_DETAIL_BY_MSGID: '/message/queryDetailByMessageId',
    MESSAGE: {
      QUERY: '/opMessage/pageQueryMessageList',
      ADD: '/opMessage/save',
      UPDATE: '/opMessage/update',
      DELETE: '/opMessage/delete',
      CANCEL: '/opMessage/cancel'
    },
    PUSH: {
      QUERY: '/opMessagePush/pageQueryMessagePushList',
      ADD: '/opMessagePush/save',
      UPDATE: '/opMessagePush/update',
      DELETE: '/opMessagePush/delete',
      PAUSED: '/opMessagePush/paused',
      RESUME: '/opMessagePush/resume',
    },
    ANNOUNCEMENT: {
      QUERY: '/opAnnouncement/pageQueryAnnounceList',
      ADD: '/opAnnouncement/save',
      UPDATE: '/opAnnouncement/update',
      DELETE: '/opAnnouncement/delete',
      CANCEL: '/opAnnouncement/cancel'
    }
  }

}