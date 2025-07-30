import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary, Loader, themeConfig } from '@vissoft-react/common';
import { ConfigProvider } from 'antd';
import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { routers } from './routers';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 1000,
      staleTime: 0,
      notifyOnChangeProps: 'all',
    },
  },
});

export function App() {
  return (
    <ErrorBoundary showDetails={import.meta.env.DEV}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={themeConfig}>
          <ConfigProvider
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
            <div className="flex min-h-screen min-w-screen items-center justify-center">
              <Suspense fallback={<Loader />}>
                <RouterProvider
                  future={{
                    v7_startTransition: true,
                  }}
                  fallbackElement={<Loader />}
                  router={routers}
                />
              </Suspense>
            </div>
          </ConfigProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
