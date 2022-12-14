import { RootDispatch, RootState } from '@/store';
import { hasOwnProperty } from '@/utils';
import { PageContainer } from '@ant-design/pro-components';
import { useConnect } from '@connect2ic/react';
import {
  Button,
  Collapse,
  Descriptions,
  List,
  message,
  Spin,
  Tabs,
} from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Action } from '../../../../idls/ms_controller';
import { TeamOutlined } from '@ant-design/icons';
import { balanceToString } from '@/utils/converter';
import { ActionExtend } from '@/models/controller';

const WalletTransactions = () => {
  const dispatch = useDispatch<RootDispatch>();
  const loading = useSelector((state: RootState) => state.loading);
  const actions = useSelector((state: RootState) => state.controller.actions);
  const { activeController, activeControllerActor } = useSelector(
    (state: RootState) => state.controller,
  );
  const [signLoading, setSignLoading] = useState(false);
  const { activeProvider } = useConnect();

  useEffect(() => {
    dispatch.controller.queryActions({});
  }, []);

  const actionSign = async (action: ActionExtend) => {
    setSignLoading(true);
    try {
      const result = await activeControllerActor?.action_sign_create(action.id);
      console.log('result', result);
      if (result && hasOwnProperty(result, 'Ok')) {
        await dispatch.controller.queryActions({});
        message.success('Signed.');
      }
    } catch (err) {
      console.log('err', err);
    }
    setSignLoading(false);
  };

  console.log('actions', actions);

  const actionRender = (actions: ActionExtend[]) => {
    if (actions.length === 0) return null;
    return (
      <Collapse defaultActiveKey={[]}>
        {actions.map(action => (
          <Collapse.Panel
            header={
              <div className="flex justify-between items-center">
                <div className="flex">
                  {hasOwnProperty(action.status, 'SUCCESS')
                    ? 'Success'
                    : hasOwnProperty(action.status, 'SINGING')
                    ? 'Singing'
                    : hasOwnProperty(action.status, 'INIT')
                    ? 'init'
                    : 'timeout'}
                  <p className="ml-3">
                    {dayjs(
                      Math.ceil(Number(action.create_at) / 1000000),
                    ).format('YYYY-MM-DD HH:mm:ss')}
                  </p>
                  <p className="flex ml-3">
                    <TeamOutlined />
                    {`${action.signs.length} out of ${activeController?.threshold_user_amount}`}
                  </p>
                </div>
                <Button
                  type="primary"
                  loading={signLoading}
                  disabled={
                    !!action.signs.find(
                      o => o.user_id.toText() === activeProvider?.principal,
                    )
                  }
                  onClick={e => {
                    e.stopPropagation();
                    actionSign(action);
                  }}
                >
                  Sign
                </Button>
              </div>
            }
            key={action.id.toString()}
          >
            <div className="flex">
              <Descriptions column={1}>
                {/* <Descriptions.Item label={'Path'}>
                  {action.path}
                </Descriptions.Item> */}
                <Descriptions.Item label={'toAddress'}>
                  {action.to_address}
                </Descriptions.Item>
                <Descriptions.Item label={'Amount'}>
                  {balanceToString(action.amount_in_satoshi, 8).formatTotal}
                </Descriptions.Item>
                {action.tx_id ? (
                  <Descriptions.Item label={'Tx_id'}>
                    {action.tx_id}
                  </Descriptions.Item>
                ) : null}
              </Descriptions>
              <List
                style={{ minWidth: 400 }}
                dataSource={action.signs}
                renderItem={sign => (
                  <List.Item>{sign.user_id.toText()}</List.Item>
                )}
              />
            </div>
          </Collapse.Panel>
        ))}
      </Collapse>
    );
  };

  return (
    <PageContainer ghost>
      <Tabs></Tabs>
      {loading.models.controller ? (
        <div className="flex justify-center">
          <Spin />
        </div>
      ) : (
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              label: `Queue`,
              key: '1',
              children: actionRender(
                actions.filter(
                  action =>
                    hasOwnProperty(action.status, 'INIT') ||
                    hasOwnProperty(action.status, 'SINGING'),
                ),
              ),
            },
            {
              label: `History`,
              key: '2',
              children: actionRender(
                actions.filter(
                  action =>
                    hasOwnProperty(action.status, 'SUCCESS') ||
                    hasOwnProperty(action.status, 'TIMEOUT'),
                ),
              ),
            },
          ]}
        />
      )}
      {/* <List
        loading={loading.models.controller}
        dataSource={actions}
        renderItem={action => (
          <List.Item>
            {action.id.toString()}
            {hasOwnProperty(action.status, 'SUCCESS')
              ? 'Success'
              : hasOwnProperty(action.status, 'SINGING')
              ? 'Singing'
              : hasOwnProperty(action.status, 'INIT')
              ? 'init'
              : 'timeout'}
            <List
              dataSource={action.signs}
              renderItem={sign => (
                <List.Item>{sign.user_id.toText()}</List.Item>
              )}
            />
            {}
          </List.Item>
        )}
      ></List> */}
    </PageContainer>
  );
};

export default WalletTransactions;
