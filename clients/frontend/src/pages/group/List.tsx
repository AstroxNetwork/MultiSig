import {RootDispatch, RootState} from '@/store';
import {getActor} from '@/utils';
import {PageContainer} from '@ant-design/pro-components';
import {useConnect} from '@connect2ic/react';
import {Button, Card, Col, Descriptions, List, Row} from 'antd';
import {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Controller} from '../../../../idls/ms_provider';
import {idlFactory as controllerIdl} from '@/../../idls/ms_controller.idl';
import {useHistory} from 'react-router-dom';

const GroupList: React.FC = () => {
  const dispatch = useDispatch<RootDispatch>();
  const history = useHistory();
  const groups = useSelector((state: RootState) => state.app.groups);
  const {activeProvider} = useConnect();

  useEffect(() => {
  }, []);

  const selectGroup = async (group: Controller) => {
    const controllerActor = await getActor(
      activeProvider!,
      group!.id.toText(),
      controllerIdl,
    );
    dispatch.controller.save({
      activeController: group,
      activeControllerActor: controllerActor,
    });
    // dispatch.app.queryWallets({ contrlCanisterId: group.id.toText() });
    dispatch.app.save({slideMode: 'wallet'});
    history.push('/wallet/assets');
  };

  const settingGroup = async (group: Controller) => {
    const controllerActor = await getActor(
      activeProvider!,
      group!.id.toText(),
      controllerIdl,
    );
    dispatch.controller.save({
      activeController: group,
      activeControllerActor: controllerActor,
    });
    history.push('/group/setting');
  };

  return (
    <PageContainer ghost>
      <Row gutter={24}>
        {groups.map(group => (
          <Col span={12} style={{marginBottom: 20}}>
            <Card
              title={group.name}
              bordered={false}
              extra={
                <a
                  onClick={e => {
                    e.stopPropagation();
                    settingGroup(group);
                  }}
                >
                  Setting
                </a>
              }
              onClick={() => selectGroup(group)}
            >
              <Descriptions title={group.id.toText()}>
                <Descriptions.Item label="Threshold">
                  {group.threshold_user_amount}/{group.total_user_amount}
                </Descriptions.Item>
              </Descriptions>
              {/* <List
                dataSource={group.users}
                renderItem={user => (
                  <List.Item>
                    <List.Item.Meta
                      title={user[1]}
                      description={user[0].toText()}
                    />
                  </List.Item>
                )}
              /> */}
            </Card>
          </Col>
        ))}
      </Row>
    </PageContainer>
  );
};

export default GroupList;
