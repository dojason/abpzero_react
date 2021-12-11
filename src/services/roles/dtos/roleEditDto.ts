import EntityDto from '@/shared/dtos/entityDto';

export interface RoleEditDto extends EntityDto{
  displayName:string;
  isDefault:boolean;
}
