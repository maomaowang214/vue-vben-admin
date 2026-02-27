<script lang="ts" setup>
import type { SystemMessageApi } from '#/api/system/message';

import { computed, onMounted, ref, watch } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { createIconifyIcon } from '@vben/icons';
import { useUserStore } from '@vben/stores';

import {
  Button,
  Empty,
  Input,
  message,
  Pagination,
  Segmented,
  Select,
  Spin,
} from 'ant-design-vue';
import { storeToRefs } from 'pinia';

import {
  clearMessages,
  deleteMessage,
  getMessageList,
  markAllRead,
  markRead,
} from '#/api/system/message';
import { getUserList } from '#/api/system/user';
import { $t } from '#/locales';
import { useNotificationStore } from '#/store';

import { isSuperAdmin } from './data';
import MessageCard from './modules/message-card.vue';
import MessageDetailDrawer from './modules/message-detail-drawer.vue';
import PublishForm from './modules/publish-form.vue';

const SendIcon = createIconifyIcon('mdi:send');
const userStore = useUserStore();
const notificationStore = useNotificationStore();
const { userInfo } = storeToRefs(userStore);
const isSuper = computed(() => isSuperAdmin(userInfo.value?.roles));

const [PublishDrawer, publishDrawerApi] = useVbenDrawer({
  connectedComponent: PublishForm as any,
  destroyOnClose: true,
});

const items = ref<SystemMessageApi.Message[]>([]);
const total = ref(0);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(20);
const activeTab = ref<'all' | 'read' | 'unread'>('all');
const searchTitle = ref('');
const searchUserId = ref<string | undefined>();
const userOptions = ref<{ label: string; value: string }[]>([]);
const detailOpen = ref(false);
const selectedItem = ref<null | SystemMessageApi.Message>(null);
const unreadCount = computed(() => items.value.filter((i) => !i.isRead).length);

const tabOptions = computed(() => [
  { label: $t('system.message.all'), value: 'all' },
  { label: $t('system.message.read'), value: 'read' },
  { label: $t('system.message.unread'), value: 'unread' },
]);

const queryParams = computed(() => {
  const params: Record<string, any> = {
    page: currentPage.value,
    pageSize: pageSize.value,
  };
  if (searchTitle.value) params.title = searchTitle.value;
  if (activeTab.value === 'read') params.isRead = 1;
  else if (activeTab.value === 'unread') params.isRead = 0;
  if (isSuper.value && searchUserId.value) params.userId = searchUserId.value;
  return params;
});

async function fetchUserOptions() {
  if (!isSuper.value) return;
  try {
    const r = await getUserList({ page: 1, pageSize: 999 });
    const list = (r as any)?.items ?? (r as any)?.data?.items ?? [];
    userOptions.value = (list || []).map((u: any) => ({
      label: u.username || u.nickname || u.id,
      value: u.id,
    }));
  } catch {
    userOptions.value = [];
  }
}

async function fetchList() {
  loading.value = true;
  try {
    const res = await getMessageList(queryParams.value);
    const data = res as any;
    items.value = data?.items ?? data?.data?.items ?? [];
    total.value = data?.total ?? data?.data?.total ?? 0;
  } catch {
    items.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
}

function onRefresh() {
  currentPage.value = 1;
  fetchList();
}

function onTabChange(key: number | string) {
  activeTab.value = String(key) as 'all' | 'read' | 'unread';
  currentPage.value = 1;
  fetchList();
}

function onPageChange(page: number, size: number) {
  currentPage.value = page;
  pageSize.value = size;
  fetchList();
}

async function onMarkRead(row: SystemMessageApi.Message) {
  try {
    await markRead(row.id);
    message.success($t('system.message.markReadSuccess'));
    onRefresh();
    await notificationStore.fetchNotifications();
  } catch {
    // ignore
  }
}

async function onDelete(row: SystemMessageApi.Message) {
  try {
    await deleteMessage(row.id);
    message.success($t('ui.actionMessage.deleteSuccess', [row.title]));
    detailOpen.value = false;
    selectedItem.value = null;
    onRefresh();
    await notificationStore.fetchNotifications();
  } catch {
    // ignore
  }
}

async function onClear() {
  try {
    const params =
      isSuper.value && searchUserId.value
        ? { userId: searchUserId.value }
        : undefined;
    await clearMessages(params);
    message.success($t('system.message.clearSuccess'));
    detailOpen.value = false;
    selectedItem.value = null;
    onRefresh();
    await notificationStore.fetchNotifications();
  } catch {
    // ignore
  }
}

async function onMarkAllRead() {
  try {
    await markAllRead();
    message.success($t('system.message.markReadSuccess'));
    onRefresh();
    await notificationStore.fetchNotifications();
  } catch {
    // ignore
  }
}

function onPublish() {
  publishDrawerApi.open();
}

async function onPublishSuccess() {
  onRefresh();
  await notificationStore.fetchNotifications();
}

function onSearch() {
  currentPage.value = 1;
  fetchList();
}

function onViewDetail(item: SystemMessageApi.Message) {
  selectedItem.value = item;
  detailOpen.value = true;
}

watch(
  () => notificationStore.messageListRefreshVersion,
  () => onRefresh(),
);

onMounted(() => {
  fetchUserOptions();
  fetchList();
});
</script>

<template>
  <Page auto-content-height>
    <div class="flex h-full flex-col">
      <!-- 头部 -->
      <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <h2 class="m-0 text-lg font-semibold">
            {{ $t('system.message.title') }}
          </h2>
          <span
            v-if="unreadCount > 0"
            class="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary"
          >
            {{ unreadCount }} {{ $t('system.message.unread') }}
          </span>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <Button v-if="unreadCount > 0" @click="onMarkAllRead">
            {{ $t('system.message.markRead') }}
          </Button>
          <Button v-if="isSuper" type="primary" @click="onPublish">
            <SendIcon class="size-4" />
            {{ $t('system.message.publish') }}
          </Button>
          <Button danger @click="onClear">
            {{ $t('system.message.clear') }}
          </Button>
        </div>
      </div>

      <!-- 筛选栏 -->
      <div
        class="mb-4 flex flex-wrap items-center gap-3 rounded-lg border bg-card p-3"
      >
        <Input
          v-model:value="searchTitle"
          :placeholder="$t('system.message.messageTitle')"
          allow-clear
          class="w-48"
          @press-enter="onSearch"
        />
        <Select
          v-if="isSuper"
          v-model:value="searchUserId"
          :placeholder="$t('system.message.filterByUser')"
          allow-clear
          class="w-40"
          :options="userOptions"
        />
        <Button type="primary" @click="onSearch">
          {{ $t('common.search') }}
        </Button>
        <Button @click="onRefresh">
          {{ $t('common.refresh') }}
        </Button>
      </div>

      <!-- 筛选标签 + 列表 -->
      <div
        class="flex flex-1 flex-col overflow-hidden rounded-lg border bg-card"
      >
        <div
          class="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3"
        >
          <Segmented
            v-model:value="activeTab"
            :options="tabOptions"
            @change="onTabChange"
          />
          <span class="text-sm text-muted-foreground">
            {{ $t('system.message.totalRecords', [total]) }}
          </span>
        </div>

        <Spin :spinning="loading" class="flex-1 overflow-auto p-4">
          <div v-if="items.length > 0" class="space-y-3">
            <MessageCard
              v-for="item in items"
              :key="item.id"
              :item="item"
              :is-super="isSuper"
              @delete="onDelete"
              @read="onMarkRead"
              @view="onViewDetail"
            />
          </div>
          <Empty v-else :description="$t('common.noData')" class="py-16" />
        </Spin>

        <div v-if="total > 0" class="flex justify-end border-t p-3">
          <Pagination
            v-model:current="currentPage"
            v-model:page-size="pageSize"
            :total="total"
            :show-size-changer="true"
            :page-size-options="['10', '20', '50']"
            :show-total="(t: number) => $t('system.message.totalRecords', [t])"
            @change="(p: number, s: number) => onPageChange(p, s)"
          />
        </div>
      </div>
    </div>

    <PublishDrawer v-if="isSuper" @success="onPublishSuccess" />
    <MessageDetailDrawer
      v-model:open="detailOpen"
      :item="selectedItem"
      :is-super="isSuper"
      @read="onMarkRead"
    />
  </Page>
</template>
