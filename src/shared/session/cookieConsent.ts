import { L } from '@/lib/abpUtility';

export class CookieConsentService {
    public init() {
        if (abp.setting.getBoolean('App.UserManagement.IsCookieConsentEnabled')) {
            (window as any).cookieconsent.initialise({
                showLink: false,
                content: {
                    message: L('CookieConsent_Message'),
                    dismiss: L('CookieConsent_Dismiss'),
                },
            });
        }
    }
}
