import { IRoute } from "./renderRoutes/renderRoutes";
import HomePage from "@/pages/";
import Component404 from '@/pages/404';
import { AppstoreAddOutlined, BellOutlined, DatabaseOutlined, HistoryOutlined, HomeOutlined, SettingOutlined, TableOutlined, TeamOutlined, UngroupOutlined, UsergroupAddOutlined, UserOutlined } from "@ant-design/icons";
import UserLayout from "@/layout/UserLayout";
import GroupCreate from "@/pages/group/Create";
import GroupList from "@/pages/group/List";
import WalletAssets from "@/pages/wallet/Assets";
import WalletTransactions from "@/pages/wallet/Transactions";
import WalletCreate from "@/pages/wallet/WalletCreate";



const routes: IRoute[] = [
  
  {
    path: '/',
    component: UserLayout,
    routes: [
      {
        name: 'Group',
        path: '/group',
        routes: [
          {
            name: 'Home',
            icon: <HomeOutlined />,
            path: '/group/home',
            component: HomePage,
          },
          {
            name: 'Group',
            icon: <TeamOutlined />,
            path: '/group/list',
            component: GroupList,
          },
          {
            name: '群组创建',
            hideInMenu: true,
            path: '/group/create',
            component: GroupCreate
          }
        ]
      },

      {
        name: 'Wallet',
        path: '/wallet',
        routes: [
          {
            name: 'Assets',
            icon: <DatabaseOutlined />,
            path: 'wallet/assets',
            component: WalletAssets,
          },
          {
            name: 'Transactions',
            icon: <HistoryOutlined />,
            path: '/wallet/transactions',
            component: WalletTransactions,
          },
          {
            name: 'Wallet create',
            hideInMenu: true,
            path: '/wallet/create',
            component: WalletCreate
          }
        ]
      },
    ]
  },
  {
    path: '*',
    component: Component404,
  },
];

export default routes;
