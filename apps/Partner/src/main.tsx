import './index.scss';
import * as ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './app/app';
import IntlController from './languages';
import '@react/commons/index.scss';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 1000,
      refetchOnWindowFocus: false,
      staleTime: 0,
      refetchIntervalInBackground: true,
      refetchOnReconnect: false,
      notifyOnChangeProps: 'all',
      refetchOnMount: true,
    },
  },
});

root.render(
  // <StrictMode>
  <QueryClientProvider client={queryClient}>
    <IntlController>
      <App />
    </IntlController>
    <ReactQueryDevtools />
  </QueryClientProvider>
  // </StrictMode>
);
