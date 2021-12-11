import AppConsts from './appconst';

declare const abp: any;

export function L(key: string, sourceName?: string): string {
  const localizationSourceName = AppConsts.localization.defaultLocalizationSourceName;
  return abp.localization.localize(key, sourceName || localizationSourceName);
}

export function isGranted(permissionName: string): boolean {
  return abp.auth.isGranted(permissionName);
}
