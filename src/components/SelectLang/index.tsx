import { Icon, Menu } from 'antd';
import { ClickParam } from 'antd/es/menu';
import * as _ from 'lodash';
import React from 'react';
import classNames from 'classnames';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import IconFont from '../Iconfont/index';

interface SelectLangProps {
  className?: string;
}
const SelectLang: React.FC<SelectLangProps> = props => {
  const { className } = props;
  const languages = _.filter(abp.localization.languages, l => l.isDisabled === false);
  const changeLang = ({ key }: ClickParam) => {
    abp.utils.setCookieValue(
      'Abp.Localization.CultureName',
      key,
      new Date(new Date().getTime() + 5 * 365 * 86400000), // 5 year
      abp.appPath,
    );
    window.location.reload();
  }
  const langMenu = (
    <Menu className={styles.menu}
    selectedKeys={[abp.localization.currentLanguage.name]} onClick={changeLang}>
      {languages.map(item => (
        <Menu.Item key={item.name}>
          <IconFont type={item.icon} />
          <span role="img" aria-label={item.displayName}>
            {item.name}
          </span>{' '}
          {item.displayName}
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    <HeaderDropdown overlay={langMenu} placement="bottomRight">
      <span className={classNames(styles.dropDown, className)}>
        <Icon type="global" title="语言" />
      </span>
    </HeaderDropdown>
  );
};

export default SelectLang;
