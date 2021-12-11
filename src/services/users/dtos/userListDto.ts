import { UserListRoleDto } from './userListRoleDto';

export interface UserListDto{
    id:number;
    name:string;
    surname:string;
    userName:string;
    emailAddress:string;
    phoneNumber:string;
    profilePictureId?:string;
    isEmailConfirmed:boolean;
    roles:UserListRoleDto[];
    isActive:boolean;
    creationTime:Date;
}
