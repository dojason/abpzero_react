import AppComponentBase from '@/components/AppComponentBase';
import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Table, Row, Col, Form, Select, Button } from 'antd';
import { ConnectState } from '@/models/connect';
import { connect } from 'dva';
import { LanguagesModelState } from '@/models/admin/languages';
import { Dispatch, AnyAction } from 'redux';
import { GetLanguageTextsInput } from '@/services/languages/dtos/getLanguageTextsInput';
import EditLanguageText from './components/editLanguageText';
import * as _ from 'lodash';
import { FormComponentProps } from 'antd/es/form';
import Search from 'antd/lib/input/Search';
import { PaginationConfig } from 'antd/lib/table';

export interface LanguageTextProps extends FormComponentProps {
  dispatch: Dispatch<AnyAction>;
  languages: LanguagesModelState;
  loading: boolean;
}
export interface LanguageTextStates {
  request: GetLanguageTextsInput;
  sourceNames: string[];
  languages: abp.localization.ILanguageInfo[];
  editLanguageTextModalVisible: boolean;
}

const { Option } = Select;
@connect(({ languages }: ConnectState) => ({
  languages,
}))
class LanguageText extends AppComponentBase<LanguageTextProps, LanguageTextStates> {
  modalRef: any = React.createRef();

  state = {
    sourceNames: [],
    languages: abp.localization.languages,
    request: {
      maxResultCount: this.maxResultCount,
      skipCount: this.skipCount,
      sourceName: 'Grace',
      targetLanguageName: '',
      targetValueFilter: 'ALL',
      filterText: '',
      baseLanguageName: abp.localization.currentLanguage.name,
    },
    editLanguageTextModalVisible: false,
  }

  async componentDidMount() {
    const targetLanguageName = window.location.pathname.replace('/admin/languageTexts/', '');
    const sourceNames = _.map(_.filter(abp.localization.sources, source => source.type === 'MultiTenantLocalizationSource'), value => value.name);
    await this.setState(state => ({
      sourceNames,
      request: {
        ...state.request,
        targetLanguageName,
      },
    }))
    this.getTableData();
  }

  getTableData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'languages/getLanguageTexts',
      payload: {
        ...this.state.request,
      },
    })
  }

  handRequestChange = () => {
    const { validateFields } = this.props.form;
    validateFields((errors: any, values: any) => {
      if (!errors) {
        this.setState(state => ({
          request: {
            maxResultCount: state.request.maxResultCount,
            skipCount: state.request.skipCount,
            baseLanguageName: values.baseLanguageName,
            targetLanguageName: values.targetLanguageName,
            sourceName: values.sourceName,
            targetValueFilter: values.targetValueFilter,
            filterText: values.filterText === undefined ? '' : values.filterText,
          },
        }), () => {
          this.getTableData();
        })
      }
    })
  }

  Modal() {
    this.setState(state => ({
      editLanguageTextModalVisible: !state.editLanguageTextModalVisible,
    }))
  }

  modalOpen = (record: any) => {
    const { setFieldsValue } = this.modalRef.current;
    setFieldsValue({
      ...record,
    })
    this.Modal();
  }

  modalCancel = () => {
    this.Modal();
  }

  modalOk = () => {
    const { validateFields } = this.modalRef.current;
    validateFields((errors: any, values: any) => {
      if (!errors) {
        const { dispatch } = this.props;
        dispatch({
          type: 'languages/updateLanguageText',
          payload: {
            key: values.key,
            languageName: this.state.request.targetLanguageName,
            value: values.targetValue,
            sourceName: this.state.request.sourceName,
          },
        })
        this.getTableData();
      }
    });
    this.Modal();
  }

  handleTableChange = (pagination: PaginationConfig) => {
    this.setState(state => ({
      request: {
        ...state.request,
        skipCount: (pagination.current! - 1) * state.request.maxResultCount!,
      },
    }), () => {
      this.getTableData();
    })
  }

  public render() {
    const { getFieldDecorator } = this.props.form;
    const { languages, sourceNames, request, editLanguageTextModalVisible } = this.state;
    const { languageTexts } = this.props.languages;
    const columns: any = [{
      title: '键值',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: '默认值',
      dataIndex: 'baseValue',
      key: 'baseValue',
    },
    {
      title: '目标值',
      dataIndex: 'targetValue',
      key: 'targetValue',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text: any, record: any) => <Button icon="edit" onClick={() => { this.modalOpen(record) }} type="primary">编辑</Button>,
    },
    ];
    return (
      <PageHeaderWrapper
        content="编辑语言的文本头信息."
      >
        <Card>
          <Row gutter={24} type="flex" justify="space-around">

            <Col xs={24} xl={6} xxl={6}>
              <Form.Item label="默认语言">
                {getFieldDecorator('baseLanguageName', {
                  initialValue: abp.localization.currentLanguage.name,
                })(
                  <Select style={{ width: '100%' }} >
                    {languages.map((item: abp.localization.ILanguageInfo) => (
                      <Option value={item.name} key={item.name}>{item.displayName}</Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col xs={24} xl={6} xxl={6}>
              <Form.Item label="目标语言">
                {getFieldDecorator('targetLanguageName', {
                  initialValue: request.targetLanguageName,
                })(
                  <Select style={{ width: '100%' }} >
                    {languages.map((item: abp.localization.ILanguageInfo) => (
                      <Option value={item.name} key={item.name}>{item.displayName}</Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col xs={24} xl={6} xxl={6}>
              <Form.Item label="选择源">
                {getFieldDecorator('sourceName', {
                  initialValue: 'Grace',
                })(
                  <Select style={{ width: '100%' }}>
                    {sourceNames.map((item: string) => (
                      <Option value={item} key={item}>{item}</Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col xs={24} xl={6} xxl={6}>
              <Form.Item label="目标值">
                {getFieldDecorator('targetValueFilter', {
                  initialValue: 'ALL',
                })(
                  <Select style={{ width: '100%' }} >
                    <Option value="ALL">全部</Option>
                    <Option value="EMPTY">空值</Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item >
                {getFieldDecorator('filterText', {
                })(
                  <Search
                    onSearch={this.handRequestChange}
                    placeholder="搜索..."
                    enterButton="刷新"
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Table
            bordered
            onChange={this.handleTableChange}
            dataSource={languageTexts === undefined ? [] : languageTexts.items}
            pagination={{ showTotal: this.showPageTotal,
              pageSize: this.state.request.maxResultCount,
               total: languageTexts === undefined ? 0 : languageTexts.totalCount }}
            columns={columns} />
        </Card>
        <EditLanguageText
          ref={this.modalRef}
          baseValue={languages.filter(t => t.name === request.baseLanguageName)[0].displayName}
          targetValue={request.targetLanguageName === '' ? '' : languages.filter(t => t.name === request.targetLanguageName)[0].displayName}
          onOk={this.modalOk}
          onCancel={this.modalCancel}
          visible={editLanguageTextModalVisible}
          />
      </PageHeaderWrapper>)
  }
}
export default Form.create<LanguageTextProps>()(LanguageText);
