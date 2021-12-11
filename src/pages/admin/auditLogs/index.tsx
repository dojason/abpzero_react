import AppComponentBase from '@/components/AppComponentBase';
import React, { Fragment } from 'react';
import { Card, Table, Button, Icon, Tabs, Form, DatePicker, Row, Col, Input, InputNumber, Select } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { AnyAction, Dispatch } from 'redux';
import { AuditLogsModelState } from '@/models/admin/auditLogs';
import { GetAuditLogsInput } from '@/services/auditLog/dtos/getAuditLogsInput';
import moment, { Moment } from 'moment';
import { PaginationConfig } from 'antd/lib/table';
import AuditLogsDetail from './components/auditLogsDetail';
import { AuditLogListDto } from '@/services/auditLog/dtos/auditLogListDto';
import { GetEntityChangeInput } from '../../../services/auditLog/dtos/getEntityChangeInput';
import EntityChangeDetail from './components/entityChangeDetail';
import { EntityChangeListDto } from '@/services/auditLog/dtos/entityChangeListDto';
import { FormComponentProps } from 'antd/es/form';

const { RangePicker } = DatePicker;
const { Option } = Select;
export interface AuditLogsProps extends FormComponentProps {
  dispatch: Dispatch<AnyAction>;
  auditLogs: AuditLogsModelState;
  historyloading: boolean;
  changeloading: boolean;
}
export interface AuditLogsStates {
  auditLogrequest: GetAuditLogsInput;
  entityChangeRequest: GetEntityChangeInput;
  auditLogItem?: AuditLogListDto;
  auditLogsDetailVisible: boolean;
  entityChangeItem?: EntityChangeListDto;
  entityChangeDetailVisible: boolean;
  auditFormIsOpen: boolean;
}
@connect(({ auditLogs, loading }: ConnectState) => ({
  auditLogs,
  historyloading: loading.effects['auditLogs/getAuditLogs'],
  changeloading: loading.effects['auditLogs/getEntityChanges'],
}))
class AuditLogs extends AppComponentBase<AuditLogsProps, AuditLogsStates> {

  state = {
    auditFormIsOpen: false,
    auditLogrequest: {
      startDate: moment().startOf('day').toISOString(),
      endDate: moment().endOf('day').toISOString(),
      userName: '',
      serviceName: '',
      methodName: '',
      browserInfo: '',
      maxResultCount: this.maxResultCount,
      skipCount: this.skipCount,
    },
    entityChangeRequest: {
      startDate: moment().startOf('day').toISOString(),
      endDate: moment().endOf('day').toISOString(),
      userName: '',
      maxResultCount: this.maxResultCount,
      skipCount: this.skipCount,
    },
    entityChangeItem: undefined,
    entityChangeDetailVisible: false,
    auditLogItem: undefined,
    auditLogsDetailVisible: false,
  }

  auditLogsHandleTableChange = (pagination: PaginationConfig) => {
    this.setState(state => ({
      auditLogrequest: {
        ...state.auditLogrequest,
        skipCount: (pagination.current! - 1) * state.auditLogrequest.maxResultCount!,
      },
    }), () => {
      this.getAuditLogTableData();
    })
  }

  entityChangeHandleTableChange = (pagination: PaginationConfig) => {
    this.setState(state => ({
      entityChangeRequest: {
        ...state.entityChangeRequest,
        skipCount: (pagination.current! - 1) * state.entityChangeRequest.maxResultCount!,
      },
    }), () => {
      this.getAuditLogTableData();
    })
  }

  async auditLogsDetailModalOpen(item: AuditLogListDto) {
    this.setState({
      auditLogItem: item,
    }, () => {
      this.auditLogsDetailModal();
    })
  }

  async entityChangeDetailModalOpen(entityChangeItem: EntityChangeListDto) {
    const { dispatch } = this.props;
    this.setState({
      entityChangeItem,
    })
    dispatch({
      type: 'auditLogs/getEntityPropertyChanges',
      payload: entityChangeItem.id,
    })
    this.entityChangeDetailModal();
  }

  entityChangeDetailModal = () => {
    this.setState(state => ({
      entityChangeDetailVisible: state.entityChangeDetailVisible,
    }))
  }

  auditLogsDetailModal = () => {
    this.setState(state => ({
      auditLogsDetailVisible: state.auditLogsDetailVisible,
    }))
  }

  anditlogExportHandler = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'auditLogs/getAuditLogsToExcel',
      payload: this.state.auditLogrequest,
    })
  }

  anditlogReloadHandler = () => {
    const { form } = this.props;
    form.validateFields((errors: any, values: any) => {
      if (!errors) {
        this.setState(state => ({
          auditLogrequest: {
            ...state.auditLogrequest,
            startDate: (values.dateRange[0] as Moment).format('YYYY-MM-DD 00:00:00'),
            endDate: (values.dateRange[1] as Moment).format('YYYY-MM-DD 23:59:59'),
            userName: values.userName,
            serviceName: values.serviceName,
            methodName: values.methodName,
            browserInfo: values.browserInfo,
            hasException: values.hasException,
          },
        }), () => {
          this.getAuditLogTableData();
        })
      }
    })
  }

  componentDidMount() {
    this.getAuditLogTableData();
  }

  entitychangeReloadHandler = () => {
    const { form } = this.props;
    form.validateFields((errors: any, values: any) => {
      if (!errors) {
        this.setState(state => ({
          entityChangeRequest: {
            ...state.entityChangeRequest,
            startDate: (values.entityChangeDateRange[0] as Moment).format('YYYY-MM-DD 00:00:00'),
            endDate: (values.entityChangeDateRange[1] as Moment).format('YYYY-MM-DD 23:59:59'),
            userName: values.entityChangeUserName,
            entityTypeFullName: '',
          },
        }), () => {
          this.getEntityChangeTableData();
        })
      }
    })
  }

  entitychangeExportHandler = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'auditLogs/getEntityChangesToExcel',
      payload: this.state.auditLogrequest,
    })
  }

  // 获取审计日志表格数据
  async getAuditLogTableData() {
    const { dispatch } = this.props;
    await dispatch({
      type: 'auditLogs/getAuditLogs',
      payload: this.state.auditLogrequest,
    });
  }

  // 获取实体历史表格数据
  async getEntityChangeTableData() {
    const { dispatch } = this.props;
    await dispatch({
      type: 'auditLogs/getEntityChanges',
      payload: this.state.entityChangeRequest,
    });
  }

  auditFormOpenOrClose = () => {
    this.setState(state => ({
      auditFormIsOpen: !state.auditFormIsOpen,
    }))
  }

  tabsChange = async (activeKey: string) => {
    if (activeKey === 'auditlog') {
      await this.getAuditLogTableData();
    } else if (activeKey === 'entityChange') {
      await this.getEntityChangeTableData();
    }
  }

  render() {
    const { auditFormIsOpen } = this.state;
    const { getFieldDecorator } = this.props.form
    const dateFormat = 'YYYY/MM/DD';
    const { historyloading, changeloading } = this.props;
    const { auditLogs, entityPropertyChanges, entityChanges } = this.props.auditLogs;
    const {
      entityChangeDetailVisible, auditLogsDetailVisible, auditLogItem, entityChangeItem,
    } = this.state;
    const entityChangeFormRender = () => (
      <Fragment>
        <Row >
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button onClick={this.entitychangeExportHandler} icon="export" >导出到excel</Button>
            <Button onClick={this.entitychangeReloadHandler} icon="reload" type="primary" style={{ marginLeft: '5px' }}>刷新</Button>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="日期范围">
              {
                getFieldDecorator('entityChangeDateRange', {
                  initialValue: [moment(), moment()],
                })(
                  <RangePicker
                    style={{ width: '100%' }}
                    format={dateFormat}
                  />,
                )
              }
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="用户名">
              {
                getFieldDecorator('entityChangeUserName', {})(
                  <Input
                  />,
                )
              }
            </Form.Item>
          </Col>
        </Row>
      </Fragment>
    )
    const auditFormRender = () => {
      const triggerIconType = auditFormIsOpen ? 'caret-up' : 'caret-down'
      const triggerText = auditFormIsOpen ? '隐藏高级过滤' : '显示高级过滤'
      const trigger = () =>
        <a onClick={this.auditFormOpenOrClose}><Icon type={triggerIconType} />{triggerText}</a>
      return (
        <Fragment>
          <Row >
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button onClick={this.anditlogExportHandler} icon="export" >导出到excel</Button>
              <Button onClick={this.anditlogReloadHandler} icon="reload" type="primary" style={{ marginLeft: '5px' }}>刷新</Button>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xl={12}>
              <Form.Item label="日期范围">
                {
                  getFieldDecorator('dateRange', {
                    initialValue: [moment(), moment()],
                  })(
                    <RangePicker
                      style={{ width: '100%' }}
                      format={dateFormat}
                    />,
                  )
                }
              </Form.Item>
            </Col>
            <Col xl={12}>
              <Form.Item label="用户名">
                {
                  getFieldDecorator('userName', {})(
                    <Input
                    />,
                  )
                }
              </Form.Item>
            </Col>
          </Row>
          {
            auditFormIsOpen ? (
              <Fragment>
                <Row gutter={24}>
                  <Col xl={12}>
                    <Form.Item label="服务">
                      {
                        getFieldDecorator('serviceName', {})(
                          <Input />)
                      }
                    </Form.Item>
                  </Col>
                  <Col xl={12}>
                    <Form.Item label="持续时间" style={{ marginBottom: 0 }}>
                      <Form.Item
                        style={{ display: 'inline-block' }}
                      >
                        {
                          getFieldDecorator('minExecutionDuration', {})(
                            <InputNumber min={0} max={1000000} step={1} />,
                          )
                        }
                      </Form.Item>
                      <span style={{ marginRight: '5px', marginLeft: '5px', display: 'inline-block', width: '24px', textAlign: 'center' }}>------</span>
                      <Form.Item style={{ display: 'inline-block' }}>
                        {
                          getFieldDecorator('maxExecutionDuration', {})(
                            <InputNumber min={0} max={1000000} step={1} />,
                          )
                        }
                      </Form.Item>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item label="操作">
                      {
                        getFieldDecorator('methodName', {})(
                          <Input
                          />,
                        )
                      }
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="错误状态">
                      {
                        getFieldDecorator('hasException', {})(
                          <Select className="selectWidth">
                            <Option value="">全部</Option>
                            <Option value="false">成功</Option>
                            <Option value="true">异常</Option>
                          </Select>,
                        )
                      }
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item label="浏览器">
                      {
                        getFieldDecorator('browserInfo', {})(
                          <Input
                          />,
                        )
                      }
                    </Form.Item>
                  </Col>
                </Row>
              </Fragment>
            ) : null
          }
          {trigger()}
        </Fragment>
      )
    };
    const entityChangeColumns = [
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text: any, record: any) => <Button onClick={async () => { await this.entityChangeDetailModalOpen(record) }} icon="search" type="primary"></Button>,
      },
      {
        title: '对象',
        dataIndex: 'entityTypeFullName',
        key: 'entityTypeFullName',
      },
      {
        title: '用户名',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '修改时间',
        dataIndex: 'changeTime',
        key: 'changeTime',
      },
    ]
    const historyColumns = [
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text: any, record: any) => <Button onClick={async () => { await this.auditLogsDetailModalOpen(record) }} icon="search" type="primary"></Button>,
      },
      {
        title: '',
        dataIndex: 'exception',
        width: '50px',
        key: 'exception',
        render: (text: any) => ((text === null && text === '') ? null : <div>    <Icon type="check-circle" theme="twoTone" twoToneColor="#1dc9b7" />
          </div>),
      },
      {
        title: '用户名',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '服务',
        dataIndex: 'serviceName',
        key: 'serviceName',
      },
      {
        title: '操作',
        dataIndex: 'methodName',
        key: 'methodName',
      },
      {
        title: '持续时间',
        dataIndex: 'executionDuration',
        key: 'executionDuration',
      },
      {
        title: 'IP地址',
        dataIndex: 'clientIpAddress',
        key: 'clientIpAddress',
      },
      {
        title: '客户端',
        dataIndex: 'clientName',
        key: 'clientName',
      },
    ];

    return (
      <PageHeaderWrapper>
        <Card>
          <Tabs defaultActiveKey="auditlog" onChange={this.tabsChange}>
            <Tabs.TabPane key="auditlog" tab="审计日志">
              {auditFormRender()}
              <Table
                loading={historyloading}
                rowKey="id"
                onChange={this.auditLogsHandleTableChange}
                dataSource={auditLogs === undefined ? [] : auditLogs.items}
                pagination={
                  {
                    showTotal: this.showPageTotal,
                    pageSize: this.state.auditLogrequest.maxResultCount,
                    total: auditLogs === undefined ? 0 : auditLogs.totalCount,
                  }}
                columns={historyColumns} />
            </Tabs.TabPane>
            <Tabs.TabPane key="entityChange" tab="更改日志">
              {entityChangeFormRender()}
              <Table
                loading={changeloading}
                rowKey="id"
                onChange={this.entityChangeHandleTableChange}
                dataSource={entityChanges === undefined ? [] : entityChanges.items}
                pagination={{
                  showTotal: this.showPageTotal,
                  pageSize: this.state.entityChangeRequest.maxResultCount,
                  total: entityChanges === undefined ? 0 : entityChanges.totalCount,
                }}
                columns={entityChangeColumns} />
            </Tabs.TabPane>
          </Tabs>
        </Card>
        <EntityChangeDetail
          entityChangeItem={entityChangeItem!}
          entityPropertyChanges={entityPropertyChanges}
          visible={entityChangeDetailVisible}
          onCancel={this.entityChangeDetailModal}
        />
        <AuditLogsDetail
          auditLogItem={auditLogItem}
          onCancel={this.auditLogsDetailModal}
          visible={auditLogsDetailVisible} />
      </PageHeaderWrapper>
    )
  }
}
export default Form.create<AuditLogsProps>()(AuditLogs);
