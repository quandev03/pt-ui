import { RowButton } from '@react/commons/Template/style';
import { Flex, Form } from 'antd';
import CButton, {
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';

import { useNavigate, useParams } from 'react-router-dom';
import { FC } from 'react';
import { ActionType, DateFormat } from '@react/constants/app';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate } from '@fortawesome/free-solid-svg-icons';
import { useVerifyDataC06 } from 'apps/Internal/src/modules/BusinessManagement/hooks/useVerifyDataC06';
import dayjs from 'dayjs';
import { useCreateEnterprise } from 'apps/Internal/src/modules/BusinessManagement/hooks/useCreateEnterprise';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useGetApplicationConfig } from 'apps/Internal/src/modules/BusinessManagement/hooks/useGetApplicationConfig';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import { IDType } from 'apps/Internal/src/modules/BusinessManagement/components/FormView/EnterpriseRepresentatives/type';
import { NotificationError } from '@react/commons/Notification';

type Props = {
  typeModal: ActionType;
};

const Footer: FC<Props> = ({ typeModal }) => {
  const { id } = useParams();
  const form = Form.useFormInstance();
  const isDisableButtonCheck = Form.useWatch('isDisableButtonCheck', form);
  const status = Form.useWatch('status', form);
  const navigate = useNavigate();
  const { mutate: mutateVerifyDataC06, isPending: isPendingCheckCondition } =
    useVerifyDataC06();
  const {
    mutate: mutateCreateEnterprise,
    isPending: isPendingCreateEnterprise,
  } = useCreateEnterprise();
  const { data: dataApplicationConfig } = useGetApplicationConfig({
    type: 'ENTERPRISE_PARAM',
    code: 'C06_REQUIRE',
  });
  const configDisableCheckC06 = dataApplicationConfig?.[0]?.status === 0;

  const handleCheckCondition = () => {
    form
      .validateFields([
        'representativeIdNumber',
        'representativeName',
        'representativeBirthDate',
        'representativeIdType',
        'idEkyc',
      ])
      .then((value) => {
        mutateVerifyDataC06({
          id: value.representativeIdNumber,
          name: value.representativeName,
          birthday: value.representativeBirthDate
            ? dayjs(value.representativeBirthDate).format(DateFormat.DATE_ISO)
            : '',
          document: value.representativeIdType,
          id_ekyc: value.idEkyc,
        });
      });
  };
  const handleCreateEnterprise = () => {
    form
      .validateFields([
        'contract',
        'businessLicense',
        'cardFront',
        'cardBack',
        'portrait',
        'taxCode',
        'enterpriseName',
        'phone',
        'establishmentDate',
        'contractNumber',
        'contractDate',
        'note',
        'representativeGender',
        'representativeNationality',
        'representativeIdIssueDate',
        'representativeIdIssuePlace',
        'representativePermanentAddress',
        'supervisorId',
        'amEmployeeIdList',
        'enterpriseEmail',
        'enterpriseProvince',
        'enterpriseDistrict',
        'enterprisePrecinct',
        'idExpiryDate',
        'idExpiryDateNote',
        'representativeProvince',
        'representativeDistrict',
        'representativePrecinct',
        'representativeName',
        'representativeBirthDate',
        'representativeIdType',
        'representativeIdNumber',
        'address',
        'status',
        'isChangeUploadImage',
        'isChangeContract',
        'isChangeBusinessLicense',
      ])
      .then((value) => {
        if (form.getFieldValue('representativeIdType') === IDType.CMND) {
          NotificationError(
            'Từ ngày 01/01/2025 không thể thêm mới với Giấy tờ tuỳ thân là Chứng minh nhân dân (9 số và 12 số)'
          );
          return;
        }
        if (
          !form.getFieldValue('idExpiryDate') &&
          !form.getFieldValue('idExpiryDateNote')
        ) {
          NotificationError(
            'Vui lòng điền thông tin Ngày hết hạn giấy tờ hoặc Ngày hết hạn'
          );
          return;
        }

        const payload = JSON.stringify({
          taxCode: value.taxCode,
          enterpriseName: value.enterpriseName,
          phone: value.phone,
          address: value.address,
          establishmentDate: value.establishmentDate
            ? dayjs(value.establishmentDate).format(DateFormat.DATE_ISO)
            : undefined,
          contractNumber: value.contractNumber,
          contractDate: value.contractDate
            ? dayjs(value.contractDate).format(DateFormat.DATE_ISO)
            : undefined,
          note: value.note,
          representativeGender: value.representativeGender,
          representativeNationality: value.representativeNationality,
          representativeIdIssueDate: value.representativeIdIssueDate
            ? dayjs(value.representativeIdIssueDate).format(DateFormat.DATE_ISO)
            : undefined,
          representativeIdIssuePlace: value.representativeIdIssuePlace,
          representativePermanentAddress: value.representativePermanentAddress,
          supervisorId: value.supervisorId,
          amEmployeeIdList: value.amEmployeeIdList,
          enterpriseEmail: value.enterpriseEmail,
          enterpriseProvince: value.enterpriseProvince,
          enterpriseDistrict: value.enterpriseDistrict,
          enterprisePrecinct: value.enterprisePrecinct,
          idExpiryDate: value.idExpiryDate
            ? dayjs(value.idExpiryDate).format(DateFormat.DATE_ISO)
            : undefined,
          idExpiryDateNote: value.idExpiryDateNote,
          representativeProvince: value.representativeProvince,
          representativeDistrict: value.representativeDistrict,
          representativePrecinct: value.representativePrecinct,
          name: value.representativeName,
          birthday: value.representativeBirthDate
            ? dayjs(value.representativeBirthDate).format(DateFormat.DATE_ISO)
            : '',
          document: value.representativeIdType,
          id: value.representativeIdNumber,
          status: value.status ? 1 : 0,
        });
        const isChangeUploadImage = value.isChangeUploadImage;
        mutateCreateEnterprise({
          contract: value.contract,
          businessLicense: value.businessLicense,
          front: isChangeUploadImage ? value.cardFront : undefined,
          back: isChangeUploadImage ? value.cardBack : undefined,
          portrait: isChangeUploadImage ? value.portrait : undefined,
          data: payload,
          id: typeModal === ActionType.EDIT ? id : undefined,
        });
      });
  };
  return (
    <Flex justify="end">
      <RowButton className="my-6">
        {typeModal !== ActionType.VIEW && (
          <CButton
            className="mt-1 min-w-[8.5rem]"
            icon={<FontAwesomeIcon icon={faRotate} />}
            loading={isPendingCheckCondition}
            onClick={handleCheckCondition}
            disabled={isDisableButtonCheck || configDisableCheckC06}
          >
            Kiểm tra thông tin
          </CButton>
        )}
        {typeModal === ActionType.ADD && (
          <CButtonSaveAndAdd
            className="mt-1 min-w-[8.5rem]"
            loading={isPendingCreateEnterprise}
            onClick={() => {
              form.setFieldsValue({
                saveForm: true,
              });
              handleCreateEnterprise();
            }}
            disabled={!isDisableButtonCheck}
          />
        )}
        {typeModal !== ActionType.VIEW && (
          <CButtonSave
            className="mt-1 min-w-[8.5rem]"
            loading={isPendingCreateEnterprise}
            disabled={!isDisableButtonCheck}
            onClick={() => {
              form.setFieldsValue({
                saveForm: false,
              });
              if (typeModal === ActionType.EDIT) {
                ModalConfirm({
                  message: 'Bạn có chắc chắn muốn cập nhật bản ghi không?',
                  handleConfirm: () => {
                    handleCreateEnterprise();
                  },
                });
              } else {
                handleCreateEnterprise();
              }
            }}
          />
        )}
        {typeModal === ActionType.VIEW && (
          <CButtonEdit
            disabled={status === false}
            className="mt-1 w-[8.5rem]"
            onClick={() => navigate(pathRoutes.businessManagementEdit(id))}
          />
        )}
        <CButton
          disabled={false}
          type="default"
          className="mt-1 min-w-[8.5rem]"
          onClick={() => navigate(pathRoutes.businessManagement)}
        >
          Đóng
        </CButton>
        <Form.Item label="" name="saveForm" hidden />
        <Form.Item
          label=""
          name="isDisableButtonCheck"
          hidden
          initialValue={true}
        />
      </RowButton>
    </Flex>
  );
};
export default Footer;
