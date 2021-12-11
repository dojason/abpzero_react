import { Avatar, Icon, Menu, Spin } from 'antd';
import { ClickParam } from 'antd/es/menu';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import avatar from '@/assets/defaultavatar.svg';
import { ConnectProps, ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';


export interface GlobalHeaderRightProps extends ConnectProps {
  user?: CurrentUser;
  menu?: boolean;
}

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
  onMenuClick = (event: ClickParam) => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;
      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }
      return;
    }
    if (key === 'loginRecent') {
      const { dispatch } = this.props;
      if (dispatch) {
      dispatch!({
        type: 'global/changeRecentUserLoginModalState',
        payload: true,
      })
    }
      return;
    }
    router.push(`/account/${key}`);
  };

  render(): React.ReactNode {
    const { user = { avatar: '', name: '' }, menu } = this.props;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {menu && (
          <Menu.Item key="center">
            <Icon type="user" />
            个人中心
          </Menu.Item>
        )}
        {menu && (
          <Menu.Item key="settings">
            <Icon type="setting" />
            个人设置
          </Menu.Item>
        )}
        {menu && <Menu.Divider />}
        <Menu.Item key="loginRecent">
          <Icon type="logout" />
          登陆记录
        </Menu.Item>
        <Menu.Item key="logout">
          <Icon type="logout" />
          退出登录
        </Menu.Item>
      </Menu>
    );

    return user && user.name ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={avatar} alt="avatar" />
          <span className={styles.name}>{user.name}</span>
        </span>
      </HeaderDropdown>

    ) : (
      <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
    );
  }
}
export default connect(({ global }: ConnectState) => ({
  user: global.user,
}))(AvatarDropdown);
