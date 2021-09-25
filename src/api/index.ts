import axios, { AxiosRequestConfig } from 'axios';
import querystring from 'query-string';
import { HttpMethods, OPtions } from './typings';
// import config from '@/config'
import { message } from 'antd';

const baseConfig: AxiosRequestConfig = {
  // baseURL: config.domain,
  headers: {
    token: sessionStorage.getItem('token') || '',
    menuId: sessionStorage.getItem('menu') || '',
  },
  timeout: 60000,
};

const service = axios.create(baseConfig);

//定义全局变量，防止多次请求弹出多次重复提示
let isFirstRequest = true;

// Add a request interceptor
service.interceptors.request.use(
  function (configs) {
    configs.headers.menuId = sessionStorage.getItem('menu') || '';

    // Do something before request is sent
    // console.log('intercepter request', config)
    return configs;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
service.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (!response.data.success && response.data.errorMsg == '会话过期，请重新登录') {
      // location.replace(location.pathname + '#/account/login')
      return response;
    }
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.message == 'Request failed with status code 401') {
      if (isFirstRequest) {
        message.error('会话过期，请重新登录');
        isFirstRequest = false;
      }

      // location.replace(location.pathname + '#/account/login')
    }
    return Promise.reject(error);
  },
);

/**
 *
 * @param type
 */
function contentType(type: string) {
  switch (type) {
    case 'form':
      return { 'Content-Type': 'application/x-www-form-urlencoded;chart-set=utf-8' };
    case 'json':
      return { 'Content-Type': 'application/json;chart-set=utf-8' };
    default:
      return { 'Content-Type': 'application/json;chart-set=utf-8' };
  }
}

function request(method: HttpMethods, url: string, options: OPtions) {
  options.headers = { token: sessionStorage.getItem('token') || '' };

  const defered = service({
    method,
    url,
    data: options.type === 'form' ? querystring.stringify(options.data) : options.data,
    params: options.params,
    headers: {
      ...options.headers,
      ...contentType(options.type),
    },
  });
  return defered;
}

export interface IResult {
  data: Array<any>;
  total: number;
  success: boolean;
  current: number;
  size: number;

  [key: string]: any;
}

export type IResPromise = Promise<{
  data: any;
  success: boolean;
  errorMsg: string;
  errorCode: string;
}>;

export interface IRes {
  data: any;
  success: boolean;
  errorMsg: string;
  errorCode: string;
}

export interface IQueryOptions {
  current?: number;
  pageSize?: number;

  [key: string]: any;
}

// 查询列表
export function queryList(url: string, options: OPtions, obj: string[] = []): Promise<IResult> {
  return request('POST', url, options).then((response) => {
    const { data } = response;
    console.log('data---', data);
    const other = {};
    if (obj.length) {
      obj.forEach((item) => {
        other[item] = data.data[item];
      });
    }
    console.log('return', {
      data: data.data.data,
      total: data.data.totalElements,
      success: data.success,
      current: data.data.currentPage,
      size: data.data.pageSize,
      ...other,
    });
    return {
      data: data.data.data,
      total: data.data.totalElements,
      success: data.success,
      current: data.data.currentPage,
      size: data.data.pageSize,
      ...other,
    };
  });
}

/**
 * get 请求
 * @param url
 * @param params
 * @param options
 */
const get = (url: string, params = {}, options = {}): IResPromise => {
  return new Promise((resolve, reject) => {
    request('GET', url, {
      ...options,
      params,
    })
      .then((response) => response.data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err.response);
      });
  });
};

/**
 * delete 请求
 * @param url
 * @param params
 * @param options
 */
const deleteRequest = (url: string, params = {}, options = {}): IResPromise => {
  return new Promise((resolve, reject) => {
    request('DELETE', url, {
      ...options,
      params,
    })
      .then((response) => response.data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err.response);
      });
  });
};
/**
 * delete 请求
 * @param url
 * @param params
 * @param options
 */
const deleteInBody = (url: string, data = {}, options = {}): IResPromise => {
  return new Promise((resolve, reject) => {
    request('DELETE', url, {
      ...options,
      data,
    })
      .then((response) => response.data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err.response);
      });
  });
};

/**
 * put 请求
 * @param url
 * @param params
 * @param options
 */
const put = (url: string, data = {}, options = {}): IResPromise => {
  return new Promise((resolve, reject) => {
    request('PUT', url, {
      ...options,
      data,
    })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err.response);
      });
  });
};

const getOnly = (url: string, params = {}, options = {}): IResPromise => {
  return new Promise((resolve, reject) => {
    request('GET', url, {
      ...options,
      params,
    })
      // .then(response => response)
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err.response);
      });
  });
};

// post 方式
/**
 * post 请求
 * @param url
 * @param data
 * @param options
 */
const post = (url: string, data = {}, options = {}): IResPromise => {
  return new Promise((resolve, reject) => {
    request('POST', url, {
      ...options,
      data,
    })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err.response);
      });
  });
};

// post 方式

/**
 * post 请求
 * @param url
 * @param data
 * @param options
 */
const postInBody = (url: string, data = {}, options = {}): IResPromise => {
  return new Promise((resolve, reject) => {
    request('POST', url, {
      ...options,
      data,
    })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err.response);
      });
  });
};

/**
 * post 请求
 * @param url
 * @param data
 * @param options
 */
const postInParam = (url: string, params = {}, options = {}): IResPromise => {
  return new Promise((resolve, reject) => {
    request('POST', url, {
      ...options,
      params,
    })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err.response);
      });
  });
};

export default {
  get,
  put,
  getOnly,
  post,
  postInParam,
  postInBody,
  deleteRequest,
  deleteInBody,
};
