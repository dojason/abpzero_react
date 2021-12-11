import { EntityDto } from '@/shared/dtos/entityDto';

export interface UserEditDto extends EntityDto{
  name: string;
  surname: string;
  userName: string;
  emailAddress: string;
  phoneNumber: string | undefined;
  password: string | undefined;
  isActive: boolean | undefined;
  shouldChangePasswordOnNextLogin: boolean | undefined;
  isTwoFactorEnabled: boolean | undefined;
  isLockoutEnabled: boolean | undefined;
}
