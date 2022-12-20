import React from 'react';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import './index.less';
import './index.css';
import enUS from 'antd/locale/en_US';

import RouterContainer from './routes/Router';
import { AccessProvider } from './components/Access/runtime';
import { createRoot } from 'react-dom/client';
import { Connect2ICProvider, ConnectDialog } from '@connect2ic/react';
import { createClient } from '@connect2ic/core';
import {
  AstroX,
  ICX,
  defaultProviders,
  InternetIdentity,
} from '@connect2ic/core/providers';
import { ConfigProvider, theme } from 'antd';
// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container); // createRoot(container!) if you use TypeScript
(window as any).process = {};
const client = createClient({
  // providers: defaultProviders,
  providers: [
    (window as any).icx
      ? new ICX({})
      : new AstroX({
          // providerUrl: "https://ccmhe-vqaaa-aaaai-acmoq-cai.raw.ic0.app/",
          // providerUrl: 'http://localhost:8080',
          // delegationModes: ['global', 'domain'],
        }),
    //  new PlugWallet(),
    new InternetIdentity(),
  ],
  globalProviderConfig: {
    // dev: true,
    // whitelist: ['4qt4p-gaaaa-aaaah-abx2q-cai'],
    whitelist: ['4qt4p-gaaaa-aaaah-abx2q-cai'],
  },
});

root.render(
  // <React.StrictMode>
  <ConfigProvider
    locale={enUS}
    theme={
      {
        // algorithm: theme.darkAlgorithm,
      }
    }
  >
    <Provider store={store}>
      <AccessProvider>
        <Connect2ICProvider client={client}>
          <RouterContainer />
          <ConnectDialog />
        </Connect2ICProvider>
      </AccessProvider>
    </Provider>
  </ConfigProvider>,

  // </React.StrictMode>
);

// ReactDOM.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <Provider store={store}>
//         <AccessProvider>
//           <RouterContainer />
//         </AccessProvider>
//       </Provider>
//     </BrowserRouter>
//   </React.StrictMode>,
//   document.getElementById("root")
// );
