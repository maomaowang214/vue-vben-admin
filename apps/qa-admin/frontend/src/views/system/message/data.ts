import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemMessageApi } from '#/api/system/message';

import { getRoleList } from '#/api/system/role';
import { getUserList } from '#/api/system/user';
import { $t } from '#/locales';

const SUPER_ADMIN_ROLE = '超级管理员';

export function isSuperAdmin(roles?: string[]): boolean {
  return Boolean(roles?.includes(SUPER_ADMIN_ROLE));
}

async function fetchRoleOptions() {
  const r = await getRoleList({ page: 1, pageSize: 999 });
  return (r as { items?: { id: string; name: string }[] })?.items ?? [];
}

async function fetchUserOptions() {
  const r = await getUserList({ page: 1, pageSize: 999 });
  return (
    (r as { items?: { id: string; nickname?: string; username: string }[] })
      ?.items ?? []
  );
}

export function usePublishFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      componentProps: {
        class: 'w-full',
        maxLength: 100,
        placeholder: $t('system.message.titlePlaceholder'),
        showCount: true,
      },
      controlClass: 'w-full min-w-0',
      fieldName: 'title',
      label: $t('system.message.messageTitle'),
      rules: 'required',
    },
    {
      component: 'Textarea',
      componentProps: {
        class: 'w-full resize-y min-h-[120px]',
        maxLength: 500,
        placeholder: $t('system.message.contentPlaceholder'),
        rows: 5,
        showCount: true,
        style: { width: '100%' },
      },
      controlClass: 'w-full min-w-0',
      fieldName: 'message',
      formItemClass: 'items-start',
      label: $t('system.message.message'),
      rules: 'required',
      wrapperClass: 'items-start',
    },
    {
      component: 'Input',
      componentProps: {
        class: 'w-full',
        placeholder: $t('system.message.linkPlaceholder'),
      },
      controlClass: 'w-full min-w-0',
      fieldName: 'link',
      help: $t('system.message.linkHelp'),
      label: $t('system.message.link'),
    },
    {
      component: 'Divider',
      fieldName: '_recipientDivider',
      formItemClass: 'col-span-full pb-0 pt-2',
      hideLabel: true,
      renderComponentContent: () => ({
        default: () => $t('system.message.recipientSection'),
      }),
    },
    {
      component: 'Checkbox',
      fieldName: 'sendToAll',
      formItemClass: 'col-span-full',
      hideLabel: true,
      renderComponentContent: () => ({
        default: () => $t('system.message.sendToAll'),
      }),
    },
    {
      component: 'ApiSelect',
      componentProps: {
        api: fetchRoleOptions,
        class: 'w-full',
        immediate: true,
        labelField: 'name',
        maxTagCount: 3,
        mode: 'multiple',
        placeholder: $t('system.message.rolePlaceholder'),
        valueField: 'id',
      },
      controlClass: 'w-full min-w-0',
      fieldName: 'roleIds',
      help: $t('system.message.targetHelp'),
      label: $t('system.message.targetRoles'),
    },
    {
      component: 'ApiSelect',
      componentProps: {
        api: fetchUserOptions,
        class: 'w-full',
        immediate: true,
        labelField: 'username',
        maxTagCount: 3,
        mode: 'multiple',
        placeholder: $t('system.message.userPlaceholder'),
        valueField: 'id',
      },
      controlClass: 'w-full min-w-0',
      fieldName: 'userIds',
      label: $t('system.message.targetUsers'),
    },
  ];
}

export function useGridFormSchema(isSuper: boolean): VbenFormSchema[] {
  const base = [
    {
      component: 'Input',
      fieldName: 'title',
      label: $t('system.message.messageTitle'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: $t('system.message.unread'), value: 0 },
          { label: $t('system.message.read'), value: 1 },
        ],
      },
      fieldName: 'isRead',
      label: $t('system.message.status'),
    },
  ];
  if (isSuper) {
    return [
      ...base,
      {
        component: 'ApiSelect',
        componentProps: {
          api: () =>
            getUserList({ page: 1, pageSize: 999 }).then(
              (r: any) => r?.items ?? [],
            ),
          immediate: true,
          labelField: 'username',
          placeholder: $t('system.message.filterByUser'),
          valueField: 'id',
        },
        fieldName: 'userId',
        label: $t('system.message.receiver'),
      },
    ];
  }
  return base;
}

function getMessageReadOptions() {
  return [
    { color: 'default', label: $t('system.message.unread'), value: false },
    { color: 'success', label: $t('system.message.read'), value: true },
  ];
}

export function useColumns<T = SystemMessageApi.Message>(
  onActionClick: OnActionClickFn<T>,
  isSuper?: boolean,
): VxeTableGridOptions['columns'] {
  const cols: VxeTableGridOptions['columns'] = [
    {
      align: 'left',
      field: 'title',
      minWidth: 180,
      title: $t('system.message.messageTitle'),
    },
    {
      align: 'left',
      field: 'message',
      minWidth: 200,
      title: $t('system.message.message'),
    },
    {
      align: 'center',
      cellRender: { name: 'CellTag', options: getMessageReadOptions() },
      field: 'isRead',
      title: $t('system.message.status'),
      width: 100,
    },
    ...(isSuper
      ? [
          {
            align: 'center',
            field: 'receiverName',
            title: $t('system.message.receiver'),
            width: 120,
          },
        ]
      : []),
    {
      field: 'date',
      formatter: 'formatDateTime',
      title: $t('system.message.createTime'),
      width: 180,
    },
    {
      cellRender: {
        attrs: {
          nameField: 'title',
          nameTitle: $t('system.message.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'read',
            show: (row: T) => !(row as SystemMessageApi.Message).isRead,
            text: $t('system.message.markRead'),
          },
          'delete',
        ],
      },
      align: 'center',
      field: 'operation',
      fixed: 'right',
      title: $t('system.user.operation'),
      width: 130,
    },
  ];
  return cols;
}
