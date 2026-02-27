<script lang="ts" setup>
import type { SystemMessageApi } from '#/api/system/message';

import { IconifyIcon } from '@vben/icons';

import { Avatar, Button, Card, Popconfirm, Tag, Tooltip } from 'ant-design-vue';

import { $t } from '#/locales';

const props = defineProps<{
  isSuper?: boolean;
  item: SystemMessageApi.Message;
}>();

const emits = defineEmits<{
  delete: [item: SystemMessageApi.Message];
  read: [item: SystemMessageApi.Message];
  view: [item: SystemMessageApi.Message];
}>();

function truncate(str: string, len: number) {
  if (!str) return '';
  return str.length > len ? `${str.slice(0, len)}...` : str;
}

function handleClick() {
  if (!props.item.isRead) {
    emits('read', props.item);
  }
  emits('view', props.item);
}
</script>

<template>
  <Card
    class="message-card transition-colors"
    :class="[{ 'border-primary/40 bg-accent/30': !item.isRead }]"
    hoverable
    @click="handleClick"
  >
    <div class="flex gap-4">
      <Avatar
        :class="{ 'ring-2 ring-primary/50': !item.isRead }"
        :size="48"
        class="shrink-0"
      >
        <template #icon>
          <IconifyIcon icon="mdi:message-outline" class="size-6" />
        </template>
      </Avatar>
      <div class="min-w-0 flex-1">
        <div class="mb-1 flex items-center gap-2">
          <span
            class="font-medium"
            :class="[{ 'font-semibold text-foreground': !item.isRead }]"
          >
            {{ item.title }}
          </span>
          <Tag :color="item.isRead ? 'default' : 'blue'" size="small">
            {{
              item.isRead
                ? $t('system.message.read')
                : $t('system.message.unread')
            }}
          </Tag>
          <Tag v-if="isSuper && item.receiverName" color="purple" size="small">
            {{ item.receiverName }}
          </Tag>
        </div>
        <p class="mb-2 line-clamp-2 text-sm text-muted-foreground">
          {{ truncate(item.message, 120) }}
        </p>
        <div
          class="flex items-center justify-between text-xs text-muted-foreground"
        >
          <span>{{ item.date }}</span>
          <div class="flex gap-1" @click.stop>
            <Tooltip v-if="!item.isRead" :title="$t('system.message.markRead')">
              <Button size="small" type="link" @click="emits('read', item)">
                {{ $t('system.message.markRead') }}
              </Button>
            </Tooltip>
            <Popconfirm
              :title="$t('ui.actionMessage.deleteConfirm', [item.title])"
              @confirm="emits('delete', item)"
            >
              <Button size="small" type="link" danger>
                {{ $t('common.delete') }}
              </Button>
            </Popconfirm>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

<style scoped>
.message-card {
  cursor: pointer;
}
</style>
