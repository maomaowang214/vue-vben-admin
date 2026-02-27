import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace SystemUserApi {
  export interface SystemUser {
    [key: string]: any;
    id: string;
    username: string;
    nickname?: string;
    avatar?: string;
    status: 0 | 1;
    roleNames?: string[];
    roleIds?: string[];
    createTime?: string;
  }
}

/**
 * 获取用户列表
 */
async function getUserList(params: Recordable<any>) {
  return requestClient.get<{
    items: SystemUserApi.SystemUser[];
    total: number;
  }>('/system/user/list', { params });
}

/**
 * 检查用户名是否存在
 */
async function isUsernameExists(username: string, id?: string) {
  return requestClient.get<boolean>('/system/user/username-exists', {
    params: { id, username },
  });
}

/**
 * 创建用户
 */
async function createUser(data: {
  nickname?: string;
  password: string;
  roleIds?: string[];
  status?: number;
  username: string;
}) {
  return requestClient.post('/system/user', data);
}

/**
 * 更新用户
 */
async function updateUser(
  id: string,
  data: {
    nickname?: string;
    password?: string;
    roleIds?: string[];
    status?: number;
  },
) {
  return requestClient.put(`/system/user/${id}`, data);
}

/**
 * 删除用户
 */
async function deleteUser(id: string) {
  return requestClient.delete(`/system/user/${id}`);
}

export { createUser, deleteUser, getUserList, isUsernameExists, updateUser };
