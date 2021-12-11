import { UserLoginInfoDto } from '@/shared/dtos/appSession/userLoginInfoDto';
import { TenantLoginInfoDto } from '@/shared/dtos/appSession/tenantLoginInfoDto';
import { ApplicationInfoDto } from '@/shared/dtos/appSession/applicationInfoDto';
import { UiCustomizationSettingsDto } from '@/shared/dtos/appSession/uiCustomizationSettingsDto';

export interface GetCurrentLoginInformationsOutput {
    user: UserLoginInfoDto | undefined;
    tenant: TenantLoginInfoDto | undefined;
    application: ApplicationInfoDto | undefined;
    theme: UiCustomizationSettingsDto | undefined;
}
