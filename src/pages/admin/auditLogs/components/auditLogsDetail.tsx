
import React, { Fragment } from 'react';
import {
 Modal, Button, Descriptions, Icon,
} from 'antd';
import { AuditLogListDto } from '@/services/auditLog/dtos/auditLogListDto';
import AppComponentBase from '@/components/AppComponentBase';

export interface IAuditLogsDetailProps {
  visible: boolean;
  onCancel: () => void;
  auditLogItem?: AuditLogListDto;
}
class AuditLogsDetail extends AppComponentBase<IAuditLogsDetailProps> {
  render() {
    const { visible, onCancel, auditLogItem } = this.props;
    return (
      <Modal

        onCancel={onCancel}
        footer={<Button onClick={onCancel} >取消</Button>}
        title="审计日志详情"
        visible={visible}>
        {
          auditLogItem === undefined ? null : (<Fragment>
            <Descriptions title="用户信息">

              <Descriptions.Item label="用户名">{auditLogItem.userName}</Descriptions.Item>
              <Descriptions.Item label="IP地址">{auditLogItem.clientIpAddress}</Descriptions.Item>
              <Descriptions.Item label="客户端">{auditLogItem.clientName}</Descriptions.Item>
              <Descriptions.Item label="浏览器">{auditLogItem.browserInfo}</Descriptions.Item>
            </Descriptions>
            <br />
            <br />
            <Descriptions title="操作信息">
              <Descriptions.Item label="服务">{auditLogItem.serviceName}</Descriptions.Item>
              <Descriptions.Item label="方法">{auditLogItem.methodName}</Descriptions.Item>
              <Descriptions.Item label="操作时间">{auditLogItem.executionTime}</Descriptions.Item>
              <Descriptions.Item label="参数">{auditLogItem.parameters}</Descriptions.Item>

            </Descriptions>
            <br />
            <br />
            <Descriptions title="其他">
              <Descriptions.Item label="自定义数据">{auditLogItem.customData === null ? '无' : auditLogItem.customData}</Descriptions.Item>
              <Descriptions.Item label="错误状态">{auditLogItem.exception == null ? (<Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
              ) : null}</Descriptions.Item>
            </Descriptions>
          </Fragment>
          )
        }


      </Modal>
    )
  }
}
export default AuditLogsDetail;
