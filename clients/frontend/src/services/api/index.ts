import xRequest from ".."
import { PATH } from "./path"


/**
 * 上传s3
 * @param data 
 * @returns 
 */
 export const updateS3 = (data: { file: BinaryData}) => {
  return xRequest({
    url: PATH.FILE_S3,
    data,
    method: 'post',
    headers: {
      contentType: 'multipart/form-data;charset=UTF-8'
    }
  })
}

/**
 * 注册用户
 * @param data 
 * @returns 
 */
export const register = (data: any) => {
  return xRequest({
    url: PATH.USER_ADMIN.REGISTER,
    data
  })
}

/**
 * 登录
 * @param data 
 * @returns 
 */
export const login = (data: { username: string, password: string }) => {
  return xRequest<{ username: string, password: string }>({
    url: PATH.USER_ADMIN.LOGIN,
    data,
    method: 'post',
    headers: {
      contentType: 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 获取当前用户信息
 * @param data 
 * @returns 
 */
export const getUserInfo = (data: any) => {
  return xRequest<any>({
    url: PATH.USER_ADMIN.INFO,
    data
  })
}

/**
 * 获取用户列表
 * @param data 
 * @returns 
 */
export const getUsersList = (data: any) => {
  return xRequest<any, API.getUsersListResponse>({
    url: PATH.USER_ADMIN.QUERY,
    data,
  })
}






/**
 * 给角色分配菜单
 * @param data 
 * @returns 
 */
export const allocMenu = (data: any) => {
  return xRequest({
    url: PATH.ROLE.ALLOC_MENU,
    data,
    method: 'post',
    headers: {
      contentType: 'application/json;charset=UTF-8'
    }
  })
}


/**
 * 给角色分配资源
 * @param data 
 * @returns 
 */
 export const allocResource = (data: any) => {
  return xRequest({
    url: PATH.ROLE.ALLOC_RESOURCE,
    data,
    method: 'post',
    headers: {
      contentType: 'application/json;charset=UTF-8'
    }
  })
}



/**
 * 批量删除角色
 * @param data 
 * @returns 
 */
 export const rolesDelete = (data: any) => {
  return xRequest({
    url: PATH.ROLE.DEL,
    data,
    method: 'post',
    headers: {
      contentType: 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 修改角色
 * @param data 
 * @returns 
 */
 export const rolesUpdate = (data: API.Role) => {
  return xRequest({
    url: PATH.ROLE.UPDATE,
    data,
    method: 'post',
    headers: {
      contentType: 'application/json;charset=UTF-8'
    }
  })
}


/**
 * 修改角色状态
 * @param data 
 * @returns 
 */
 export const rolesUpdateStatus = (data: any) => {
  return xRequest({
    url: PATH.ROLE.UPDATE_STATUS,
    data,
    method: 'post',
    headers: {
      contentType: 'application/json;charset=UTF-8'
    }
  })
}


/**
 * 根据角色名称分页获取角色列表
 * @param data 
 * @returns 
 */
 export const getRolesList = (data: any) => {
  return xRequest<any, API.getRolesListResponse>({
    url: PATH.ROLE.QUERY,
    data,
  })
}

/**
 * 根据角色名称分页获取全部角色
 * @param data 
 * @returns 
 */
 export const getRolesListAll = (data: any) => {
  return xRequest<any, API.getRolesListResponse>({
    url: PATH.ROLE.QUERYALL,
    data,
  })
}



/**
 * 根据角色相关菜单
 * @param data 
 * @returns 
 */
 export const getRoleMenu = (roleId: string) => {
  return xRequest<any, API.getMenuListResponse>({
    url: PATH.ROLE.ROLE_MENU.replace('{roleId}', roleId),
    // data,
  })
}



/**
 * 根据角色相关菜单
 * @param data 
 * @returns 
 */
 export const getRoleResrouce = (roleId: string) => {
  return xRequest<any, API.getResourceListResponse>({
    url: PATH.ROLE.ROLE_RESOURCE.replace('{roleId}', roleId),
    // data,
  })
}





/**
 * 分页模糊查询后台资源
 * @param data 
 * @returns 
 */
 export const getResourceList = (data: any) => {
  return xRequest<any, API.getResourceListResponse>({
    url: PATH.RESOURCE.QUERY,
    data,
  })
}

/**
 * 分页模糊查询后台全部资源
 * @param data 
 * @returns 
 */
 export const getResourceListAll = (data: any) => {
  return xRequest<any, API.getResourceListResponse>({
    url: PATH.RESOURCE.QUERYALL,
    data,
  })
}

/**
 * 修改后台资源
 * @param data 
 * @returns 
 */
 export const resourceUpdate = (data: any) => {
  return xRequest({
    url: PATH.RESOURCE.UPDATE,
    data,
    method: 'post',
    headers: {
      contentType: 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 添加后台资源
 * @param data 
 * @returns 
 */
 export const resourceAdd = (data: any) => {
  return xRequest({
    url: PATH.RESOURCE.ADD,
    data,
    method: 'post',
    headers: {
      contentType: 'application/json;charset=UTF-8'
    }
  })
}


/**
 * 删除后台资源
 * @param data 
 * @returns 
 */
 export const resourceDelete = (id: string) => {
  return xRequest({
    url: PATH.RESOURCE.DEL.replace('{id}', id),
    method: 'post',
    headers: {
      contentType: 'application/json;charset=UTF-8'
    }
  })
}



/**
 * 根据条件分页查询渠道包列表
 * @param data 
 * @returns 
 */
 export const getChannelList = (data: any) => {
  return xRequest<any, API.getChannelPackageListResponse>({
    data,
    url: PATH.PACKAGE.CHANNEL.QUERY,
    method: 'post',
    headers: {
      contentType: 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 查所有渠道包名称
 * @param data 
 * @returns 
 */
 export const getAllPackageName = () => {
  return xRequest<any, {name: string, code: string}[]>({
    url: PATH.PACKAGE.CHANNEL.QUERYNAME,
  })
}


/**
 * 新增渠道包
 * @param data 
 * @returns 
 */
 export const channelAdd = (data: any) => {
  return xRequest({
    data,
    url: PATH.PACKAGE.CHANNEL.ADD,
    method: 'post',
    headers: {
      contentType: 'application/json;charset=UTF-8'
    }
  })
}


/**
 * 更新渠道包
 * @param data 
 * @returns 
 */
 export const channelUpdate = (data: any) => {
  return xRequest({
    data,
    url: PATH.PACKAGE.CHANNEL.UPDATE,
    method: 'post',
    headers: {
      contentType: 'application/json;charset=UTF-8'
    }
  })
}


/**
 * 查所有应用版本列表
 * @param data 
 * @returns 
 */
 export const getAllVersionList = (data: { name: string, versionNo: string, status: '1' | '0'}) => {
  return xRequest<any, string[]>({
    url: PATH.PACKAGE.APP.QUERYALL,
    data,
  })
}

/**
 * 根据应用名称查询版本列表
 * @param data 
 * @returns 
 */
 export const getVersionIdByName = (data: {name: string}) => {
  return xRequest<any, string[]>({
    url: PATH.PACKAGE.APP.QUERY_BY_NAME,
    data,
  })
}



/**
 * 查询App列表
 * @param data 
 * @returns 
 */
 export const getAppList = (data: {name: string}) => {
  return xRequest<any, string[]>({
    url: PATH.PACKAGE.APP.QUERY_APP,
    data,
  })
}





/**
 * 查询版本列表
 * @param data 
 * @returns 
 */
 export const getVersionList = (data: {client: 'web' | 'app', name: string, status: '0'| '1', pageNum: number, pageSize: number}) => {
  return xRequest<any, API.getApplicationListResponse>({
    data,
    url: PATH.PACKAGE.APP.QUERY,
    method: 'post',
    headers: {
      contentType: 'application/json;charset=UTF-8'
    }
  })
}



/**
 * 新增版本
 * @param data 
 * @returns 
 */
 export const versionAdd = (data: API.Application) => {
  return xRequest({
    data,
    url: PATH.PACKAGE.APP.ADD,
    method: 'post',
    headers: {
      contentType: 'application/json;charset=UTF-8'
    }
  })
}


/**
 * 更新版本
 * @param data 
 * @returns 
 */
 export const versionUpdate = (data: any) => {
  return xRequest({
    data,
    url: PATH.PACKAGE.APP.UPDATE,
    method: 'post',
    headers: {
      contentType: 'application/json;charset=UTF-8'
    }
  })
}




/**
 * 查询用户反馈详情
 * @param data 
 * @returns 
 */
 export const getUserFeedBackDetail = (data: {id: number}) => {
  return xRequest({
    data,
    url: PATH.FEEDBACK.DETAIL,
    method: 'post',
    headers: {
      contentType: 'application/json;charset=UTF-8'
    }
  })
}


/**
 * 查询用户反馈列表
 * @param data 
 * @returns 
 */
 export const queryUserFeedBackList = (data: any) => {
  return xRequest({
    data,
    url: PATH.FEEDBACK.QUERY,
    method: 'post',
    headers: {
      contentType: 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 添加用户反馈
 * @param data 
 * @returns 
 */
 export const addFeedBack = (data: any) => {
  return xRequest({
    data,
    url: PATH.FEEDBACK.ADD,
    method: 'post',
    headers: {
      contentType: 'application/json;charset=UTF-8'
    }
  })
}


/**
 * 查询ME用户列表
 * @param data 
 * @returns 
 */
 export const queryUsers = (data: any) => {
  return xRequest({
    data,
    url: PATH.USER.QUERY,
    method: 'post',
    headers: {
      contentType: 'application/json;charset=UTF-8'
    }
  })
}


/**
 * 查询ME用户详情
 * @param data 
 * @returns 
 */
 export const queryUserDetail = (data: any) => {
  return xRequest({
    data,
    url: PATH.USER.DETAIL,
    method: 'post',
    headers: {
      contentType: 'application/json;charset=UTF-8'
    }
  })
}


/**
 * 查询Token列表
 * @param data 
 * @returns 
 */
 export const queryTokenList = (data: any) => {
  return xRequest<any, API.getTokenListResponse>({
    data,
    url: PATH.TOKEN.QUERY,
    method: 'post',
    headers: {
      contentType: 'application/json;charset=UTF-8'
    }
  })
}



/**
 * 添加token
 * @param data 
 * @returns 
 */
 export const addToken = (data: any) => {
  return xRequest({
    data,
    url: PATH.TOKEN.ADD,
    method: 'post',
    headers: {
      contentType: 'application/json;charset=UTF-8'
    }
  })
}


/**
 * 更新token
 * @param data 
 * @returns 
 */
 export const updateToken = (data: any) => {
  return xRequest({
    data,
    url: PATH.TOKEN.UPDATE,
    method: 'post',
    headers: {
      contentType: 'application/json;charset=UTF-8'
    }
  })
}


/**
 * 更新token
 * @param data 
 * @returns 
 */
 export const deleteToken = (data: any) => {
  return xRequest({
    data,
    url: PATH.TOKEN.DELETE,
    method: 'delete',
  })
}


/**
 * 消息取消
 * @param data 
 * @returns 
 */
 export const messageCancel = (data: any) => {
  return xRequest({
    data,
    url: PATH.MESSAGE.MESSAGE.CANCEL,
    method: 'post',
    headers: {
      contentType: 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 消息添加
 * @param data 
 * @returns 
 */
 export const messageAdd = (data: any) => {
  return xRequest({
    data,
    url: PATH.MESSAGE.MESSAGE.ADD,
    method: 'post',
    headers: {
      contentType: 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 消息添加
 * @param data 
 * @returns 
 */
 export const messageUpdate = (data: any) => {
  return xRequest({
    data,
    url: PATH.MESSAGE.MESSAGE.UPDATE,
    method: 'post',
    headers: {
      contentType: 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 消息添加
 * @param data 
 * @returns 
 */
 export const messageQuery = (data: any) => {
  return xRequest({
    data,
    url: PATH.MESSAGE.MESSAGE.QUERY,
    method: 'post',
    headers: {
      contentType: 'application/json;charset=UTF-8'
    }
  })
}


/**
 * 消息添加
 * @param data 
 * @returns 
 */
 export const messageDelete = (data: any) => {
  return xRequest({
    data,
    url: PATH.MESSAGE.MESSAGE.DELETE,
  })
}


/**
 * 消息详情
 * @param data 
 * @returns 
 */
 export const getMessageDetailByMsgId = (data: {messageId: string}) => {
  return xRequest<any, API.Message>({
    data,
    url: PATH.MESSAGE.QUERY_DETAIL_BY_MSGID,
  })
}


/**
 * 消息推送暂停
 * @param data 
 * @returns 
 */
 export const messagePushPaused = (data: any) => {
  return xRequest({
    data,
    url: PATH.MESSAGE.PUSH.PAUSED,
    method: 'post',
    headers: {
      contentType: 'application/json;charset=UTF-8'
    }
  })
}


/**
 * 消息推送继续
 * @param data 
 * @returns 
 */
 export const messagePushResume = (data: any) => {
  return xRequest({
    data,
    url: PATH.MESSAGE.PUSH.RESUME,
    method: 'post',
    headers: {
      contentType: 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 消息推送添加
 * @param data 
 * @returns 
 */
 export const messagePushAdd = (data: any) => {
  return xRequest({
    data,
    url: PATH.MESSAGE.PUSH.ADD,
    method: 'post',
    headers: {
      contentType: 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 消息推送更新
 * @param data 
 * @returns 
 */
 export const messagePushUpdate = (data: any) => {
  return xRequest({
    data,
    url: PATH.MESSAGE.PUSH.UPDATE,
    method: 'post',
    headers: {
      contentType: 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 消息推送查询
 * @param data 
 * @returns 
 */
 export const messagePushQuery = (data: any) => {
  return xRequest({
    data,
    url: PATH.MESSAGE.PUSH.QUERY,
    method: 'post',
    headers: {
      contentType: 'application/json;charset=UTF-8'
    }
  })
}


/**
 * 消息推送删除
 * @param data 
 * @returns 
 */
 export const messagePushDelete = (data: any) => {
  return xRequest({
    data,
    url: PATH.MESSAGE.PUSH.DELETE,
  })
}



/**
 * 消息添加
 * @param data 
 * @returns 
 */
 export const announcementAdd = (data: any) => {
  return xRequest({
    data,
    url: PATH.MESSAGE.ANNOUNCEMENT.ADD,
    method: 'post',
    headers: {
      contentType: 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 消息添加
 * @param data 
 * @returns 
 */
 export const announcementCancel = (data: any) => {
  return xRequest({
    data,
    url: PATH.MESSAGE.ANNOUNCEMENT.CANCEL,
    method: 'post',
    headers: {
      contentType: 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 消息添加
 * @param data 
 * @returns 
 */
 export const announcementUpdate = (data: any) => {
  return xRequest({
    data,
    url: PATH.MESSAGE.ANNOUNCEMENT.UPDATE,
    method: 'post',
    headers: {
      contentType: 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 消息添加
 * @param data 
 * @returns 
 */
 export const  announcementQuery = (data: any) => {
  return xRequest({
    data,
    url: PATH.MESSAGE.ANNOUNCEMENT.QUERY,
    method: 'post',
    headers: {
      contentType: 'application/json;charset=UTF-8'
    }
  })
}


/**
 * 消息添加
 * @param data 
 * @returns 
 */
 export const announcementDelete = (data: any) => {
  return xRequest({
    data,
    url: PATH.MESSAGE.ANNOUNCEMENT.DELETE,
  })
}


/**
 * 查询APP所有跳转链接列表
 * @param data 
 * @returns 
 */
 export const getAppCustomLink = (data:any) => {
  return xRequest<any, {name: string, route: string}[]>({
    url: PATH.CONFIG.QUERY_APP_CUSTOM_LINK,
    data,
  })
}





