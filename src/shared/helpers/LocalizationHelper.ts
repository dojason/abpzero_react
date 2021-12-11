import AppConsts from '@/lib/appconst';


export class LocalizationHepler {
  static localizationSourceName = AppConsts.localization.defaultLocalizationSourceName;

  static flattenDeep(array: any[]): any {
    return array.reduce((acc, val) =>
      (Array.isArray(val) ?
        acc.concat(this.flattenDeep(val)) :
        acc.concat(val)),
      []);
  }

  static l(key: string, ...args: any[]): string {
    args.unshift(key);
    args.unshift(this.localizationSourceName);
    return this.ls.apply(this, args);
  }

  static ls(sourcename: string, key: string, ...args: any[]): string {
    let localizedText = abp.localization.localize(key, sourcename);

    if (!localizedText) {
      localizedText = key;
    }

    if (!args || !args.length) {
      return localizedText;
    }

    args.unshift(localizedText);
    return abp.utils.formatString.apply(this, this.flattenDeep(args));
  }
}
