import { IRoute } from "./renderRoutes/renderRoutes";
import { BookOutlined, DatabaseOutlined, HistoryOutlined, HomeOutlined, TeamOutlined } from "@ant-design/icons";
import HomePage from "@/pages/";
import Component404 from '@/pages/404';
import UserLayout from "@/layout/UserLayout";
import GroupCreate from "@/pages/group/Create";
import GroupList from "@/pages/group/List";
import WalletAssets from "@/pages/wallet/Assets";
import WalletTransactions from "@/pages/wallet/Transactions";
import WalletCreate from "@/pages/wallet/WalletCreate";
import AddressBook from "@/pages/wallet/AddressBook";



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
            name: 'Group create',
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
            name: 'Address Book',
            icon: <BookOutlined />,
            path: '/wallet/book',
            component: AddressBook,
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
