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
import { IGroups, IRoleItem } from '../../../../types';
import {
  useGetAllGroupUser,
  useGetAllRole,
  useSupportAddUser,
  useSupportGetUser,
  useSupportUpdateUser,
} from '../../hooks';
import { IFormUser } from '../../types';

export const useLogicActionUser = () => {
  const [isSubmitBack, setIsSubmitBack] = useState(false);
  const navigate = useNavigate();
  const pathname = useLocation();
  const [form] = Form.useForm();
  const loginMethod = Form.useWatch('loginMethod', form);
  const { id } = useParams();
  const [roleInActive, setRoleInActive] = useState<IRoleItem[]>([]);
  const [groupsInActive, setGroupsInActive] = useState<IGroups[]>([]);
  const actionMode = useActionMode();
  const {
    mutate: getUserAction,
    isPending: loadingGetUser,
    data: userDetail,
  } = useSupportGetUser((user) => {
    form.setFieldsValue({
      ...user,
      roleIds: user.roles.map((item) => item.id),
      groupIds: user.groups.map((item) => item.id),
      departmentIds:
        user.departments && user.departments.length > 0
          ? user.departments[0].id
          : null,
      status:
        user?.status === StatusEnum.ACTIVE
          ? StatusEnum.ACTIVE
          : StatusEnum.INACTIVE,
    });
    setRoleInActive(user.roles.filter((item) => !item.status));
    setGroupsInActive(user.groups.filter((item) => !item.status));
  });

  const { data: groupUser } = useGetAllGroupUser();

  const optionGroups = useMemo(() => {
    if (!groupUser) return [];
    const options = groupUser
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
      groupsInActive.forEach((item) => {
        options.unshift({
          label: `${item.name} (Ngưng hoạt động)`,
          value: item.id,
        });
      });
    }
    groupsInActive.forEach((item) => {
      if (!item.status) {
        options.unshift({
          label: `${item.name} (Ngưng hoạt động)`,
          value: item.id,
        });
      }
    });
    return options;
  }, [groupUser, actionMode, groupsInActive]);

  useEffect(() => {
    if (id) {
      getUserAction(id);
    } else {
      form.setFieldsValue({ status: true });
    }
  }, [form, getUserAction, id, pathname]);

  const { data: listRole = [] } = useGetAllRole({ isPartner: false });
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
        return 'Xem chi tiết tài khoản nhân sự';
      case IModeAction.CREATE:
        return 'Tạo tài khoản nhân sự';
      case IModeAction.UPDATE:
        return 'Chỉnh sửa tài khoản nhân sự';
      default:
        return 'Tạo tài khoản nhân sự';
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
        groupIds: values.groupIds ?? [],
        departmentIds: (values.departmentIds as string)
          ? ([values.departmentIds] as string[])
          : [],
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
    optionGroups,
    optionListRole,
    loadingAdd,
    loadingUpdate,
    Title,
    actionMode,
    loginMethod,
    roleInActive,
    groupsInActive,
    setRoleInActive,
    setGroupsInActive,
    handleFinish,
    handleClose,
    setIsSubmitBack,
  };
};
