import { IModeAction, useActionMode } from '@vissoft-react/common';
import { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const useLogicActionUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const actionMode = useActionMode();

  const Title = useMemo(() => {
    switch (actionMode) {
      case IModeAction.READ:
        return 'Xem chi tiết book GD eSIM miễn phí';
      case IModeAction.CREATE:
        return 'Book eSIM miễn phí';
      default:
        return 'Tạo tài khoản nhân sự';
    }
  }, [actionMode]);

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);
  return {
    Title,
    actionMode,
    handleClose,
  };
};
