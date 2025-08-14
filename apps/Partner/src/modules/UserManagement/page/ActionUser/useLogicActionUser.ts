import {
  IModeAction,
  ModalConfirm,
  StatusEnum,
  cleanUpPhoneNumber,
  cleanUpString,
  setFieldError,
  useActionMode,
} from '@vissoft-react/common';
import { Form } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { IRoleItem } from '../../../../types';
import {
  useGetAllRole,
  useSupportAddUser,
  useSupportGetUser,
  useSupportUpdateUser,
} from '../../hooks';
import { IFormUser } from '../../types';
import { useGetAgencyOptions } from '../../../../../src/hooks/useGetAgencyOptions';

export const useLogicActionUser = () => {
  const [isSubmitBack, setIsSubmitBack] = useState(false);
  const navigate = useNavigate();
  const pathname = useLocation();
  const [form] = Form.useForm();
  const { id } = useParams();
  const [roleInActive, setRoleInActive] = useState<IRoleItem[]>([]);
  const actionMode = useActionMode();
  const { data: agencyOptions = [] } = useGetAgencyOptions({ status: '1' });
  const {
    mutate: getUserAction,
    isPending: loadingGetUser,
    data: userDetail,
  } = useSupportGetUser((user) => {
    form.setFieldsValue({
      ...user,
      roleIds: user.roles.map((item) => item.id),
      groupIds: user.groups.map((item) => item.id),
      status:
        user?.status === StatusEnum.ACTIVE
          ? StatusEnum.ACTIVE
          : StatusEnum.INACTIVE,
    });
    setRoleInActive(user.roles.filter((item) => !item.status));
  });

  useEffect(() => {
    if (id) {
      getUserAction(id);
    } else {
      form.setFieldsValue({ status: true });
    }
  }, [form, getUserAction, id, pathname]);

  const { data: listRole = [] } = useGetAllRole();
  const optionListRole = useMemo(() => {
    if (!listRole) {
      return [];
    }
    const options = listRole
      .filter((item) => item.status)
      .map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
    if (actionMode === IModeAction.CREATE) {
      return options;
    }
    if (actionMode === IModeAction.UPDATE) {
      roleInActive.forEach((item) => {
        options.unshift({
          label: `${item.name} (Ngưng hoạt động)`,
          value: item.id,
        });
      });
    }
    roleInActive.forEach((item) => {
      if (!item.status) {
        options.unshift({
          label: `${item.name} (Ngưng hoạt động)`,
          value: item.id,
        });
      }
    });
    return options;
  }, [listRole, actionMode, roleInActive]);

  const { mutate: createUser, isPending: loadingAdd } = useSupportAddUser(
    () => {
      if (isSubmitBack) {
        handleClose();
      } else {
        form.resetFields();
        form.setFieldValue('status', 1);
      }
    },
    (e) => {
      setFieldError(form, e);
    }
  );
  const { mutate: updateUser, isPending: loadingUpdate } = useSupportUpdateUser(
    () => {
      navigate(-1);
    },
    (e) => {
      setFieldError(form, e);
    }
  );

  const Title = useMemo(() => {
    switch (actionMode) {
      case IModeAction.READ:
        return 'Xem chi tiết user đại lý';
      case IModeAction.CREATE:
        return 'Tạo user đại lý';
      case IModeAction.UPDATE:
        return 'Chỉnh sửa user đại lý';
      default:
        return 'Tạo user đại lý';
    }
  }, [actionMode]);

  const handleFinish = useCallback(
    (values: IFormUser) => {
      const data: IFormUser = {
        ...values,
        id: actionMode === IModeAction.UPDATE ? id : undefined,
        status: values?.status ? 1 : 0,
        fullname: cleanUpString(values.fullname),
        username: cleanUpString(values.username),
        phoneNumber: values.phoneNumber
          ? cleanUpPhoneNumber(values.phoneNumber)
          : undefined,
        roleIds: values.roleIds,
      };
      if (actionMode === IModeAction.CREATE) {
        createUser(data);
      } else if (actionMode === IModeAction.UPDATE) {
        ModalConfirm({
          title: 'Xác nhận',
          message: 'Bạn có chắc chắn muốn cập nhật không?',
          handleConfirm: () => {
            updateUser(data);
          },
        });
      }
    },
    [actionMode, createUser, id, updateUser]
  );

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);
  return {
    form,
    loadingGetUser,
    userDetail,
    optionListRole,
    loadingAdd,
    loadingUpdate,
    handleFinish,
    handleClose,
    Title,
    actionMode,
    setIsSubmitBack,
    roleInActive,
    setRoleInActive,
    agencyOptions,
  };
};
