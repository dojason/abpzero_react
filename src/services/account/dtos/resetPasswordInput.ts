export interface ResetPasswordInput {
    userId: number;
    resetCode: string
    password: string
    returnUrl: string
    singleSignIn: string
    c: string
}
