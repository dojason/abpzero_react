
import moment from 'moment';
import EntityDto from '../../../shared/dtos/entityDto';
import { NotificationData } from './notificationData';

export interface TenantNotification extends EntityDto<string>{
    tenantId: number | undefined;
    notificationName: string | undefined;
    data: NotificationData | undefined;
    entityType: string | undefined;
    entityTypeName: string | undefined;
    entityId: any | undefined;
    severity: NotificationSeverity | undefined;
    creationTime: moment.Moment | undefined;

}
export enum NotificationSeverity {
  Info = 0,
  Success = 1,
  Warn = 2,
  Error = 3,
  Fatal = 4,
}
