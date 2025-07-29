import useLanguageStore from '../languages/store';
// import dayjs from 'dayjs';
import en from 'antd/lib/locale/en_US';
import vn from 'antd/lib/locale/vi_VN';
import { ThemeProvider } from 'styled-components';
import { ConfigProvider } from 'antd';
import AppRouter from '../routers';
import '../index.scss';
import { themeConfig } from '../configs/ThemeConfig';
import { useEffect } from 'react';
import { APP_VERSION } from 'apps/Internal/src/AppConfig';

function App() {
  const { lang } = useLanguageStore();

  useEffect(() => {
    window.addEventListener('vite:preloadError', () => {
      window.location.reload();
    });
    return () => {
      window.removeEventListener('vite:preloadError', () => {
        window.location.reload();
      });
    };
  }, []);

  return (
    <ThemeProvider theme={themeConfig}>
      <ConfigProvider
        locale={lang === 'vi' ? vn : en}
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
            InputNumber: {
              colorTextDisabled: 'black',
            },
            TreeSelect: {
              indentSize: 14,
            },
          },
        }}
      >
        <AppRouter />
        <div id="app-version">Version: {APP_VERSION}</div>
      </ConfigProvider>
    </ThemeProvider>
  );
}

export default App;
