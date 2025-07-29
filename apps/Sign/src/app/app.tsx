import { ConfigProvider } from 'antd';
import vn from 'antd/lib/locale/vi_VN';
import { themeConfig } from 'apps/Sign/src/configs/ThemeConfig';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorPage from './NotFound/page';
import SignPdf from './ActivateSubscription/pages/SignPdf';
import { ThemeProvider } from 'styled-components';
import { pathRouterSign } from '@react/url/pathRouterSign';
import { APP_VERSION } from 'apps/Sign/src/AppConfig';
import PaySuccess from './PaySuccess';
import OwnershipTransfer from './OwnershipTransfer/pages';

export function App() {
  return (
    <ThemeProvider theme={themeConfig}>
      <ConfigProvider
        locale={vn}
        theme={{
          token: {
            fontFamily: 'Inter',
            colorPrimary: themeConfig.primary,
            controlHeight: 36,
          },
          components: {
            Form: {
              itemMarginBottom: 10,
            },
            Input: {
              colorTextDisabled: 'black',
            },
            Select: {
              colorTextDisabled: 'black',
            },
            DatePicker: {
              colorTextDisabled: 'black',
            },
          },
        }}
      >
        <HashRouter basename={import.meta.env.PUBLIC_URL}>
          <ErrorBoundary fallback={<ErrorPage />}>
            <Routes>
              <Route path={pathRouterSign.signHD} element={<SignPdf />} />
              <Route path={pathRouterSign.preContract} element={<SignPdf />} />
              <Route path={pathRouterSign.changeSim} element={<SignPdf />} />
              <Route path={pathRouterSign.censorship} element={<SignPdf />} />
              <Route path={pathRouterSign.changeInfo} element={<SignPdf />} />
              <Route path={pathRouterSign.pay} element={<PaySuccess />} />
              <Route
                path={pathRouterSign.ownershipTransfer}
                element={<OwnershipTransfer />}
              />
            </Routes>
          </ErrorBoundary>
        </HashRouter>
        <div id="app-version">Version: {APP_VERSION}</div>
      </ConfigProvider>
    </ThemeProvider>
  );
}

export default App;
