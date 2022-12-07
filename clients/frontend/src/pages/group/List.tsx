import { RootDispatch, RootState } from '@/store';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Col, Descriptions, List, Row } from 'antd';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Controller } from '../../../../idls/ms_provider';

const GroupList: React.FC = () => {
  const dispatch = useDispatch<RootDispatch>();
  const groups = useSelector((state: RootState) => state.app.groups);

  useEffect(() => {}, []);

  const selectGroup = (group: Controller) => {
    dispatch.app.save({ slideMode: 'wallet' });
    dispatch.app.queryWallets({ contrlCanisterId: group.id.toText() });
  };

  return (
    <PageContainer ghost>
      <Row gutter={24}>
        {groups.map(group => (
          <Col span={8}>
            <Card
              title={group.name}
              bordered={false}
              onClick={() => selectGroup(group)}
            >
              <Descriptions title={group.id.toText()}>
                <Descriptions.Item label="Threshold">
                  {group.threshold_user_amount}/{group.total_user_amount}
                </Descriptions.Item>
              </Descriptions>
              <List
                dataSource={group.users}
                renderItem={user => (
                  <List.Item>
                    <List.Item.Meta
                      title={user[1]}
                      description={user[0].toText()}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </PageContainer>
  );
};

export default GroupList;
