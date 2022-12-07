// This file is generated by Umi automatically
// DO NOT CHANGE IT MANUALLY!
import { useEffect, useMemo } from 'react';
import { IRoute } from '@/routes/renderRoutes/renderRoutes';
import { useAccess, useAccessMarkedRoutes } from '@/components/Access';
import RightContent from '@/components/RightContent';
import Exception from '@/components/Exception';
import { useDispatch } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { CreateActorResult, IConnector } from '@connect2ic/core';
import { useConnect, useWallet } from '@connect2ic/react';
import { _SERVICE as providerService } from '@/../../idls/ms_provider';
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
import { ArrowLeftOutlined } from '@ant-design/icons';

const loginPath = '/home';

export interface InitialStateType {
  currentUser: IConnector | null;
  providerActor: ActorSubclass<providerService> | null;
  controllerActor: ActorSubclass<controllerService> | null;
  btcActor: ActorSubclass<btcService> | null;
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
  const { isConnected, activeProvider } = useConnect();
  const [walletProvider] = useWallet();
  const history = useHistory();
  const dispatch = useDispatch<RootDispatch>();
  const slideMode = useSelector((state: RootState) => state.app.slideMode);
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
      handleInitialState();
    }
  }, [isConnected]);

  const handleInitialState = async () => {
    console.log(activeProvider);
    console.log(walletProvider);
    // console.log(
    //   'process.env.MS_CONTROLLER_CANISTERID!',
    //   process.env.MS_CONTROLLER_CANISTERID!,
    // );
    console.log(
      'process.env.MS_PROVIDER_CANISTERID!',
      process.env.MS_PROVIDER_CANISTERID!,
    );
    const providerActorResult = (await walletProvider?.createActor(
      process.env.MS_PROVIDER_CANISTERID!,
      providerIdl,
    )) as CreateActorResult<providerService>;
    // const controllerActorResult = (await walletProvider?.createActor(
    //   process.env.MS_CONTROLLER_CANISTERID!,
    //   controllerIdl,
    // )) as CreateActorResult<controllerService>;
    // const btcActorResult = (await walletProvider?.createActor(
    //   process.env.BTC_WALLET_CANISTERID!,
    //   btcIdl,
    // )) as CreateActorResult<btcService>;
    const providerActor = providerActorResult.isOk()
      ? providerActorResult.value
      : null;
    // const controllerActor = controllerActorResult.isOk()
    //   ? controllerActorResult.value
    //   : null;
    // const btcActor = btcActorResult.isOk() ? btcActorResult.value : null;
    await dispatch.global.save({
      initialState: {
        currentUser: activeProvider,
        providerActor,
        controllerActor: null,
        btcActor: null,
      },
    });
    dispatch.app.queryGroups({});
  };

  console.log('menuRoute', menuRoute);
  return (
    <ProLayout
      route={
        slideMode === 'home'
          ? menuRoute.routes?.find(route => route.path!.indexOf('group') > -1)
          : menuRoute.routes?.find(route => route.path!.indexOf('wallet') > -1)
      }
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
            {slideMode === 'home' ? (
              <div>Group header</div>
            ) : (
              <div>
                <ArrowLeftOutlined
                  onClick={() => {
                    history.goBack();
                    dispatch.app.save({ slideMode: 'group' });
                  }}
                />
                <div className="mt-3">Wallet header</div>
              </div>
            )}
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
