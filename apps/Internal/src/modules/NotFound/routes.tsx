import NotFoundPage from './page';
import { RouterConfig } from 'apps/Internal/src/routers/ProtectedRoute';

const routes: RouterConfig[] = [
  {
    path: '*',
    page: <NotFoundPage />,
  },
];

export default routes;
