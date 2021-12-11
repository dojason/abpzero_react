import AppConsts from '@/shared/AppConsts';
import { FormattedStringValueExtracter } from '@/shared/helpers/FormattedStringValueExtracter';

export class SubdomainTenancyNameFinder {
    getCurrentTenancyNameOrNull(rootAddress: string): string|null {
        if (rootAddress.indexOf(AppConsts.tenancyNamePlaceHolderInUrl) < 0) {
            // 网站不支持子域名租户名
            return null;
        }

        const currentRootAddress = document.location.href;

        const formattedStringValueExtracter = new FormattedStringValueExtracter();
        const values: any[] =
         formattedStringValueExtracter.IsMatch(currentRootAddress, rootAddress);
        if (!values.length) {
            return null;
        }

        return values[0];
    }
}
