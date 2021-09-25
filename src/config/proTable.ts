import type { ProTableProps } from '@ant-design/pro-table';

export const proTable: ProTableProps<any, any> = {
  // form: {
  //   size: 'small',
  // },
  search: {
    labelWidth: 'auto',
  },
  bordered: true,
  pagination: { current: 1, pageSize: 10 },
  rowKey: 'number',
  options: { reload: false, setting: false, density: false },
  dateFormatter: 'string',
};

export default proTable;
