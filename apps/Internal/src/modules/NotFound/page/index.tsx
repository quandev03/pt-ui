import { Button, Result } from 'antd';
import { useErrorBoundary } from 'react-error-boundary';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { pathRoutes } from '../../../constants/routes';
import useConfigAppStore from 'apps/Internal/src/components/layouts/store';
import StorageService from 'apps/Internal/src/helpers/storageService';

export const ErrorPage = () => {
  const { resetBoundary } = useErrorBoundary();
  return (
    <div>
      <Result
        status="500"
        title="500"
        subTitle="Sorry, an error orcurred."
        extra={
          <Button type="primary" onClick={resetBoundary}>
            <Link to={pathRoutes.login}>Login</Link>
          </Button>
        }
      />
    </div>
  );
};

const NotFoundPage = () => {
  const { resetBoundary } = useErrorBoundary();
  const navigate = useNavigate();
  const { isAuthenticated } = useConfigAppStore();
  const token = StorageService.getAccessToken();
  const location = useLocation();
  const handleClickBack = () => {
    navigate(-1);
    resetBoundary();
  };

  if (!isAuthenticated || !token) {
    return (
      <Navigate
        to={pathRoutes.login}
        replace={true}
        state={{ redirectTo: location }}
      />
    );
  }
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={handleClickBack}>
          Back
        </Button>
      }
    />
  );
};

export const ReloadPage = () => {
  const reload = () => {
    window.location.reload();
  };
  return (
    <div>
      <Result
        status="500"
        title="500"
        subTitle="Sorry, an error orcurred."
        extra={
          <Button type="primary" onClick={reload}>
            Reload
          </Button>
        }
      />
    </div>
  );
};

export default NotFoundPage;
