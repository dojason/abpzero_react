import * as moment from 'moment';

export interface ApplicationInfoDto {
    version: string | undefined;
    releaseDate: moment.Moment | undefined;
    currency: string | undefined;
    currencySign: string | undefined;
    allowTenantsToChangeEmailSettings: boolean | undefined;
    features: { [key: string] : boolean; } | undefined;
}
