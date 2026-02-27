import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace SystemMessageApi {
  export interface Message {
    id: string;
    title: string;
    message: string;
    avatar?: string;
    link?: string;
    isRead?: boolean;
    date?: string;
    /** 接收人ID（超级管理员查看时返回） */
    userId?: string;
    /** 接收人姓名（超级管理员查看时返回） */
    receiverName?: string;
  }
}

/**
 * 获取未读消息（通知弹窗用）
 */
async function getUnreadMessages(limit = 20) {
  return requestClient.get<SystemMessageApi.Message[]>(
    '/system/message/unread',
    {
      params: { limit },
    },
  );
}

/**
 * 获取消息列表（分页）
 * 超级管理员可传 userId 筛选指定用户的消息
 */
async function getMessageList(params: Recordable<any> & { userId?: string }) {
  return requestClient.get<{
    items: SystemMessageApi.Message[];
    total: number;
  }>('/system/message/list', { params });
}

/**
 * 标记已读
 */
async function markRead(messageId: string) {
  return requestClient.post(`/system/message/read/${messageId}`);
}

/**
 * 全部标记已读
 */
async function markAllRead() {
  return requestClient.post('/system/message/read-all');
}

/**
 * 删除消息
 */
async function deleteMessage(messageId: string) {
  return requestClient.delete(`/system/message/${messageId}`);
}

/**
 * 清空消息。超级管理员可传 userId 清空指定用户的消息
 */
async function clearMessages(params?: { userId?: string }) {
  return requestClient.post('/system/message/clear', null, { params });
}

/**
 * 创建消息
 */
async function createMessage(data: {
  avatar?: string;
  link?: string;
  message: string;
  title: string;
}) {
  return requestClient.post('/system/message', data);
}

/**
 * 发布消息（按角色、用户批量发送，或发布给全部用户）
 */
async function publishMessage(data: {
  link?: string;
  message: string;
  roleIds?: string[];
  sendToAll?: boolean;
  title: string;
  userIds?: string[];
}) {
  return requestClient.post<{ count: number }>('/system/message/publish', data);
}

export {
  clearMessages,
  createMessage,
  deleteMessage,
  getMessageList,
  getUnreadMessages,
  markAllRead,
  markRead,
  publishMessage,
};
