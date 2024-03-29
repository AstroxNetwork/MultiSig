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
import { Avatar, Button, Descriptions, List, message, Spin } from 'antd';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Modal from 'antd/es/modal/Modal';
import { BTC_PATH } from '@/utils/constants';
import { balanceFromString, balanceToString } from '@/utils/converter';
import BTC_ICON from '@/assets/b.svg';
import {
  CopyOutlined,
  Loading3QuartersOutlined,
  LoadingOutlined,
} from '@ant-design/icons';

const WalletAssets = () => {
  const { activeProvider } = useConnect();
  const { activeBtcWalletActor, address, fee, balance } = useSelector(
    (state: RootState) => state.btc,
  );
  const loading = useSelector((state: RootState) => state.loading);
  const { activeControllerActor } = useSelector(
    (state: RootState) => state.controller,
  );
  const [balanceLoading, setBalanceLoading] = useState(false);
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
        to_address: values.to_address,
        path: BTC_PATH,
        amount_in_satoshi: balanceFromString(values.amount_in_satoshi, 8),
        extended: [],
      });
      if (result && hasOwnProperty(result, 'Ok')) {
        message.success('Sent.');
        setSendVisable(false);
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
            description={
              <div className="flex">
                <p className="mr-3">Balance: {balance}</p>
                {balanceLoading ? (
                  <Spin
                    spinning={balanceLoading}
                    size={'small'}
                    indicator={<LoadingOutlined />}
                  />
                ) : (
                  <Loading3QuartersOutlined
                    onClick={async () => {
                      setBalanceLoading(true);
                      try {
                        const result =
                          await activeBtcWalletActor?.btc_balance_get(address);
                        dispatch.btc.save({
                          balance:
                            result !== undefined
                              ? result === BigInt(0)
                                ? '0'
                                : balanceToString(result, 8).formatTotal
                              : '--',
                        });
                        setBalanceLoading(false);
                      } catch (err) {
                        console.log('err', err);
                        setBalanceLoading(false);
                      }
                    }}
                  />
                )}
              </div>
            }
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
        <p className="mb-3">Form: {address}</p>
        <ProFormText
          required
          label="To"
          name="to_address"
          placeholder={'Wallet Address'}
        />
        <ProFormText
          required
          label="Amount"
          name="amount_in_satoshi"
          placeholder={'eg: 0.12345678'}
        />
        <p>Balance: {balance}</p>
        <p>
          Fee:(Unavailable yet)
          {/* {fee.map(val => (
            <span>{val.toString()}</span>
          ))} */}
        </p>
      </ModalForm>
    </PageContainer>
  );
};

export default WalletAssets;
