import { RootDispatch, RootState } from '@/store';
import { DownOutlined } from '@ant-design/icons';
import { Modal, Space } from 'antd';
// import { QuestionCircleOutlined } from '@ant-design/icons';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useConnect } from '@connect2ic/react';
// import { useModel, SelectLang } from 'umi';
import Avatar from './AvatarDropdown';
import styles from './index.module.less';
import { initiateICPSnap } from '@/services/metamask';
import { SnapIdentity } from '@astrox/icsnap-adapter';
import { useDispatch } from 'react-redux';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.global);
  const { connect, activeProvider } = useConnect();
  const [identity, setIdentity] = useState<SnapIdentity>();
  const [installed, setInstalled] = useState<boolean>(false);
  const dispatch = useDispatch<RootDispatch>();

  const installSnap = useCallback(async () => {
    const installResult = await initiateICPSnap();
    if (!installResult.isSnapInstalled) {
      setInstalled(false);
    } else {
      setInstalled(true);
      setIdentity(installResult.identity!);
    }
  }, []);

  useEffect(() => {
    if (!identity) {
      // installSnap()
    } else {
      // factoryActorInit()
      // 初始化snap身份完成 有identity
    }
  }, [identity]);

  const loginModal = () => {
    // Modal.info({
    //   title: ''
    // })
    const result = connect((window as any).icx ? 'icx' : 'astrox');
    // installSnap()
  };

  if (activeProvider === null) {
    return (
      <div className="flex" onClick={loginModal}>
        <div className="leading-5">
          <p>Not connected</p>
          <p className="text-rose-500">Connect wallet</p>
        </div>
        <DownOutlined className="ml-2" />
      </div>
    );
  }

  return (
    <Space className={styles.right}>
      {/* <span
        className={styles.action}
        onClick={() => {
          window.open('https://pro.ant.design/docs/getting-started');
        }}
      >
        <QuestionCircleOutlined />
      </span> */}
      <Avatar />
      {/* <SelectLang className={styles.action} /> */}
    </Space>
  );
};
export default GlobalHeaderRight;
