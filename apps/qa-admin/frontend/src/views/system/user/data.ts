import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemUserApi } from '#/api/system/user';

import { getRoleList } from '#/api/system/role';
import { $t } from '#/locales';

const SUPER_ADMIN_ROLE = '超级管理员';

export function isSuperAdmin(row: SystemUserApi.SystemUser): boolean {
  return Boolean(row.roleNames?.includes(SUPER_ADMIN_ROLE));
}

async function fetchRoleOptions() {
  const r = await getRoleList({ page: 1, pageSize: 999 });
  return (r as any)?.items ?? [];
}

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'username',
      label: $t('system.user.username'),
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: { type: 'password' },
      fieldName: 'password',
      label: $t('system.user.password'),
      rules: 'required',
      dependencies: {},
    },
    {
      component: 'Input',
      fieldName: 'nickname',
      label: $t('system.user.nickname'),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: $t('common.enabled'), value: 1 },
          { label: $t('common.disabled'), value: 0 },
        ],
        optionType: 'button',
      },
      defaultValue: 1,
      fieldName: 'status',
      label: $t('system.user.status'),
    },
    {
      component: 'ApiSelect',
      componentProps: {
        api: fetchRoleOptions,
        immediate: true,
        labelField: 'name',
        mode: 'multiple',
        valueField: 'id',
      },
      fieldName: 'roleIds',
      label: $t('system.user.roles'),
    },
  ];
}

export function useEditFormSchema(
  data?: null | SystemUserApi.SystemUser,
): VbenFormSchema[] {
  const disableStatus = data ? isSuperAdmin(data) : false;
  return [
    {
      component: 'Input',
      componentProps: { disabled: true },
      fieldName: 'username',
      label: $t('system.user.username'),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('system.user.passwordPlaceholder'),
        type: 'password',
      },
      fieldName: 'password',
      label: $t('system.user.password'),
    },
    {
      component: 'Input',
      fieldName: 'nickname',
      label: $t('system.user.nickname'),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        disabled: disableStatus,
        options: [
          { label: $t('common.enabled'), value: 1 },
          { label: $t('common.disabled'), value: 0 },
        ],
        optionType: 'button',
      },
      fieldName: 'status',
      label: $t('system.user.status'),
      ...(disableStatus && { help: $t('system.user.superAdminNoDisable') }),
    },
    {
      component: 'ApiSelect',
      componentProps: {
        api: fetchRoleOptions,
        immediate: true,
        labelField: 'name',
        mode: 'multiple',
        valueField: 'id',
      },
      fieldName: 'roleIds',
      label: $t('system.user.roles'),
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'username',
      label: $t('system.user.username'),
    },
    {
      component: 'Input',
      fieldName: 'nickname',
      label: $t('system.user.nickname'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: $t('common.enabled'), value: 1 },
          { label: $t('common.disabled'), value: 0 },
        ],
      },
      fieldName: 'status',
      label: $t('system.user.status'),
    },
    {
      component: 'RangePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
      },
      fieldName: 'createTime',
      label: $t('system.user.createTime'),
    },
  ];
}

export function useColumns<T = SystemUserApi.SystemUser>(
  onActionClick: OnActionClickFn<T>,
  onStatusChange?: (newStatus: any, row: T) => PromiseLike<boolean | undefined>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'username',
      title: $t('system.user.username'),
      width: 140,
    },
    {
      field: 'nickname',
      title: $t('system.user.nickname'),
      width: 140,
    },
    {
      cellRender: {
        attrs: { beforeChange: onStatusChange },
        name: onStatusChange ? 'CellSwitch' : 'CellTag',
      },
      field: 'status',
      title: $t('system.user.status'),
      width: 100,
    },
    {
      field: 'roleNames',
      title: $t('system.user.roles'),
      slots: { default: 'roleNames' },
      minWidth: 160,
    },
    {
      field: 'createTime',
      formatter: 'formatDateTime',
      title: $t('system.user.createTime'),
      width: 180,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'username',
          nameTitle: $t('system.user.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          'edit',
          {
            code: 'delete',
            show: (row: T) => !isSuperAdmin(row as SystemUserApi.SystemUser),
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: $t('system.user.operation'),
      width: 130,
    },
  ];
}
