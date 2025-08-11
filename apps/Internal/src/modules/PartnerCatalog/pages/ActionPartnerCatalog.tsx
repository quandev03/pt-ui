import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Address from '../components/Address';
import PartnerInfor from '../components/PartnerInfor';
import RepresentativeInformation from '../components/RepresentativeInformation';
import {
  useCreatePartner,
  useGetOrganizationPartnerDetail,
  useUpdatePartner,
} from '../queryHooks';
import usePartnerStore from '../stores';
import { IFormData, IPayloadPartner } from '../types';
import {
  ActionsTypeEnum,
  CButtonClose,
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
  formatDateEnglishV2,
  IFieldErrorsItem,
  IModeAction,
  ModalConfirm,
  Show,
  TitleHeader,
  useActionMode,
} from '@vissoft-react/common';
import { Form, Spin } from 'antd';
import { pathRoutes } from 'apps/Internal/src/routers';

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
  const actionByRole = useRolesByRouter();
  const [isSubmitBack, setIsSubmitBack] = useState(false);
  const { setPartnerDetail, partnerDetail, resetOrderStore } =
    usePartnerStore();
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
    (data) => {
      navigate(-1);
    },
    setFieldError
  );

  const { mutate: getOrganizationPartnerDetail, isPending: loadingInfor } =
    useGetOrganizationPartnerDetail((data) => {
      setPartnerDetail(data);
      const {
        address,
        orgSubType,
        orgPartnerType,
        orgCode,
        orgName,
        contractNo,
        taxCode,
        contractDate,
        email,
        orgBankAccountNo,
        phone,
        businessLicenseAddress,
        orgDescription,
        deliveryInfos,
      } = data;
      form.setFieldsValue({
        address,
        orgSubType,
        orgPartnerType,
        orgCode,
        orgName,
        contractNo,
        taxCode,
        email,
        orgBankAccountNo,
        phone,
        businessLicenseAddress,
        orgDescription,
        deliveryInfos,
        contractDate: dayjs(contractDate, formatDateEnglishV2),
      });
      if (data.deliveryInfos) {
        const {
          consigneeName,
          idNo,
          idPlace,
          idDate,
          gender,
          dateOfBirth,
          passportNo,
          phone,
          email,
          orgTitle,
          provinceCode,
          districtCode,
          wardCode,
          consigneeAddress,
          address,
        } = data.deliveryInfos[0];
        form.setFieldsValue({
          consigneeName,
          idNo,
          idPlace,
          gender,
          passportNo,
          orgTitle,
          provinceCode,
          districtCode,
          wardCode,
          address,
          consigneeAddress,
          dateOfBirth: dateOfBirth ? dayjs(dateOfBirth) : null,
          idDate: idDate ? dayjs(idDate) : null,
          phoneOrganizationDeliveryInfoDTO: phone,
          emailOrganizationDeliveryInfoDTO: email,
        });
      }
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
    if (actionMode === IModeAction.CREATE) {
      form.setFieldsValue({
        orgId: 'VNSKY',
        paymentMethod: 3,
        shippingMethod: 1,
      });
    }
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

  const handleFinish = (values: IFormData) => {
    const errors = form.getFieldsError();
    const hasError = errors.some((item) => item.errors.length > 0);
    if (hasError) {
      return;
    }

    const {
      address,
      provinceCode,
      districtCode,
      wardCode,
      contractFile,
      businessLicenseFile,
      orgSubType,
      orgPartnerType,
      orgCode,
      orgName,
      contractNo,
      taxCode,
      contractDate,
      email,
      orgBankAccountNo,
      phone,
      businessLicenseAddress,
      orgDescription,
      idCardFrontSite,
      idCardBackSite,
      portrait,
      consigneeName,
      idNo,
      idPlace,
      idDate,
      gender,
      dateOfBirth,
      passportNo,
      phoneOrganizationDeliveryInfoDTO,
      emailOrganizationDeliveryInfoDTO,
      orgTitle,
      consigneeAddress,
    } = values;

    const payload: IPayloadPartner = {
      id: id,
      organizationUnitDTO: {
        clientId: partnerDetail?.clientId,
        id: id,
        orgCode,
        orgName,
        orgType: 'PARTNER',
        orgSubType,
        orgDescription,
        status: partnerDetail?.status ?? 0,
        approvalStatus: partnerDetail?.approvalStatus ?? 1,
        taxCode,
        contractNo,
        contractDate: dayjs(contractDate).format(formatDateEnglishV2),
        phone,
        email,
        orgPartnerType,
        orgBankAccountNo,
        businessLicenseAddress,
        businessLicenseFileUrl: partnerDetail?.businessLicenseFileUrl,
        contractNoFileUrl: partnerDetail?.contractNoFileUrl,
      },
      organizationDeliveryInfoDTO: {
        orgId: partnerDetail?.id,
        id:
          partnerDetail?.deliveryInfos &&
          partnerDetail?.deliveryInfos.length > 0
            ? partnerDetail?.deliveryInfos[0].id
            : undefined,
        consigneeName,
        idNo,
        idPlace,
        idDate,
        gender,
        dateOfBirth: dateOfBirth
          ? dayjs(dateOfBirth).format(formatDateEnglishV2)
          : null,
        passportNo,
        phone: phoneOrganizationDeliveryInfoDTO,
        email: emailOrganizationDeliveryInfoDTO,
        orgTitle,
        provinceCode,
        districtCode,
        wardCode,
        consigneeAddress,
        address,
        idCardFrontSiteFileUrl:
          partnerDetail?.deliveryInfos &&
          partnerDetail?.deliveryInfos.length > 0
            ? partnerDetail?.deliveryInfos[0].idCardFrontSiteFileUrl
            : undefined,
        idCardBackSiteFileUrl:
          partnerDetail?.deliveryInfos &&
          partnerDetail?.deliveryInfos.length > 0
            ? partnerDetail?.deliveryInfos[0].idCardBackSiteFileUrl
            : undefined,
        multiFileUrl:
          partnerDetail?.deliveryInfos &&
          partnerDetail?.deliveryInfos.length > 0
            ? partnerDetail?.deliveryInfos[0].multiFileUrl
            : undefined,
      },
      contractFile: contractFile,
      businessLicenseFile: businessLicenseFile,
      idCardFrontSite: idCardFrontSite,
      idCardBackSite: idCardBackSite,
      portrait: portrait,
    };
    if (actionMode === IModeAction.CREATE) {
      createPartner(payload);
    } else {
      ModalConfirm({
        title: 'Xác nhận',
        message: 'Bạn có chắc chắn muốn cập nhật không?',
        handleConfirm: () => {
          console.log('payload', payload);

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
        >
          <div className="flex flex-col gap-[30px]">
            <div className="bg-white !p-5 rounded-md flex flex-col gap-6">
              <PartnerInfor />
              {/* <Address /> */}
              <RepresentativeInformation />
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
                  {actionMode === IModeAction.READ &&
                    includes(actionByRole, ActionsTypeEnum.UPDATE) && (
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
