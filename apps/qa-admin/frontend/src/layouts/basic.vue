<script lang="ts" setup>
import type { NotificationItem } from '@vben/layouts';

import { computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

import { AuthenticationLoginExpiredModal } from '@vben/common-ui';
import { VBEN_DOC_URL } from '@vben/constants';
import { useWatermark } from '@vben/hooks';
import { BookOpenText } from '@vben/icons';
import {
  BasicLayout,
  LockScreen,
  Notification,
  UserDropdown,
} from '@vben/layouts';
import { preferences } from '@vben/preferences';
import { useAccessStore, useUserStore } from '@vben/stores';
import { openWindow } from '@vben/utils';

import { storeToRefs } from 'pinia';

import {
  clearMessages,
  deleteMessage,
  markAllRead,
  markRead,
} from '#/api/system/message';
import { $t } from '#/locales';
import { useAuthStore, useNotificationStore } from '#/store';
import LoginForm from '#/views/_core/authentication/login.vue';

const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();
const accessStore = useAccessStore();
const notificationStore = useNotificationStore();
const { destroyWatermark, updateWatermark } = useWatermark();
const { notifications, showDot } = storeToRefs(notificationStore);
const { fetchNotifications, triggerMessageListRefresh } = notificationStore;

const menus = computed(() => [
  {
    handler: () => {
      router.push({ name: 'Profile' });
    },
    icon: 'lucide:user',
    text: $t('page.auth.profile'),
  },
  {
    handler: () => {
      openWindow(VBEN_DOC_URL, {
        target: '_blank',
      });
    },
    icon: BookOpenText,
    text: $t('ui.widgets.document'),
  },
]);

const avatar = computed(() => {
  return userStore.userInfo?.avatar ?? preferences.app.defaultAvatar;
});

onMounted(() => {
  fetchNotifications();
});

async function handleLogout() {
  await authStore.logout(false);
}

async function handleNoticeClear() {
  try {
    await clearMessages();
    notifications.value = [];
    triggerMessageListRefresh();
  } catch {
    // ignore
  }
}

async function handleMarkRead(item: NotificationItem) {
  try {
    await markRead(String(item.id));
    const n = notifications.value.find((n) => n.id === item.id);
    if (n) n.isRead = true;
    triggerMessageListRefresh();
  } catch {
    // ignore
  }
}

async function handleRemove(item: NotificationItem) {
  try {
    await deleteMessage(String(item.id));
    notifications.value = notifications.value.filter((n) => n.id !== item.id);
    triggerMessageListRefresh();
  } catch {
    // ignore
  }
}

async function handleMakeAll() {
  try {
    await markAllRead();
    notifications.value.forEach((item) => (item.isRead = true));
    triggerMessageListRefresh();
  } catch {
    // ignore
  }
}

function handleViewAll() {
  router.push({ name: 'SystemMessage' });
}
watch(
  () => ({
    enable: preferences.app.watermark,
    content: preferences.app.watermarkContent,
  }),
  async ({ enable, content }) => {
    if (enable) {
      await updateWatermark({
        content:
          content ||
          `${userStore.userInfo?.username} - ${userStore.userInfo?.realName}`,
      });
    } else {
      destroyWatermark();
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <BasicLayout @clear-preferences-and-logout="handleLogout">
    <template #user-dropdown>
      <UserDropdown
        :avatar
        :menus
        :description="userStore.userInfo?.username"
        :text="userStore.userInfo?.realName"
        @logout="handleLogout"
      />
    </template>
    <template #notification>
      <Notification
        :dot="showDot"
        :notifications="notifications"
        @clear="handleNoticeClear"
        @make-all="handleMakeAll"
        @read="(item) => handleMarkRead(item)"
        @remove="(item) => handleRemove(item)"
        @view-all="handleViewAll"
      />
    </template>
    <template #extra>
      <AuthenticationLoginExpiredModal
        v-model:open="accessStore.loginExpired"
        :avatar
      >
        <LoginForm />
      </AuthenticationLoginExpiredModal>
    </template>
    <template #lock-screen>
      <LockScreen :avatar @to-login="handleLogout" />
    </template>
  </BasicLayout>
</template>
