export interface AuthenticateModel{
    userNameOrEmailAddress:string;
    password:string;
    twoFactorVerificationCode:string;
    rememberClient:boolean;
    twoFactorRememberClientToken:string;
    singleSignIn:boolean;
    returnUrl:string;
}
