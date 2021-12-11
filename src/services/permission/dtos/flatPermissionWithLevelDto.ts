import { FlatPermissionDto } from '@/services/roles/dtos/flatPermissionDto';

export interface FlatPermissionWithLevelDto extends FlatPermissionDto{
  level:number;
}
