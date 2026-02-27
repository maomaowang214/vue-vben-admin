import type { NotificationItem } from '@vben/layouts';

import { computed, ref } from 'vue';

import { preferences } from '@vben/preferences';

import { defineStore } from 'pinia';

import { getUnreadMessages } from '#/api/system/message';

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<NotificationItem[]>([]);
  /** 消息操作版本号，用于通知消息列表刷新 */
  const messageListRefreshVersion = ref(0);

  const showDot = computed(() =>
    notifications.value.some((item) => !item.isRead),
  );

  /** 触发消息列表刷新（通知弹窗内操作后调用） */
  function triggerMessageListRefresh() {
    messageListRefreshVersion.value += 1;
  }

  async function fetchNotifications(limit = 20) {
    try {
      const data = await getUnreadMessages(limit);
      const defaultAvatar = preferences.app?.defaultAvatar ?? '';
      notifications.value = (data ?? []).map((item) => ({
        id: item.id,
        avatar: item.avatar || defaultAvatar,
        date: item.date ?? '',
        isRead: item.isRead ?? false,
        message: item.message ?? '',
        title: item.title ?? '',
        link: item.link,
      }));
    } catch {
      notifications.value = [];
    }
  }

  return {
    notifications,
    showDot,
    messageListRefreshVersion,
    fetchNotifications,
    triggerMessageListRefresh,
  };
});
