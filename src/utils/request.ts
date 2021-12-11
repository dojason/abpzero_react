/* eslint-disable no-param-reassign */
/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import AppConsts from '@/shared/AppConsts';
import { notification } from 'antd';


/**
 * 配置request请求时的默认参数
 */
const request = extend({
  prefix: AppConsts.remoteServiceBaseUrl,
  credentials: 'same-origin', // 默认请求是否带上cookie
});
// request拦截器, 添加token
request.interceptors.request.use((url, options) => {
  const token = abp.auth.getToken();
  const cookieLangValue = abp.utils.getCookieValue('Abp.Localization.CultureName');
  options.headers!['.AspNetCore.Culture'] = (`c= ${cookieLangValue}|uic=${cookieLangValue}`);
  options.headers!['Abp.TenantId'] = abp.multiTenancy.getTenantIdCookie();
  if (token) {
    options = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    }
  }
  return (
    {
      options: { ...options, interceptors: true },
    }
  );
});
// response拦截器, 处理response
request.interceptors.response.use(async response => {
  const { ok } = response;
  if (!ok) {
    const res = await response.clone().json();
    if (res.error) {
      notification.error({
        message: res.error.message,
        description: res.error.details,
      })
      return res;
    }
    return res;
  }

  return response;
});


export default request;
