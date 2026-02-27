import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace SystemOnlineApi {
  export interface OnlineUser {
    user_id: string;
    username: string;
    nickname: string;
    login_time: string;
  }
}

/**
 * 获取在线用户列表
 */
async function getOnlineList(params?: Recordable<any>) {
  return requestClient.get<{
    items: SystemOnlineApi.OnlineUser[];
    total: number;
  }>('/system/online/list', { params });
}

/**
 * 强制下线指定用户
 */
async function kickUser(userId: string) {
  return requestClient.post(`/system/online/kick/${userId}`);
}

export { getOnlineList, kickUser };
