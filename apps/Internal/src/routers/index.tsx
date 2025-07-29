import { ErrorPage } from 'apps/Internal/src/modules/NotFound/page';
import { memo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { HashRouter } from 'react-router-dom';
import RouterComponent from './RouterComponent';

const AppRouter = memo(() => {
  return (
    <HashRouter basename={import.meta.env.PUBLIC_URL}>
      <ErrorBoundary fallback={<ErrorPage />}>
        <RouterComponent />
      </ErrorBoundary>
    </HashRouter>
  );
});

export default AppRouter;
