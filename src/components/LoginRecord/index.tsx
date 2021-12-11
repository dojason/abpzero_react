import React from 'react';
import { Card, Modal } from 'antd';
import { connect } from 'dva';
import AppComponentBase from '../AppComponentBase';
import { ConnectState } from '@/models/connect';
import { ListResultDto } from '@/shared/dtos/listResultDto';
import { UserLoginAttemptDto } from '@/services/userLogin/dtos/userLoginAttemptDto';

export interface LoginRecordProps{
    visible:boolean;
    onCancel:()=>void;
    userLoginRecords:ListResultDto<UserLoginAttemptDto>
}
class LoginRecord extends AppComponentBase<LoginRecordProps> {
    render() {
        const { visible, onCancel, userLoginRecords } = this.props;
        return (
            <div>
                <Modal width="50%" footer={null} onCancel={onCancel} visible={visible}>
                  {
                    userLoginRecords === undefined ? null : userLoginRecords.items.map(item => {
                       return <Card key={item.creationTime} style={{ border: '1px solid #0abb87', color: '#0abb87', width: '100%', fontSize: 14, marginBottom: 10 }}>
                           <p>{item.clientIpAddress}</p>
                           <p>{item.clientName}</p>
                           <p>{item.creationTime}</p>
                           <p>{item.result}</p>
                           <p>{item.browserInfo}</p>
                        </Card>
                    })
                  }

                </Modal>
            </div>
        )
    }
}
export default connect(({ global }: ConnectState) => ({
    userLoginRecords: global.userLoginRecords,
  }))(LoginRecord);
