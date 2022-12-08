import { RootDispatch, RootState } from '@/store';
import { hasOwnProperty } from '@/utils';
import { PageContainer } from '@ant-design/pro-components';
import { useConnect } from '@connect2ic/react';
import { Button, List } from 'antd';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Action } from '../../../../idls/ms_controller';

const WalletTransactions = () => {
  const dispatch = useDispatch<RootDispatch>();
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

  return (
    <PageContainer ghost>
      <List
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
          </List.Item>
        )}
      ></List>
    </PageContainer>
  );
};

export default WalletTransactions;
