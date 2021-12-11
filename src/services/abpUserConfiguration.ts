import request from '@/utils/request';

export async function getAll(): Promise<any> {
    const cookieLangValue = abp.utils.getCookieValue('Abp.Localization.CultureName');
    const requestHeaders = {
        '.AspNetCore.Culture': (`c=${cookieLangValue}|uic=${cookieLangValue}`),
        'Abp.TenantId': `${abp.multiTenancy.getTenantIdCookie()}`,
    };
    return request('AbpUserConfiguration/GetAll', {
        method: 'GET',
        headers: requestHeaders,
    })
  }
