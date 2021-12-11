import { DefaultFooter, MenuDataItem, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import DocumentTitle from 'react-document-title';
import Link from 'umi/link';
import React from 'react';
import { connect } from 'dva';
import { Spin, Icon } from 'antd';
import SelectLang from '@/components/SelectLang';
import { ConnectProps, ConnectState } from '@/models/connect';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';
import AppComponentBase from '@/components/AppComponentBase';

export interface UserLayoutProps extends ConnectProps {
  isInitAbp:boolean
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
}

class UserLayout extends AppComponentBase<UserLayoutProps> {
  componentWillMount() {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'global/initAbp',
      });
      dispatch({
        type: 'global/getApplicationSession',
      });
    }
  }

  render() {
    const { isInitAbp } = this.props
    const {
      route = {
        routes: [],
      },
    } = this.props;
    const { routes = [] } = route;
    const {
      children,
      location = {
        pathname: '',
      },
    } = this.props;
    const loadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
    const { breadcrumb } = getMenuData(routes);
    return (
      <DocumentTitle
        title={getPageTitle({
          pathname: location.pathname,
          breadcrumb,
          ...this.props,
        })}
      >
        <div className={styles.container}>
          <div className={styles.lang}>
            <SelectLang />
          </div>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src={logo} />
                  <span className={styles.title}>Ant Design</span>
                </Link>
              </div>
              <div className={styles.desc}>Ant Design 是西湖区最具影响力的 Web 设计规范</div>
            </div>
            {isInitAbp ? children : <div style={{ textAlign: 'center' }} ><Spin indicator={loadingIcon} /></div>}
          </div>
          <DefaultFooter />
        </div>
      </DocumentTitle>
    );
  }
}
export default connect(({ settings, global }: ConnectState) =>
 ({ isInitAbp: global.isInitAbp, ...settings }))(UserLayout);
