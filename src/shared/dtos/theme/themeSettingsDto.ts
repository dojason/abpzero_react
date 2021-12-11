import { ThemeLayoutSettingsDto } from './themeLayoutSettingsDto';
import { ThemeHeaderSettingsDto } from './themeHeaderSettingsDto';
import { ThemeSubHeaderSettingsDto } from './themeSubHeaderSettingsDto';
import { ThemeMenuSettingsDto } from './themeMenuSettingsDto';
import { ThemeFooterSettingsDto } from './themeFooterSettingsDto';

export interface ThemeSettingsDto {
    theme: string | undefined;
    layout: ThemeLayoutSettingsDto | undefined;
    header: ThemeHeaderSettingsDto | undefined;
    subHeader: ThemeSubHeaderSettingsDto | undefined;
    menu: ThemeMenuSettingsDto | undefined;
    footer: ThemeFooterSettingsDto | undefined;
}
