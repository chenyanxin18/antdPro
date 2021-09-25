import React, { useRef } from 'react';
import {  Switch } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getSuperviseList } from '@/api/compliance';
import { proTable } from '@/config/proTable';
type Item = {
  number: string; //行号
  repoCode: string; // 仓库代码
  repoName: string; // 仓库名称
  repoType: number; // 仓库类型
  isDisable: number; //状态
  updateUser: string; // 操作人
  updateDatetime: string; // 操作时间
};
const statusMap = new Map([
  [0, { text: '使用中', color: 'green' }],
  [1, { text: '已停用', color: 'gray' }],
]);
const repoTypeMap = new Map([
  [1, { text: '工厂' }],
  [2, { text: 'DC' }],
  [5, { text: '工厂外仓' }],
]);
const List: React.FC = () => {
  const columns: ProColumns<Item>[] = [
    {
      title: '行号',
      dataIndex: 'number',
      hideInSearch: true,
      fixed: 'left',
      align: 'center',
      width: 45,
    },
    {
      title: '仓库代码',
      dataIndex: 'repoCode',
      ellipsis: true,
    },
    {
      title: '仓库名称',
      dataIndex: 'repoName',
      ellipsis: true,
    },
    {
      title: '仓库类型',
      dataIndex: 'repoType',
      ellipsis: true,
      valueEnum: repoTypeMap,
    },
    {
      title: '状态',
      dataIndex: 'isDisable',
      valueType: 'select',
      valueEnum: statusMap,
    },
    {
      title: '操作',
      dataIndex: 'isDisable',
      hideInSearch: true,
      ellipsis: true,
      render: (_, record, index, action) => {
        return <Switch checked={Boolean(!record.isDisable)} />;
      },
    },
    {
      title: '操作人',
      dataIndex: 'updateUser',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '操作时间',
      valueType: 'date',
      dataIndex: 'updateDatetime',
      hideInSearch: true,
      ellipsis: true,
    },
  ];
  const actionRef = useRef<ActionType>();
  return (
    <>
      <ProTable<Item>
        {...proTable}
        columns={columns}
        actionRef={actionRef}
        request={async (params = {}) => {
          return getSuperviseList({
            ...params,
          });
        }}
      />
    </>
  );
};
export default List;
