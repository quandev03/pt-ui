import * as ReactDOM from 'react-dom/client';

import App from './app/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.scss';

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
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
