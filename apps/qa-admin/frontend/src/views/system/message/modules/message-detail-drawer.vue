<script lang="ts" setup>
import type { SystemMessageApi } from '#/api/system/message';

import { IconifyIcon } from '@vben/icons';

import { Avatar, Button, Drawer, Tag } from 'ant-design-vue';

import { $t } from '#/locales';

const props = defineProps<{
  isSuper?: boolean;
  item: null | SystemMessageApi.Message;
  open: boolean;
}>();

const emits = defineEmits<{
  read: [item: SystemMessageApi.Message];
  'update:open': [value: boolean];
}>();

function handleClose() {
  emits('update:open', false);
}

function handleRead() {
  if (props.item && !props.item.isRead) {
    emits('read', props.item);
  }
}

function openLink() {
  if (props.item?.link) {
    if (props.item.link.startsWith('http')) {
      window.open(props.item.link, '_blank');
    } else {
      window.location.href = props.item.link;
    }
  }
}
</script>

<template>
  <Drawer
    :open="open"
    :title="item?.title"
    destroy-on-close
    width="480"
    @close="handleClose"
  >
    <template v-if="item" #extra>
      <Button
        v-if="!item.isRead"
        size="small"
        type="primary"
        @click="handleRead"
      >
        {{ $t('system.message.markRead') }}
      </Button>
    </template>
    <div v-if="item" class="message-detail">
      <div class="mb-4 flex items-start gap-3">
        <Avatar :size="56">
          <template #icon>
            <IconifyIcon icon="mdi:message-outline" class="size-6" />
          </template>
        </Avatar>
        <div class="min-w-0 flex-1">
          <h4 class="mb-1 font-medium">{{ item.title }}</h4>
          <p class="text-sm text-muted-foreground">{{ item.date }}</p>
          <Tag v-if="isSuper && item.receiverName" class="mt-1" color="purple">
            {{ $t('system.message.receiver') }}: {{ item.receiverName }}
          </Tag>
        </div>
      </div>
      <div class="rounded-lg bg-muted/50 p-4">
        <p class="whitespace-pre-wrap text-sm">{{ item.message }}</p>
      </div>
      <Button
        v-if="item.link"
        class="mt-4"
        block
        type="primary"
        @click="openLink"
      >
        {{ $t('system.message.link') }}: {{ item.link }}
      </Button>
    </div>
  </Drawer>
</template>
