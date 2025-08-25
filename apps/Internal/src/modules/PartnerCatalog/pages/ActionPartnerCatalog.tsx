import {
  CButtonClose,
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
  formatDateEnglishV2,
  IFieldErrorsItem,
  IModeAction,
  ModalConfirm,
  Show,
  StatusEnum,
  TitleHeader,
  useActionMode,
  usePermissions,
} from '@vissoft-react/common';
import { Form, Spin } from 'antd';
import { pathRoutes } from 'apps/Internal/src/routers';
import dayjs from 'dayjs';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useConfigAppStore from '../../Layouts/stores';
import PartnerInfor from '../components/PartnerInfor';
import {
  useCreatePartner,
  useGetOrganizationPartnerDetail,
  useUpdatePartner,
} from '../hook';
import usePartnerStore from '../stores';
import { IFormData, IPartner, IPayloadPartner } from '../types';

const scrollToFirstError = () => {
  const firstErrorField = document.querySelector('.ant-form-item-has-error');
  if (firstErrorField) {
    firstErrorField.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
};
type Props = {
  isEnabledApproval?: boolean;
};

export const ActionPartnerCatalog: FC<Props> = ({ isEnabledApproval }) => {
  const actionMode = useActionMode();
  const { pathname } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const [isSubmitBack, setIsSubmitBack] = useState(false);
  const { setPartnerDetail, resetOrderStore } = usePartnerStore();
  const [form] = Form.useForm();

  const setFieldError = useCallback(
    (fieldErrors: IFieldErrorsItem[]) => {
      form.setFields(
        fieldErrors.map((item: IFieldErrorsItem) => ({
          name: item.field === 'code' ? 'orgCode' : item.field,
          errors: [item.detail],
        }))
      );
      setTimeout(() => {
        scrollToFirstError();
      }, 0);
    },
    [form]
  );

  const { mutate: updatePartner, isPending: loadingUpdate } = useUpdatePartner(
    () => {
      navigate(-1);
    },
    setFieldError
  );

  const { mutate: getOrganizationPartnerDetail, isPending: loadingInfor } =
    useGetOrganizationPartnerDetail((data) => {
      setPartnerDetail(data);
      const {
        address,
        orgCode,
        orgName,
        taxCode,
        phone,
        orgDescription,
        representative,
        status,
        parentCode,
        provinceCode,
        employeeCode,
      } = data;
      form.setFieldsValue({
        address,
        orgCode,
        orgName,
        taxCode,
        phone,
        orgDescription,
        representative,
        status: status === StatusEnum.ACTIVE ? 'Hoạt động' : 'Không hoạt động',
        parentCode,
        provinceCode,
        employeeCode,
      });
    });

  useEffect(() => {
    if (id) {
      getOrganizationPartnerDetail(id);
    } else {
      resetOrderStore();
    }
  }, [id, pathname]);
  const Title = useMemo(() => {
    switch (actionMode) {
      case IModeAction.READ:
        return 'Xem chi tiết đối tác';
      case IModeAction.CREATE:
        return 'Tạo đối tác';
      case IModeAction.UPDATE:
        return 'Chỉnh sửa đối tác';
      default:
        return 'Tạo đối tác';
    }
  }, [actionMode]);

  useEffect(() => {
    return () => {
      setPartnerDetail(undefined);
    };
  }, [actionMode, form]);

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const { mutate: createPartner, isPending: loadingCreate } = useCreatePartner(
    () => {
      if (isSubmitBack) {
        navigate(-1);
      } else {
        form.resetFields();
      }
    },
    setFieldError
  );

  const handleFinish = (values: IPartner) => {
    const errors = form.getFieldsError();
    const hasError = errors.some((item) => item.errors.length > 0);
    if (hasError) {
      return;
    }
    const {
      address,
      orgCode,
      orgName,
      taxCode,
      phone,
      orgDescription,
      representative,
      status,
      provinceCode,
      parentCode,
      employeeCode,
    } = values;

    const payload: IPayloadPartner = {
      id: id,
      organizationUnitDTO: {
        id: id,
        orgCode,
        orgName,
        orgDescription,
        taxCode,
        phone,
        address,
        representative,
        status: status === 'Hoạt động' ? 1 : 0,
        provinceCode,
        parentCode,
        employeeCode,
      },
    };
    if (actionMode === IModeAction.CREATE) {
      createPartner(payload);
    } else {
      ModalConfirm({
        title: 'Xác nhận',
        message: 'Bạn có chắc chắn muốn cập nhật không?',
        handleConfirm: () => {
          updatePartner(payload);
        },
      });
    }
  };
  return (
    <div className="flex flex-col w-full h-full mb-7 ">
      <TitleHeader>{Title}</TitleHeader>
      <Spin spinning={loadingInfor}>
        <Form
          form={form}
          labelCol={{ flex: '150px' }}
          labelWrap
          validateTrigger={['onSubmit']}
          onFinish={handleFinish}
          initialValues={{
            orgSubType: '0',
            orgPartnerType: '0',
          }}
          labelAlign="left"
          onFinishFailed={scrollToFirstError}
          colon={false}
        >
          <div className="flex flex-col gap-[30px]">
            <div className="bg-white !p-5 rounded-md flex flex-col gap-6">
              <PartnerInfor />
            </div>

            <Show>
              <Show.When isTrue={!isEnabledApproval}>
                <div className="flex flex-wrap justify-end gap-4 mb-16">
                  {actionMode === IModeAction.CREATE && (
                    <CButtonSaveAndAdd
                      loading={loadingCreate || loadingUpdate}
                      onClick={() => {
                        form.validateFields().then(() => {
                          setIsSubmitBack(false);
                          form.submit();
                        });
                      }}
                    />
                  )}
                  {actionMode !== IModeAction.READ && (
                    <CButtonSave
                      loading={loadingCreate || loadingUpdate}
                      onClick={() => {
                        form.validateFields().then(() => {
                          setIsSubmitBack(true);
                          form.submit();
                        });
                      }}
                    />
                  )}
                  {actionMode === IModeAction.READ && permission.canUpdate && (
                    <CButtonEdit
                      onClick={() => {
                        navigate(pathRoutes.partnerCatalogEdit(id));
                      }}
                    />
                  )}
                  <CButtonClose onClick={handleClose} />
                </div>
              </Show.When>
            </Show>
          </div>
        </Form>
      </Spin>
    </div>
  );
};
