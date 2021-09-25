import { queryList, IResult, IRes } from './index';
export type ListParams = { [key: string]: any };
export type returnValue = Promise<IResult>;
export interface ResolveData {
  (): void;
}
export interface ResolveDataIRes {
  (): IRes;
}
export interface ResolveDataParams {
  (params: any): void;
}

export const prefix = '/company';
const CHAIN_CONTEXT = '/trace'; // 后台工程上下文
const RESOURCES = {
  GET_WarehouseManagement: CHAIN_CONTEXT + '/repo/queryRepoPage', //基础数据管理/仓库管理列表
};

export const handleRes = (
  res: IRes,
  fn: ResolveData,
  needReturn?: boolean,
  errorFn?: ResolveData,
): void | boolean => {
  if (res.success) {
    fn();
    if (needReturn !== undefined) {
      return needReturn;
    }
  } else {
    if (errorFn) errorFn();
    // $message.error(res.errorMsg);
  }
};
export const handleListData = (
  res: IResult,
  enumList: string[] = [],
  flatParams: Array<string[]> = [],
  number = 'number',
  enumType: 'number' | 'string' = 'string',
): IResult => {
  const { data, size, current, ...other } = res;
  const flag = flatParams.length ? true : false;
  const list = data.map((item, index) => {
    const enumValue = {};
    if (flag) {
      flatParams.forEach((ele) => {
        if (ele.length == 1 && item[ele[0]]) {
          item[ele[0]] = (item[ele[0]] as string[]).join('、');
        } else if (ele.length == 2 && item[ele[0]]) {
          item[ele[0]] = (item[ele[0]] as Record<string, any>[])
            .map((element) => element[ele[1]])
            .join('、');
        }
      });
    }
    enumList.map((enumItem: string) => {
      if (enumType === 'string') {
        enumValue[enumItem] = String(item[enumItem].value);
      } else {
        enumValue[enumItem] = item[enumItem].value;
      }
    });
    if (item.children) {
      if (item.children.length) {
        item.children.map((childrenItem: any, childrenIndex: number) => {
          childrenItem[number] = childrenIndex + 1;
          enumList.map((enumItem: string) => {
            childrenItem[enumItem] = childrenItem[enumItem].value;
          });
        });
      } else {
        item.children = null;
      }
    }
    return {
      [number]: index + 1 + size * (current - 1),
      ...item,
      ...enumValue,
    };
  });
  return {
    data: list,
    current,
    size,
    ...other,
  };
};
export const changeSelectListData = (
  obj: object,
  label: string,
  value: string,
  children?: string,
) => {
  if (children && obj[children]?.length) {
    return {
      value: obj[value],
      label: obj[label],
      children: obj[children].map((i: any) => changeSelectListData(i, label, value, children)),
    };
  }
  return {
    value: obj[value],
    label: obj[label],
  };
};
export const handleSelectList = async (
  serviceFn: any,
  lable: string,
  value: string,
  setOptions: ResolveDataParams,
  otherFn?: ResolveDataParams,
  children?: any,
): Promise<void> => {
  const res = await serviceFn();
  handleRes(res, () => {
    console.log('res', res);
    const list = res.data.map((item: any) => {
      return changeSelectListData(item, lable, value, children);
    });
    setOptions(list);
  });
  if (otherFn) {
    otherFn(res.data);
  }
};
export const getSuperviseList = (params: ListParams): returnValue => {
  console.log('query params =>', params);
  return queryList(RESOURCES.GET_WarehouseManagement, {
    data: params,
  }).then((res) => {
    console.log('lalalalala---', res);
    return handleListData(res);
  });
};
