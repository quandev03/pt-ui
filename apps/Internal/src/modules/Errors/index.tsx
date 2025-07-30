import { AnyElement } from '@vissoft-react/common';
import { Button, Result } from 'antd';
import { memo } from 'react';
import { Link, Navigate, useNavigate, useRouteError } from 'react-router-dom';
import { pathRoutes } from '../../routers/url';
import useConfigAppStore from '../Layouts/stores';

export const ErrorPage = memo(() => {
  const error: AnyElement = useRouteError();
  const { isAuthenticated } = useConfigAppStore();
  if (!isAuthenticated) {
    return <Navigate to={pathRoutes.login as string} replace />;
  }

  return (
    <Result
      status="500"
      title="500"
      subTitle={error?.statusText || error?.message}
      extra={
        <Button type="primary">
          <Link to={pathRoutes.welcome as string}>Home</Link>
        </Button>
      }
    />
  );
});

export const NotFoundPage = memo(() => {
  const navigate = useNavigate();

  const handleClickBack = () => {
    navigate(-1);
  };

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
});
