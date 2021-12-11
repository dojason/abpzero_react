import EntityDto from '@/shared/dtos/entityDto';

export interface DataDictionaryDto extends EntityDto{
  name:string;
  fullName:string;
  parentId:number;
  isActive:boolean;
  description:string;
  isDefault:boolean;
}
