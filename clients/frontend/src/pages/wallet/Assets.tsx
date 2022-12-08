import { RootState } from '@/store';
import { getActor } from '@/utils';
import { PageContainer } from '@ant-design/pro-components';
import { useConnect } from '@connect2ic/react';
import { idlFactory as controllerIdl } from '@/../../idls/ms_controller.idl';
import { Button, List } from 'antd';
import { useSelector } from 'react-redux';

const WalletAssets = () => {
  const { activeProvider } = useConnect();
  const { activeController, activeControllerActor } = useSelector(
    (state: RootState) => state.controller,
  );

  const createAction = async () => {
    try {
      const result = await activeControllerActor?.app_action_create({
        params: [
          ['to', 'aaxx'],
          ['from', 'xxdd'],
          ['amount', 'ddd'],
        ],
      });
      console.log('result', result);
    } catch (err) {
      console.log('err', err);
    }
  };
  return (
    <PageContainer ghost>
      <List>
        <List.Item>
          <Button type="primary" onClick={createAction}>
            Send
          </Button>
        </List.Item>
      </List>
    </PageContainer>
  );
};

export default WalletAssets;
