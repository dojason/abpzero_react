import { List, Avatar, Typography } from 'antd';
import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import styles from './NoticeList.less';
import read from '@/assets/read.svg';
import unread from '@/assets/unread.svg';
import { FormattedUserNotification } from '@/services/notification/dtos/userNotification';

const { Paragraph } = Typography;
export interface NoticeIconTabProps {
  count?: number;
  name?: string;
  showClear?: boolean;
  showViewMore?: boolean;
  style?: React.CSSProperties;
  title: string;
  tabKey: string;
  data?: FormattedUserNotification[];
  onClick?: (item: FormattedUserNotification) => void;
  onClear?: () => void;
  emptyText?: string;
  clearText?: string;
  viewMoreText?: string;
  list?: FormattedUserNotification[];
  onViewMore?: (e: any) => void;
}
const NoticeList: React.SFC<NoticeIconTabProps> = ({
  data = [],
  onClick,
  onClear,
  onViewMore,
  emptyText,
  showClear = true,
  clearText,
  viewMoreText,
  showViewMore = false,
}) => {
  if (data.length === 0) {
    return (
      <div className={styles.notFound}>
        <div>{emptyText}</div>
      </div>
    );
  }
  return (
    <div>
      <List<FormattedUserNotification>
        className={styles.list}
        dataSource={data}
        renderItem={(item, i) => {
          const itemCls = classNames(styles.item, {
            [styles.read]: !item.isUnread,
          });
         const leftIcon = item.isUnread ? <Avatar src={unread}/> : <Avatar src={read}/>
          return (
            <List.Item
              className={itemCls}
              key={item.userNotificationId || i}
              onClick={() => onClick && onClick(item)}
            >
              <List.Item.Meta
                className={styles.meta}
                avatar={leftIcon}
                title={
                  <div className={styles.title}>
                  <Paragraph ellipsis={{
                    rows: 1 }}>{moment(item.creationTime).fromNow()}</Paragraph>
                    <div className={styles.extra}>{item.state === 'UNREAD' ? '未读' : '已读'}</div>
                  </div>
                }
                description={
                  <div>
                    <div className={styles.description}>{item.text}</div>
                    <div className={styles.datetime}>{item.creationTime}</div>
                  </div>
                }
              />
            </List.Item>
          );
        }}
      />
      <div className={styles.bottomBar}>
        {showClear ? (
          <div onClick={onClear}>
            {clearText}
          </div>
        ) : null}
        {showViewMore ? (
          <div
            onClick={e => {
              if (onViewMore) {
                onViewMore(e);
              }
            }}
          >
            {viewMoreText}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default NoticeList;
