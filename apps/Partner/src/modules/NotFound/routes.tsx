import NotFoundPage from './page';
import { RouterConfig } from 'apps/Partner/src/routers/ProtectedRoute';

const notFoundRoutes: RouterConfig[] = [
  {
    path: '*',
    page: <NotFoundPage />,
  },
];

export default notFoundRoutes;
