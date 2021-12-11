import * as moment from 'moment';
import { EditionInfoDto } from '../edition/editionInfoDto';
import { PaymentPeriodType, SubscriptionPaymentType } from '../appEnum';

export interface TenantLoginInfoDto {
    tenancyName: string | undefined;
    name: string | undefined;
    logoId: string | undefined;
    logoFileType: string | undefined;
    customCssId: string | undefined;
    subscriptionEndDateUtc: moment.Moment | undefined;
    isInTrialPeriod: boolean | undefined;
    subscriptionPaymentType: SubscriptionPaymentType | undefined;
    edition: EditionInfoDto | undefined;
    creationTime: moment.Moment | undefined;
    paymentPeriodType: PaymentPeriodType | undefined;
    subscriptionDateString: string | undefined;
    creationTimeString: string | undefined;
    id: number | undefined;
}
