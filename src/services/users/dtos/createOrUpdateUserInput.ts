import { UserEditDto } from './userEditDto';

export interface CreateOrUpdateUserInput{
     user:UserEditDto;
     assignedRoleNames:string[];
     sendActivationEmail:boolean;
     setRandomPassword:boolean;
     organizationUnits:number[];
}
