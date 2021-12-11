import AppComponentBase from '@/components/AppComponentBase';
import React from 'react';
import { Card, Table, Button, Tag, Dropdown, Menu, Icon } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { AnyAction, Dispatch } from 'redux';
import { LanguagesModelState } from '@/models/admin/languages';
import { Link } from 'umi';
import IconFont from '../../../components/Iconfont/index';

export interface LanguagesProps {
  dispatch: Dispatch<AnyAction>;
  languages: LanguagesModelState;
  loading: boolean;
}
export interface LanguagesStates {

}
@connect(({ languages, loading }: ConnectState) => ({
  languages,
  loading: loading.effects['languages/getLanguages'],
}))
class Languages extends AppComponentBase<LanguagesProps, LanguagesStates> {
  componentDidMount() {
    this.getTableData();
  }

  async setDefaultLanguage(languageName: string) {
    const { dispatch } = this.props;
    await dispatch({
      type: 'languages/setDefaultLanguage',
      payload: {
        name: languageName,
      },
    });
    await this.getTableData();
  }

  // 获取表格数据
  getTableData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'languages/getLanguages',
    });
  }

  render() {
    const { loading } = this.props;
    const { languages } = this.props.languages;
    const columns = [
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text: any, record: any) => <div>
            <Dropdown overlay={
              <Menu>
                <Menu.Item>
                  <Link to={`/admin/languageTexts/${record.name}`}>修改文本信息</Link>
                </Menu.Item>
                <Menu.Item onClick={async () => { await this.setDefaultLanguage(record.name) }}>
                  设置为默认语言
              </Menu.Item>
              </Menu>
            } trigger={['click']} placement="bottomLeft">
              <Button icon="setting" type="primary">操作<Icon type="down" /></Button>
            </Dropdown>
          </div>,
      },
      {
        title: '名称',
        dataIndex: 'displayName',
        key: 'displayName',
        render: (text: string, record: any) => <span><IconFont type={record.icon} /> {text}</span>,
      },
      {
        title: '代码',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '默认',
        dataIndex: 'name',
        key: 'isDefault',
        render: (text: string) => (text === languages!.defaultLanguageName ? <Tag color="#1dc9b7">是</Tag> : <Tag color="#282a3c">否</Tag>),
      },
      {
        title: '启用',
        dataIndex: 'isDisabled',
        key: 'isDisabled',
        render: (text: string, record: any) => (!record.isDisabled ? <Tag color="#1dc9b7">是</Tag> : <Tag color="#282a3c">否</Tag>),
      },
      {
        title: '创建时间',
        dataIndex: 'creationTime',
        key: 'creationTime',
        render: (text: string) => <div>{new Date(text).toLocaleDateString()}</div>,
      },
    ];
    return (
      <PageHeaderWrapper >
        <Card>
          <Table
            bordered
            loading={loading}
            rowKey="name"
            dataSource={languages === undefined ? [] : languages.items}
            pagination={false}
            columns={columns} />
        </Card>
      </PageHeaderWrapper>
    )
  }
}
export default Languages;
