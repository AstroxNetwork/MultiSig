import { RootDispatch, RootState } from '@/store';
import { getActor, hasOwnProperty } from '@/utils';
import {
  ModalForm,
  PageContainer,
  ProForm,
  ProFormText,
} from '@ant-design/pro-components';
import { useConnect } from '@connect2ic/react';
import { idlFactory as controllerIdl } from '@/../../idls/ms_controller.idl';
import { Avatar, Button, Descriptions, List, message } from 'antd';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Modal from 'antd/es/modal/Modal';
import { BTC_PATH } from '@/utils/constants';
import { balanceFromString } from '@/utils/converter';
import BTC_ICON from '@/assets/bitcoin.svg';
import { CopyOutlined } from '@ant-design/icons';

const WalletAssets = () => {
  const { activeProvider } = useConnect();
  const { activeBtcWalletActor, address, fee, balance } = useSelector(
    (state: RootState) => state.btc,
  );
  const loading = useSelector((state: RootState) => state.loading);
  const { activeControllerActor } = useSelector(
    (state: RootState) => state.controller,
  );
  const dispatch = useDispatch<RootDispatch>();

  const history = useHistory();
  const [sendVisable, setSendVisable] = useState(false);

  useEffect(() => {}, []);

  // console.log('btc activeBtcWalletActor', activeBtcWalletActor);
  // console.log('address', address);
  // console.log('fee', fee);
  // console.log('balance', balance);

  const createAction = async (values: { [key: string]: string }) => {
    try {
      const result = await activeControllerActor?.app_action_create({
        params: [
          ['to_address', values.to_address],
          ['path', BTC_PATH],
          [
            'amount_in_satoshi',
            balanceFromString(values.amount_in_satoshi, 8).toString(),
          ],
        ],
      });
      if (result && hasOwnProperty(result, 'Ok')) {
        message.success('Sent.');
      }
      console.log('result', result);
    } catch (err) {
      console.log('err', err);
    }
  };
  return (
    <PageContainer ghost>
      {/* <Descriptions column={6}>
        <Descriptions.Item span={3} label={<Avatar src={BTC_ICON} />}>
          {address}
        </Descriptions.Item>
        <Descriptions.Item label={'Balance'}>{balance}</Descriptions.Item>
        <Descriptions.Item label={''}>
          <Button
            type="primary"
            onClick={async () => {
              // await dispatch.btc.getFee({});
              setSendVisable(true);
            }}
          >
            Send
          </Button>
        </Descriptions.Item>
      </Descriptions> */}
      <List
        className="bg-white"
        loading={loading.models.btc || loading.models.controller}
      >
        <List.Item
          extra={
            <Button
              type="primary"
              onClick={async () => {
                // await dispatch.btc.getFee({});
                setSendVisable(true);
              }}
            >
              Send
            </Button>
          }
        >
          <List.Item.Meta
            // className="items-center"
            style={{
              alignItems: 'center',
            }}
            avatar={<Avatar src={BTC_ICON} />}
            title={
              <div className="flex">
                {address}
                <CopyOutlined
                  className="ml-3"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(address);
                      message.success('Copied!');
                    } catch (err) {
                      message.error((err as any).toString());
                    }
                  }}
                />
              </div>
            }
            description={`Balance: ${balance}`}
          />
          {/* <Button
            type="primary"
            onClick={() => {
              history.replace('/group/setting?create=true');
            }}
          >
            Setting
          </Button> */}
        </List.Item>
      </List>
      <ModalForm
        open={sendVisable}
        onFinish={createAction}
        title="Send tokens"
        width={500}
        modalProps={{
          onCancel: () => setSendVisable(false),
        }}
      >
        <p className="mb-3">Send Form: {address}</p>
        <ProFormText required label="To" name="to_address" />
        <ProFormText required label="Amount" name="amount_in_satoshi" />
        <p>Balance: {balance}</p>
        <p>
          Fee:
          {fee.map(val => (
            <span>{val.toString()}</span>
          ))}
        </p>
      </ModalForm>
    </PageContainer>
  );
};

export default WalletAssets;
