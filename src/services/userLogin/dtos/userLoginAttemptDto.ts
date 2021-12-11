export interface UserLoginAttemptDto{
    tenancyName:string;
    userNameOrEmail:string;
    clientIpAddress:string;
    clientName:string;
    browserInfo:string;
    result:string;
    creationTime:string;
}
