import EntityDto from '../../../shared/dtos/entityDto';

export interface EntityPropertyChangeDto extends EntityDto{
  entityChangeId:number;
  newValue:string;
  originalValue:string;
  propertyName:string;
  propertyTypeFullName:string;
  tenantId:number;
}
