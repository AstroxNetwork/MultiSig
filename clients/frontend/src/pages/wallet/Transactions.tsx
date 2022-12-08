import { RootDispatch, RootState } from '@/store';
import { hasOwnProperty } from '@/utils';
import { PageContainer } from '@ant-design/pro-components';
import { useConnect } from '@connect2ic/react';
import { Button, Collapse, List, Spin } from 'antd';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Action } from '../../../../idls/ms_controller';

const WalletTransactions = () => {
  const dispatch = useDispatch<RootDispatch>();
  const loading = useSelector((state: RootState) => state.loading);
  const actions = useSelector((state: RootState) => state.controller.actions);
  const { activeController, activeControllerActor } = useSelector(
    (state: RootState) => state.controller,
  );
  const { activeProvider } = useConnect();

  useEffect(() => {
    dispatch.controller.queryActions({});
    createApp();
  }, []);

  const actionSign = async (action: Action) => {
    try {
      const resp = await activeControllerActor?.app_main_create();
      console.log('resp', resp);
      const result = await activeControllerActor?.action_sign_create(action.id);
      console.log('result', result);
    } catch (err) {
      console.log('err', err);
    }
  };

  const createApp = async () => {
    const result = await activeControllerActor?.app_main_create();
    console.log('createApp result', result);
  };

  console.log('actions', actions);

  return (
    <PageContainer ghost>
      {loading.models.controller ? (
        <div className="flex justify-center">
          <Spin />
        </div>
      ) : (
        <Collapse defaultActiveKey={[]}>
          {actions.map(action => (
            <Collapse.Panel
              header={
                <div className="flex justify-between">
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
                  </div>
                  <Button
                    type="primary"
                    disabled={
                      !!action.signs.find(
                        o => o.user_id.toText() === activeProvider?.principal,
                      )
                    }
                    onClick={() => actionSign(action)}
                  >
                    Sign
                  </Button>
                </div>
              }
              key={action.id.toString()}
            >
              <List
                dataSource={action.signs}
                renderItem={sign => (
                  <List.Item>{sign.user_id.toText()}</List.Item>
                )}
              />
            </Collapse.Panel>
          ))}
        </Collapse>
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
