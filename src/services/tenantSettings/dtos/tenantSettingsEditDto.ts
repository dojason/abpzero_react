export interface TenantSettingsEditDto{
    general?: GeneralSettingsEditDto;
    userManagement?: TenantUserManagementSettingsEditDto;
    email?: TenantEmailSettingsEditDto;
    ldap?: LdapSettingsEditDto;
    security?: SecuritySettingsEditDto;
}

export interface GeneralSettingsEditDto {
  timezone: string | undefined;
  timezoneForComparison: string | undefined;
}
export interface TenantUserManagementSettingsEditDto {
  allowSelfRegistration: boolean;
  isNewRegisteredUserActiveByDefault: boolean;
  isEmailConfirmationRequiredForLogin: boolean;
  useCaptchaOnRegistration: boolean;
  useCaptchaOnLogin: boolean;
  isCookieConsentEnabled: boolean;
  isQuickThemeSelectEnabled: boolean;
  sessionTimeOutSettings: SessionTimeOutSettingsEditDto;
}
export interface SessionTimeOutSettingsEditDto {
  isEnabled: boolean;
  timeOutSecond: number;
  showTimeOutNotificationSecond: number;
}
export interface TenantEmailSettingsEditDto {
  useHostDefaultEmailSettings: boolean;
  defaultFromAddress: string | undefined;
  defaultFromDisplayName: string | undefined;
  smtpHost: string | undefined;
  smtpPort: number;
  smtpUserName: string | undefined;
  smtpPassword: string | undefined;
  smtpDomain: string | undefined;
  smtpEnableSsl: boolean;
  smtpUseDefaultCredentials: boolean;
}
export interface LdapSettingsEditDto {
  isModuleEnabled: boolean;
  isEnabled: boolean;
  domain: string | undefined;
  userName: string | undefined;
  password: string | undefined;
}

export interface SecuritySettingsEditDto {
  allowOneConcurrentLoginPerUser: boolean;
  useDefaultPasswordComplexitySettings: boolean;
  passwordComplexity: PasswordComplexitySetting;
  defaultPasswordComplexity: PasswordComplexitySetting;
  userLockOut: UserLockOutSettingsEditDto;
  twoFactorLogin: TwoFactorLoginSettingsEditDto;
}
export interface PasswordComplexitySetting {
  requireDigit: boolean;
  requireLowercase: boolean;
  requireNonAlphanumeric: boolean;
  requireUppercase: boolean;
  requiredLength: number;
}
export interface UserLockOutSettingsEditDto {
  isEnabled: boolean;
  maxFailedAccessAttemptsBeforeLockout: number;
  defaultAccountLockoutSeconds: number;
}
export interface TwoFactorLoginSettingsEditDto {
  isEnabledForApplication: boolean;
  isEnabled: boolean;
  isEmailProviderEnabled: boolean;
  isSmsProviderEnabled: boolean;
  isRememberBrowserEnabled: boolean;
  isGoogleAuthenticatorEnabled: boolean;
}
