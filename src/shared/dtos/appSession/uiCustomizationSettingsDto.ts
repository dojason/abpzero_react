import { ThemeSettingsDto } from '../theme/themeSettingsDto';

export interface UiCustomizationSettingsDto {
    baseSettings: ThemeSettingsDto | undefined;
    isLeftMenuUsed: boolean | undefined;
    isTopMenuUsed: boolean | undefined;
    isTabMenuUsed: boolean | undefined;
    allowMenuScroll: boolean | undefined;
}
