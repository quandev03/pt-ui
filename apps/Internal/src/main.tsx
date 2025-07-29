import * as ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './app/app';
import IntlController from './languages';
import './index.scss';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
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
