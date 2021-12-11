import React from 'react';
import Redirect from 'umi/redirect';
import { connect } from 'dva';
import pathToRegexp from 'path-to-regexp';
import Authorized from '@/utils/Authorized';
import { ConnectProps, ConnectState, Route } from '@/models/connect';
import { UserLoginInfoDto } from '@/shared/dtos/appSession/userLoginInfoDto';

interface AuthComponentProps extends ConnectProps {
  user: UserLoginInfoDto;
}

const getRouteAuthority = (path: string, routeData: Route[]) => {
  let authorities: string[] | string | undefined;
  routeData.forEach(route => {
    // match prefix
    if (pathToRegexp(`${route.path}(.*)`).test(path)) {
      // exact match
      if (route.path === path) {
        authorities = route.authority || authorities;
      }
      // 递归地获取子权限
      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

const AuthComponent: React.FC<AuthComponentProps> = ({
  children,
  route = {
    routes: [],
  },
  location = {
    pathname: '',
  },
  user,
}) => {
  const { routes = [] } = route;
  const isLogin = user && user.id;
  return (
    <Authorized
      authority={getRouteAuthority(location.pathname, routes) || ''}
      noMatch={isLogin ? <Redirect to="/" /> : <Redirect to="/account/login" />}
    >
      {children}
    </Authorized>
  );
};

export default connect(({ global }: ConnectState) => ({
  user: global.user,
}))(AuthComponent);
