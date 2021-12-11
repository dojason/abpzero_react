import dva from 'dva';
import { Component } from 'react';
import createLoading from 'dva-loading';
import history from '@tmp/history';

let app = null;

export function _onCreate() {
  const plugins = require('umi/_runtimePlugin');
  const runtimeDva = plugins.mergeConfig('dva');
  app = dva({
    history,
    
    ...(runtimeDva.config || {}),
    ...(window.g_useSSR ? { initialState: window.g_initialData } : {}),
  });
  
  app.use(createLoading());
  (runtimeDva.plugins || []).forEach(plugin => {
    app.use(plugin);
  });
  
  app.model({ namespace: 'account', ...(require('D:/ABPZERO/aspnet-zero-core-rel-10.3/react/src/models/account.ts').default) });
app.model({ namespace: 'auditLogs', ...(require('D:/ABPZERO/aspnet-zero-core-rel-10.3/react/src/models/admin/auditLogs.ts').default) });
app.model({ namespace: 'dataDicationary', ...(require('D:/ABPZERO/aspnet-zero-core-rel-10.3/react/src/models/admin/dataDicationary.ts').default) });
app.model({ namespace: 'languages', ...(require('D:/ABPZERO/aspnet-zero-core-rel-10.3/react/src/models/admin/languages.ts').default) });
app.model({ namespace: 'organizationUnits', ...(require('D:/ABPZERO/aspnet-zero-core-rel-10.3/react/src/models/admin/organizationUnits.ts').default) });
app.model({ namespace: 'roles', ...(require('D:/ABPZERO/aspnet-zero-core-rel-10.3/react/src/models/admin/roles.ts').default) });
app.model({ namespace: 'settings', ...(require('D:/ABPZERO/aspnet-zero-core-rel-10.3/react/src/models/admin/settings.ts').default) });
app.model({ namespace: 'users', ...(require('D:/ABPZERO/aspnet-zero-core-rel-10.3/react/src/models/admin/users.ts').default) });
app.model({ namespace: 'global', ...(require('D:/ABPZERO/aspnet-zero-core-rel-10.3/react/src/models/global.ts').default) });
app.model({ namespace: 'login', ...(require('D:/ABPZERO/aspnet-zero-core-rel-10.3/react/src/models/login.ts').default) });
app.model({ namespace: 'notification', ...(require('D:/ABPZERO/aspnet-zero-core-rel-10.3/react/src/models/notification.ts').default) });
app.model({ namespace: 'organizationUnitTree', ...(require('D:/ABPZERO/aspnet-zero-core-rel-10.3/react/src/models/organizationUnitTree.ts').default) });
app.model({ namespace: 'permission', ...(require('D:/ABPZERO/aspnet-zero-core-rel-10.3/react/src/models/permission.ts').default) });
app.model({ namespace: 'profile', ...(require('D:/ABPZERO/aspnet-zero-core-rel-10.3/react/src/models/profile.ts').default) });
app.model({ namespace: 'setting', ...(require('D:/ABPZERO/aspnet-zero-core-rel-10.3/react/src/models/setting.ts').default) });
app.model({ namespace: 'user', ...(require('D:/ABPZERO/aspnet-zero-core-rel-10.3/react/src/models/user.ts').default) });
  return app;
}

export function getApp() {
  return app;
}

export class _DvaContainer extends Component {
  render() {
    const app = getApp();
    app.router(() => this.props.children);
    return app.start()();
  }
}
