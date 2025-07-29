import Button from '@react/commons/Button';
import { Result } from 'antd';
import { useErrorBoundary } from 'react-error-boundary';
import { Link, Navigate, useNavigate } from 'react-router-dom';

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
            <Link to={'/'}>Quay lại</Link>
          </Button>
        }
      />
    </div>
  );
};

export default ErrorPage;
