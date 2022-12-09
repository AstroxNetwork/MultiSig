import { RootDispatch, RootState } from '@/store';
import { getActor } from '@/utils';
import { PageContainer } from '@ant-design/pro-components';
import { useConnect } from '@connect2ic/react';
import { idlFactory as controllerIdl } from '@/../../idls/ms_controller.idl';
import { Button, List } from 'antd';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const WalletAssets = () => {
  const { activeProvider } = useConnect();
  const { activeBtcWalletActor, address, fee, balance } = useSelector(
    (state: RootState) => state.btc,
  );
  const { activeControllerActor } = useSelector(
    (state: RootState) => state.controller,
  );
  const dispatch = useDispatch<RootDispatch>();

  const history = useHistory();

  useEffect(() => {
    initData();
  }, []);

  console.log('btc model', activeBtcWalletActor, address, fee, balance);

  const initData = async () => {
    await dispatch.btc.getAddress({});
    await dispatch.btc.getBalance({});
  };

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
          <Button
            type="primary"
            onClick={() => {
              history.replace('/group/setting?create=true');
            }}
          >
            Setting
          </Button>
        </List.Item>
      </List>
    </PageContainer>
  );
};

export default WalletAssets;
