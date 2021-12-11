import AppConsts from '@/lib/appconst';


export class SignalRHelper {
  static initSignalR(callback: () => void): void {
    const encryptedAuthToken =
    abp.utils.getCookieValue(AppConsts.authorization.encrptedAuthTokenName);
    abp.signalr = {
      autoConnect: false, // _zone.runOutsideAngular in ChatSignalrService
      // autoReconnect: true,
      connect: undefined,
      hubs: undefined,
      qs: `${AppConsts.authorization.encrptedAuthTokenName}=${encodeURIComponent(encryptedAuthToken)}`,
      remoteServiceBaseUrl: AppConsts.remoteServiceBaseUrl!,
      startConnection: undefined,
      url: 'signalr',
    };

    const script = document.createElement('script');
    script.onload = () => {
      callback();
    };
    script.type = 'text/javascript';
    script.src = `${AppConsts.appBaseUrl}/dist/abp.signalr-client.js`;
    document.head.appendChild(script);
  }
}
