import React, { useCallback } from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import { Avatar, Menu, message, Spin } from 'antd';
import styles from './index.module.less';
import type { MenuInfo } from 'rc-menu/lib/interface';
import HeaderDropdown from '../HeaderDropdown';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
// @ts-ignore
import { client } from '@/main';
import { useConnect } from '@connect2ic/react';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState } = useSelector((state: RootState) => state.global);
  const { disconnect } = useConnect();
  console.log('right==', initialState?.currentUser);
  const history = useHistory();
  console.log(initialState?.currentUser?.principal);
  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    const { search, pathname } = window.location;
    disconnect();
  };
  const onMenuClick = useCallback((event: MenuInfo) => {
    const { key } = event;
    if (key === 'logout') {
      // setInitialState((s) => ({ ...s, currentUser: undefined }));
      loginOut();
      return;
    }
  }, []);

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState?.currentUser) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="logout">
        <LogoutOutlined />
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} alt="avatar" />
        {`${initialState.currentUser?.principal?.slice(
          0,
          6,
        )}...${initialState.currentUser?.principal?.slice(-4)}`}
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
