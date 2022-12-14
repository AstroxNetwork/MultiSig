// This file is generated by Umi automatically
// DO NOT CHANGE IT MANUALLY!
import { useEffect, useMemo, useState } from 'react';
import { IRoute } from '@/routes/renderRoutes/renderRoutes';
import { useAccess, useAccessMarkedRoutes } from '@/components/Access';
import RightContent from '@/components/RightContent';
import Exception from '@/components/Exception';
import { useDispatch } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { CreateActorResult, IConnector } from '@connect2ic/core';
import { useConnect, useWallet } from '@connect2ic/react';
import {
  Controller,
  _SERVICE as providerService,
} from '@/../../idls/ms_provider';
import { idlFactory as providerIdl } from '@/../../idls/ms_provider.idl';
import { _SERVICE as controllerService } from '@/../../idls/ms_controller';
import { idlFactory as controllerIdl } from '@/../../idls/ms_controller.idl';
import { _SERVICE as btcService } from '@/../../idls/btc_wallet';
import { idlFactory as btcIdl } from '@/../../idls/btc_wallet.idl';
// import { matchRoutes } from 'react-router';
import routes from '@/routes/routes';
import { ProLayout } from '@ant-design/pro-components';
import { ActorSubclass } from '@dfinity/agent';
import { useSelector } from 'react-redux';
import { RootDispatch, RootState } from '@/store';
import {
  ArrowLeftOutlined,
  CopyOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { getActor, hasOwnProperty } from '@/utils';
import { Avatar, Drawer, List } from 'antd';
import { Principal } from '@dfinity/principal';
import { BTC_PATH } from '@/utils/constants';

const loginPath = '/home';

export interface InitialStateType {
  currentUser: IConnector | null;
  providerActor: ActorSubclass<providerService> | null;
}

// // 过滤出需要显示的路由, 这里的filterFn 指 不希望显示的层级
const filterRoutes = (
  routes: IRoute[],
  filterFn: (route: IRoute) => boolean,
) => {
  if (routes.length === 0) {
    return [];
  }

  let newRoutes: IRoute[] = [];
  for (const route of routes) {
    if (filterFn(route)) {
      if (Array.isArray(route.routes)) {
        newRoutes.push(...filterRoutes(route.routes, filterFn));
      }
    } else {
      newRoutes.push(route);
      if (Array.isArray(route.routes)) {
        route.routes = filterRoutes(route.routes, filterFn);
      }
    }
  }

  return newRoutes;
};

// 格式化路由 处理因 wrapper 导致的 菜单 path 不一致
const mapRoutes = (routes: IRoute[]) => {
  if (routes.length === 0) {
    return [];
  }
  return routes.map(route => {
    // 需要 copy 一份, 否则会污染原始数据
    const newRoute = { ...route };
    if (route.originPath) {
      newRoute.path = route.originPath;
    }

    if (Array.isArray(route.routes)) {
      newRoute.routes = mapRoutes(route.routes);
    }

    return newRoute;
  });
};

export default (props: any) => {
  const location = useLocation();
  const { isConnected, activeProvider, principal } = useConnect();
  const [walletProvider] = useWallet();
  const { activeController } = useSelector(
    (state: RootState) => state.controller,
  );
  const history = useHistory();
  const dispatch = useDispatch<RootDispatch>();
  const [groupVisable, setGroupVisable] = useState(false);
  const groups = useSelector((state: RootState) => state.app.groups);
  const clientRoutes = mapRoutes(routes);
  const [menuRoute] = useAccessMarkedRoutes([
    clientRoutes.find(route => route.path === '/') as IRoute,
  ]);
  const matchedRoute = useMemo(() => {
    const routes = filterRoutes(clientRoutes, (curRoute: IRoute) => {
      return !!curRoute.routes && curRoute.routes.length > 0;
    });
    return routes.find(route => route.path === location.pathname);
  }, [location.pathname]);
  const runtimeConfig = {
    key: 'layout',
    type: 'modify',
    initialValue: {},
  };

  useEffect(() => {
    // userLayout   getInitialState
    if (isConnected) {
      dispatch.app.save({ groups: [] });
      dispatch.controller.save({ actions: [] });
      dispatch.btc.save({
        address: '',
        balance: '',
        fee: [],
      });
      handleInitialState();
    }
  }, [isConnected, principal]);

  const handleInitialState = async () => {
    const providerActor = await getActor(
      activeProvider!,
      '4qt4p-gaaaa-aaaah-abx2q-cai',
      providerIdl,
    );

    await dispatch.global.save({
      initialState: {
        providerActor,
        currentUser: activeProvider,
      },
    });
    try {
      const groups = await dispatch.app.queryGroups({});
      if (groups && groups.length > 0) {
        const local = localStorage.getItem('ACTIVE_GROUP');
        let selectGroup = null;
        if (local) {
          const findGroup = groups.find(group => group.id.toText() === local);
          selectGroup = findGroup ?? groups[0];
        } else {
          selectGroup = groups[0];
        }
        // 初始化controllerActor和btc_wallet
        const activeControllerActor = await getActor<controllerService>(
          activeProvider!,
          selectGroup.id.toText(),
          controllerIdl,
        );
        await dispatch.controller.save({
          activeController: selectGroup,
          activeControllerActor,
        });
        dispatch.btc.initBTCWallet({ provider: activeProvider! });
        history.replace('/wallet/assets');
      } else {
        history.replace('/group/home');
      }
    } catch (err) {
      console.log('err', err);
      history.replace('/group/home');
    }
  };

  const switchGroup = () => {
    setGroupVisable(true);
  };

  const selectGroup = async (group: Controller) => {
    const controllerActor = await getActor<controllerService>(
      activeProvider!,
      group!.id.toText(),
      controllerIdl,
    );
    setGroupVisable(false);
    await dispatch.controller.save({
      activeController: group,
      activeControllerActor: controllerActor,
    });
    await dispatch.btc.initBTCWallet({ provider: activeProvider! });
    localStorage.setItem('ACTIVE_GROUP', group.id.toText());
    // dispatch.app.queryWallets({ contrlCanisterId: group.id.toText() });
    history.push('/wallet/assets');
  };

  console.log('menuRoute', menuRoute);
  return (
    <ProLayout
      route={menuRoute}
      title={'Multi-sig'}
      navTheme="light"
      siderWidth={256}
      onMenuHeaderClick={e => {
        e.stopPropagation();
        e.preventDefault();
        history.push('/');
      }}
      // formatMessage={userConfig.formatMessage || formatMessage}
      // menu={{ locale: userConfig.locale }}
      logo={null}
      // menuExtraRender={() => {
      //   return (
      //     <div>
      //       Group
      //     </div>
      //   )
      // }}
      menuHeaderRender={() => {
        return (
          <>
            {/* <ArrowLeftOutlined
              onClick={() => {
                history.push('/group/list');
                dispatch.app.save({ slideMode: 'home' });
              }}
            /> */}
            <div className="mt-3 flex-1">
              {activeController ? (
                <>
                  <div className="flex items-center" onClick={switchGroup}>
                    <div>
                      {activeController?.threshold_user_amount}/
                      {activeController?.total_user_amount}
                    </div>
                    <div className="ml-2 text-ellipsis whitespace-nowrap flex-1">
                      <h3>{activeController.name}</h3>
                      <div className="flex">
                        {`${activeController.id
                          .toText()
                          .slice(0, 6)}...${activeController.id
                          .toText()
                          .slice(-3)}`}
                        <CopyOutlined
                          onClick={e => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(
                              activeController.id.toText(),
                            );
                          }}
                        />
                      </div>
                    </div>
                    <DownOutlined />
                  </div>
                  <Drawer
                    maskClosable
                    onClose={() => {
                      setGroupVisable(false);
                    }}
                    placement="left"
                    open={groupVisable}
                  >
                    <List
                      dataSource={groups}
                      renderItem={controller => (
                        <List.Item
                          className={`${
                            controller.id.toText() ===
                            activeController.id.toText()
                              ? 'bg-stone-100'
                              : ''
                          }`}
                          onClick={() => selectGroup(controller)}
                        >
                          <List.Item.Meta
                            avatar={
                              <>
                                <Avatar src="https://joeschmoe.io/api/v1/random" />
                                <p className="text-center">
                                  {controller.threshold_user_amount}/
                                  {controller.total_user_amount}
                                </p>
                              </>
                            }
                            title={controller.name}
                            description={
                              <p className="text-rose-500">
                                {controller.id.toText()}
                              </p>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  </Drawer>
                </>
              ) : null}
            </div>
          </>
        );
      }}
      menuItemRender={(menuItemProps, defaultDom) => {
        // console.log('menuItemRender', menuItemProps, defaultDom);
        if (menuItemProps.isUrl || menuItemProps.children) {
          return defaultDom;
        }
        if (menuItemProps.path && location.pathname !== menuItemProps.path) {
          return (
            // handle wildcard route path, for example /slave/* from qiankun
            <Link
              to={menuItemProps.path.replace('/*', '')}
              target={menuItemProps.target}
            >
              {defaultDom}
            </Link>
          );
        }
        return defaultDom;
      }}
      fixSiderbar
      fixedHeader
      layout="mix"
      // splitMenus
      {...runtimeConfig}
      rightContentRender={() => <RightContent />}
    >
      <Exception
        route={matchedRoute}
        // notFound={runtimeConfig.notFound}
        // noAccessible={runtimeConfig.noAccessible}
      >
        {props.children}
      </Exception>
    </ProLayout>
  );
};
