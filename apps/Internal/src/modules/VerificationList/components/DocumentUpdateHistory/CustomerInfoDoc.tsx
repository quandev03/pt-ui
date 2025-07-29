import { CalendarOutlined } from '@ant-design/icons';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton from '@react/commons/Button';
import CDatePicker from '@react/commons/DatePicker';
import CInput from '@react/commons/Input';
import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import CSelect from '@react/commons/Select';
import { IFieldErrorsItem } from '@react/commons/types';
import {
  ActionType,
  ActionsTypeEnum,
  IDType,
  ImageCode,
  ImageType,
} from '@react/constants/app';
import {
  formatDateEnglishV2,
  formatDateTime,
  formatDateV2,
} from '@react/constants/moment';
import validateForm from '@react/utils/validator';
import { Form, Tooltip, Typography } from 'antd';
import { useGetImage } from 'apps/Internal/src/components/layouts/queryHooks';
import { useGetApplicationConfig } from 'apps/Internal/src/hooks/useGetApplicationConfig';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import {
  Cadastral,
  useArea,
} from 'apps/Internal/src/modules/ListOfDepartment/queryHook/useArea';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useCheckCondition } from '../../hooks/useCheckCondition';
import { IDataApproveDoc } from '../../hooks/useDetailUpdateSubdocument';
import useCensorshipStore from '../../store';
import ModalPdf from '../ModalPdf';
import ShowUploadImage from '../ShowUploadImage';
import PreviewContact from './PreviewContact';
export interface ItemImageResponses {
  createdDate: string;
  createdBy: string;
  id: number;
  subDocumentId: number;
  version: number;
  isLatestVersion: number;
  imageType: string;
  imageCode: string;
  imagePath: string;
}

export interface ItemErrorsList {
  field: string;
  code: string;
  name: string;
}

export interface ItemApproveDoc {
  id: string;
  subDocumentHistoryId: number;
  uploadDocumentDate: string;
  name: string;
  idType: string;
  idNo: string;
  idIssuePlace: string;
  idIssueDate: string;
  idIssueDateExpire: string;
  birthDate: string;
  sex: string;
  address: string;
  province: string;
  district: string;
  precinct: string;
  subDocumentImageResponses: ItemImageResponses[];
  version: number;
  errorsList: ItemErrorsList[];
  ccdvvt: string;
  idExpiryDateNote: string;
}

type Props = {
  isOld: boolean;
  dataApproveDoc?: IDataApproveDoc;
  pdfBlobUrl?: string | Blob;
  typeModal: ActionType;
};

const CustomerInfoDoc: React.FC<Props> = ({
  isOld,
  dataApproveDoc,
  pdfBlobUrl,
  typeModal,
}) => {
  const {
    isUpdateCustomerInfoDoc,
    setIsUpdateCustomerInfoDoc,
    setIsUpdateFieldNeedSignAgain,
    isUpdateFieldNeedSignAgain,
    setIsCheckConditionSuccess,
    newSignContractUrl,
    checkConditionErrors,
    isCheckConditionSuccess,
  } = useCensorshipStore();

  const form = Form.useFormInstance();
  const listRoles = useRolesByRouter();
  const keyMap = isOld ? 'old' : 'new';
  const {
    isPending: loadingProvinces,
    data: optionsProvinces,
    mutate: getMutateProvinces,
  } = useArea();
  const {
    isPending: loadingDistrict,
    data: optionsDistrict,
    mutate: getMutateDistrict,
  } = useArea();
  const {
    isPending: loadingWard,
    data: optionsWard,
    mutate: getMutateWard,
  } = useArea();

  const isDisableSimple = useMemo(() => {
    if (isOld || typeModal === ActionType.VIEW) return true;
    return false;
  }, [isOld, typeModal]);
  const isDisableByNotPermission = useMemo(() => {
    return !includes(listRoles, ActionsTypeEnum.UPDATE_FULL);
  }, [listRoles]);

  useEffect(() => {
    getMutateProvinces('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (dataApproveDoc?.province) {
      const areaId = optionsProvinces?.filter(
        (item: Cadastral) => item.areaCode === dataApproveDoc?.province
      )[0]?.id;
      if (!areaId) return;
      getMutateDistrict(areaId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsProvinces, dataApproveDoc?.province]);

  useEffect(() => {
    if (dataApproveDoc?.district) {
      const areaId = optionsDistrict?.filter(
        (item: Cadastral) => item.areaCode === dataApproveDoc?.district
      )[0]?.id;
      if (!areaId) return;
      getMutateWard(areaId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsDistrict, dataApproveDoc?.district]);

  const { data: dataApplicationConfig, isLoading: isLoadingIdType } =
    useGetApplicationConfig('ID_TYPE');
  const { data: dataApplicationConfigSex, isLoading: isLoadingSex } =
    useGetApplicationConfig('SEX');

  useEffect(() => {
    if (dataApproveDoc) {
      form.setFields([
        {
          name: [keyMap, 'name'],
          value: dataApproveDoc?.name,
        },
        {
          name: [keyMap, 'idType'],
          value: dataApproveDoc?.idType,
        },
        {
          name: [keyMap, 'idNo'],
          value: dataApproveDoc?.idNo,
        },
        {
          name: [keyMap, 'idIssuePlace'],
          value: dataApproveDoc?.idIssuePlace,
        },
        {
          name: [keyMap, 'idIssueDate'],
          value: dataApproveDoc?.idIssueDate
            ? dayjs(dataApproveDoc?.idIssueDate)
            : undefined,
        },
        {
          name: [keyMap, 'idIssueDateExpire'],
          value: dataApproveDoc?.idExpireDate
            ? dayjs(dataApproveDoc?.idExpireDate)
            : undefined,
        },
        {
          name: [keyMap, 'birthDate'],
          value: dataApproveDoc?.birthDate
            ? dayjs(dataApproveDoc?.birthDate)
            : undefined,
        },
        {
          name: [keyMap, 'sex'],
          value: dataApproveDoc?.sex,
        },
        {
          name: [keyMap, 'address'],
          value: dataApproveDoc?.address,
        },
        {
          name: [keyMap, 'province'],
          value: dataApproveDoc?.province,
        },
        {
          name: [keyMap, 'district'],
          value: dataApproveDoc?.district,
        },
        {
          name: [keyMap, 'precinct'],
          value: dataApproveDoc?.precinct,
        },
        {
          name: [keyMap, 'ccdvvt'],
          value: dataApproveDoc?.ccdvvt,
        },
        {
          name: [keyMap, 'uploadDocumentDate'],
          value: dataApproveDoc?.uploadContractDate
            ? dayjs(dataApproveDoc?.uploadContractDate)
            : undefined,
        },
        {
          name: [keyMap, 'idExpiryDateNote'],
          value: dataApproveDoc?.idIssueDateNote,
        },
      ]);
    }
  }, [dataApproveDoc]);

  const portraitImage = useMemo(() => {
    const result = dataApproveDoc?.imageList?.filter(
      (item) =>
        item.imageType === ImageType.CCCD &&
        (item.imageCode === ImageCode.PORTRAIT ||
          item.imageCode === ImageCode.INCLINE_PORTRAIT)
    )?.[0];
    return {
      urlImage: result?.imagePath,
      contentWatermark: `${dayjs(result?.createdDate).format(formatDateTime)}`,
    };
  }, [dataApproveDoc]);
  const idFrontImage = useMemo(() => {
    const result = dataApproveDoc?.imageList?.filter(
      (item) =>
        item.imageType === ImageType.CCCD && item.imageCode === ImageCode.FRONT
    )?.[0];
    return {
      urlImage: result?.imagePath,
      contentWatermark: `${dayjs(result?.createdDate).format(formatDateTime)}`,
    };
  }, [dataApproveDoc]);

  const idBackImage = useMemo(() => {
    const result = dataApproveDoc?.imageList?.filter(
      (item) =>
        item.imageType === ImageType.CCCD && item.imageCode === ImageCode.BACK
    )?.[0];
    return {
      urlImage: result?.imagePath,
      contentWatermark: `${dayjs(result?.createdDate).format(formatDateTime)}`,
    };
  }, [dataApproveDoc]);

  const contractImage = useMemo(() => {
    const result = dataApproveDoc?.imageList?.filter(
      (item) => item.imageType === ImageType.HD
    )?.[0];
    return {
      urlImage:
        !isOld && newSignContractUrl ? newSignContractUrl : result?.imagePath,
      contentWatermark: `${dayjs(result?.createdDate).format(formatDateTime)}`,
    };
  }, [dataApproveDoc, newSignContractUrl]);
  console.log('🚀 ~ contractImage:', contractImage);
  const [isOpenPdfND13, setIsOpenPdfND13] = useState<boolean>(false);
  const [isOpenCommitment, setIsOpenCommitment] = useState<boolean>(false);

  const fileCommitment = useMemo(() => {
    const result = dataApproveDoc?.imageList?.filter(
      (item) => item.imageType === ImageType.HD_COMMITMENT
    )?.[0];
    return result?.imagePath;
  }, [dataApproveDoc]);

  const { data: pdfBlobUrlCommitment } = useGetImage(fileCommitment || '');

  const handlePreviewND13 = () => {
    setIsOpenPdfND13(true);
  };

  const handlePreviewCommitment = () => {
    if (fileCommitment) {
      setIsOpenCommitment(true);
    }
  };
  const {
    mutate: checkCondition,
    error: errorCheckCondition,
    reset: resetStateCheckCondition,
    isSuccess: isSuccess,
  } = useCheckCondition(
    (errorField) => {
      console.log('🚀 ~ errorField:', errorField);
      if (errorField && errorField.length > 0) {
        const expectedErrors = [
          'Thông tin khách hàng không thỏa mãn tiêu chí số 1: Tên thuê bao dài (trên 30 ký tự)',
          'Thông tin khách hàng không thỏa mãn tiêu chí số 2: Có cùng số GTTT nhưng khác tên thuê bao',
          'Thông tin khách hàng không thỏa mãn tiêu chí số 3: Có cùng số GTTT nhưng khác ngày sinh',
        ];
        const hasOnlyExpectedErrors = errorField.every((error) =>
          expectedErrors.includes(error.detail)
        );
        if (hasOnlyExpectedErrors) {
          setIsCheckConditionSuccess(true);
          NotificationSuccess('Kiểm tra thông tin thành công');
        }
      }
    },
    () => {
      setIsCheckConditionSuccess(isSuccess);
      NotificationSuccess('Kiểm tra thông tin thành công');
    }
  );

  useEffect(() => {
    if (errorCheckCondition) {
      let element = document.querySelector('.ant-input-status-error');
      if (!element) {
        element = document.querySelector('.ant-picker-status-error');
      }
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [errorCheckCondition]);

  useEffect(() => {
    return () => {
      resetStateCheckCondition();
    };
  }, [resetStateCheckCondition]);

  const getFieldErr = useCallback(
    (field: string) => {
      // Không set lỗi cho những field có key 'old'
      if (isOld) {
        return [];
      }

      // Sử dụng lỗi từ store thay vì local state
      const listErr = checkConditionErrors
        ?.filter((item: IFieldErrorsItem) => item.field === field)
        .map((item: IFieldErrorsItem) => item.detail);

      // Nếu có lỗi từ local errorCheckCondition (từ handleCheckCondition)
      if (
        errorCheckCondition &&
        errorCheckCondition?.errors &&
        errorCheckCondition?.errors?.length > 0
      ) {
        const errorsByCheckCondition = errorCheckCondition?.errors
          ?.filter((item: IFieldErrorsItem) => item.field === field)
          .map((item: IFieldErrorsItem) => item.detail);
        return [...(listErr || []), ...(errorsByCheckCondition || [])];
      }
      return listErr || [];
    },
    [dataApproveDoc, errorCheckCondition, checkConditionErrors, isOld]
  );

  useEffect(() => {
    return () => {
      setIsUpdateCustomerInfoDoc(false);
      // Reset lỗi khi component unmount
      const { setCheckConditionErrors } = useCensorshipStore.getState();
      setCheckConditionErrors([]);
    };
  }, []);
  const handleCheckCondition = () => {
    const { new: newValues } = form.getFieldsValue();
    if (newValues.idType === IDType.CMND) {
      NotificationError(
        'Từ ngày 01/01/2025 không thể thêm mới với Giấy tờ tuỳ thân là Chứng minh nhân dân (9 số và 12 số)'
      );
      return;
    }
    checkCondition({
      address: newValues.address,
      birthday: dayjs(newValues.birthDate, formatDateV2).format(
        formatDateEnglishV2
      ),
      city: newValues.province,
      district: newValues.district,
      document: newValues.idType,
      expiry: newValues.idIssueDateExpire
        ? dayjs(newValues.idIssueDateExpire, formatDateV2).format(
            formatDateEnglishV2
          )
        : '',
      id: newValues.idNo,
      id_ekyc: newValues.idIssuePlace,
      issue_by: newValues.idIssuePlace,
      issue_date: dayjs(newValues.idIssueDate, formatDateV2).format(
        formatDateEnglishV2
      ),
      name: newValues.name,
      sex: newValues.sex,
      ward: newValues.precinct,
      idExpiryDateNote: newValues.idIssueDateExpire,
    });
  };

  const handleChangeValue = (isUpdateName = false) => {
    resetStateCheckCondition();
    setIsCheckConditionSuccess(false);
    // Reset lỗi từ store khi user thay đổi giá trị
    if (!isOld) {
      const { setCheckConditionErrors } = useCensorshipStore.getState();
      setCheckConditionErrors([]);
    }
    if (typeModal === ActionType.EDIT && !isUpdateCustomerInfoDoc) {
      setIsUpdateCustomerInfoDoc(true);
    }
    if (isUpdateName && !isUpdateFieldNeedSignAgain) {
      setIsUpdateFieldNeedSignAgain(true);
    }
  };
  const imageVideoCall = useMemo(() => {
    const result = dataApproveDoc?.imageList?.filter(
      (item) => item.imageType === ImageType.VIDEO_CALL
    )?.[0];
    return {
      urlImage: result?.imagePath,
      contentWatermark: `${dayjs(result?.createdDate).format(formatDateTime)}`,
    };
  }, [dataApproveDoc]);
  // Thêm các rules validation cho ngày sinh
  const birthDateRules = [
    validateForm.required,
    {
      validator: (_: any, value: any) => {
        if (!value) return Promise.resolve();

        const birthDate = dayjs(value);
        const today = dayjs();
        const issueDate = form.getFieldValue([keyMap, 'idIssueDate']);

        // Kiểm tra ngày sinh > ngày hiện tại
        if (birthDate.isAfter(today)) {
          return Promise.reject('Ngày sinh phải nhỏ hơn ngày hiện tại');
        }

        // Kiểm tra ngày sinh >= ngày cấp
        if (issueDate && birthDate.isAfter(issueDate)) {
          return Promise.reject('Ngày sinh phải nhỏ hơn ngày cấp');
        }

        // Kiểm tra tuổi < 14
        const age = today.diff(birthDate, 'year');
        if (age < 14) {
          return Promise.reject(
            'Khách hàng không đủ điều kiện để thực hiện kích hoạt'
          );
        }

        return Promise.resolve();
      },
    },
  ];

  // Thêm rules validation cho ngày cấp
  const issueDateRules = [
    validateForm.required,
    {
      validator: (_: any, value: any) => {
        if (!value) return Promise.resolve();

        const issueDate = dayjs(value);
        const today = dayjs();

        // Kiểm tra ngày cấp > ngày hiện tại
        if (issueDate.isAfter(today)) {
          return Promise.reject('Ngày cấp phải nhỏ hơn ngày hiện tại');
        }

        return Promise.resolve();
      },
    },
  ];
  const idIssueDateExpireRules = [
    validateForm.required,
    {
      validator: (_: any, value: any) => {
        if (!value) return Promise.resolve();
        const today = dayjs();
        const expiryDate = form.getFieldValue([keyMap, 'idIssueDateExpire']);
        // Kiểm tra thời gian lưu hồ sơ vs thời gian hết hạn
        if (expiryDate && today.isAfter(expiryDate)) {
          return Promise.reject(
            'Thời gian lưu hồ sơ nhỏ hơn hoặc bằng Thời gian hết hạn giấy tờ'
          );
        }

        return Promise.resolve();
      },
    },
  ];
  return (
    <fieldset>
      <legend>
        {isOld ? 'Thông tin trước đó' : 'Thông tin khách hàng cập nhật'}
      </legend>
      <Form.Item
        label="Loại giấy tờ"
        name={[keyMap, 'idType']}
        rules={[validateForm.required]}
      >
        <CSelect
          fieldNames={{ label: 'code', value: 'value' }}
          loading={isLoadingIdType}
          options={dataApplicationConfig}
          disabled={isDisableSimple || isDisableByNotPermission}
          placeholder="Loại giấy tờ"
          onChange={() => handleChangeValue()}
        />
      </Form.Item>
      <Form.Item
        label="Số giấy tờ"
        name={[keyMap, 'idNo']}
        rules={[validateForm.required]}
        validateStatus={
          getFieldErr(errorCheckCondition ? 'id' : 'idNo')?.length > 0
            ? 'error'
            : ''
        }
      >
        <CInput
          disabled={
            isDisableSimple ||
            isDisableByNotPermission ||
            typeModal === ActionType.EDIT
          }
          suffix={
            getFieldErr(errorCheckCondition ? 'id' : 'idNo')?.length > 0 ? (
              <Tooltip
                title={getFieldErr(errorCheckCondition ? 'id' : 'idNo')?.join(
                  '\n'
                )}
              >
                <FontAwesomeIcon
                  className="text-red-500 text-lg"
                  icon={faExclamationCircle}
                />
              </Tooltip>
            ) : null
          }
          onChange={() => handleChangeValue()}
        />
      </Form.Item>
      <Form.Item
        label="Nơi cấp"
        name={[keyMap, 'idIssuePlace']}
        rules={[validateForm.required]}
      >
        <CInput
          disabled={isDisableSimple || isDisableByNotPermission}
          onChange={() => handleChangeValue()}
          suffix={
            getFieldErr(errorCheckCondition ? 'issue_by' : 'idIssuePlace')
              ?.length > 0 ? (
              <Tooltip
                title={getFieldErr(
                  errorCheckCondition ? 'issue_by' : 'idIssuePlace'
                )?.join('\n')}
              >
                <FontAwesomeIcon
                  className="text-red-500 text-lg"
                  icon={faExclamationCircle}
                />
              </Tooltip>
            ) : null
          }
        />
      </Form.Item>
      <Form.Item
        label="Ngày cấp"
        name={[keyMap, 'idIssueDate']}
        rules={[validateForm.required, ...issueDateRules]}
      >
        <CDatePicker
          disabled={isDisableSimple || isDisableByNotPermission}
          onChange={(value) => {
            handleChangeValue();
            // Trigger lại validation của ngày sinh khi ngày cấp thay đổi
            form.validateFields([[keyMap, 'birthDate']]);
          }}
        />
      </Form.Item>
      <Form.Item
        label="Họ và tên"
        name={[keyMap, 'name']}
        rules={[validateForm.required]}
        validateStatus={getFieldErr('name')?.length > 0 ? 'error' : ''}
      >
        <CInput
          disabled={isDisableSimple || isDisableByNotPermission}
          suffix={
            getFieldErr('name')?.length > 0 ? (
              <Tooltip title={getFieldErr('name')?.join('\n')}>
                <FontAwesomeIcon
                  className="text-red-500 text-lg"
                  icon={faExclamationCircle}
                />
              </Tooltip>
            ) : null
          }
          onChange={() => handleChangeValue(true)}
        />
      </Form.Item>
      <Form.Item
        label="Giới tính"
        name={[keyMap, 'sex']}
        rules={[validateForm.required]}
      >
        <CSelect
          loading={isLoadingSex}
          fieldNames={{ label: 'name', value: 'value' }}
          options={dataApplicationConfigSex}
          disabled={isDisableSimple || isDisableByNotPermission}
          placeholder="Giới tính"
          onChange={() => handleChangeValue()}
        />
      </Form.Item>
      <Form.Item
        label="Ngày sinh"
        name={[keyMap, 'birthDate']}
        rules={[validateForm.required, ...birthDateRules]}
        validateStatus={
          getFieldErr(errorCheckCondition ? 'birthday' : 'birthDate')?.length >
          0
            ? 'error'
            : ''
        }
      >
        <CDatePicker
          disabled={isDisableSimple || isDisableByNotPermission}
          onChange={(value) => {
            handleChangeValue();
            // Trigger lại validation của ngày cấp khi ngày sinh thay đổi
            form.validateFields([[keyMap, 'idIssueDate']]);
          }}
          allowClear={
            getFieldErr(errorCheckCondition ? 'birthday' : 'birthDate')
              ?.length > 0
              ? false
              : true
          }
          suffixIcon={
            getFieldErr(errorCheckCondition ? 'birthday' : 'birthDate')
              ?.length > 0 ? (
              <span>
                <CalendarOutlined style={{ marginRight: 8 }} />
                <Tooltip
                  title={getFieldErr(
                    errorCheckCondition ? 'birthday' : 'birthDate'
                  )?.join('\n')}
                >
                  <FontAwesomeIcon
                    className="text-red-500 text-lg"
                    icon={faExclamationCircle}
                    style={{
                      pointerEvents: 'auto',
                    }}
                  />
                </Tooltip>
              </span>
            ) : (
              <CalendarOutlined />
            )
          }
        />
      </Form.Item>
      <Form.Item
        label="Địa chỉ thường trú"
        name={[keyMap, 'address']}
        rules={[validateForm.required]}
      >
        <CInput
          disabled={isDisableSimple}
          onChange={() => handleChangeValue()}
        />
      </Form.Item>
      <Form.Item
        label="Tỉnh/Thành phố"
        name={[keyMap, 'province']}
        rules={[validateForm.required]}
      >
        <CSelect
          fieldNames={{ label: 'areaName', value: 'areaCode' }}
          loading={loadingProvinces}
          disabled={isDisableSimple}
          showSearch
          optionFilterProp="children"
          filterOption={(input, options: any) =>
            (options?.areaName ?? '')
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          options={optionsProvinces}
          onChange={(value, option: any) => {
            getMutateDistrict(option?.id);
            handleChangeValue();
            form.setFields([
              {
                name: [keyMap, 'district'],
                value: undefined,
              },
              {
                name: [keyMap, 'precinct'],
                value: undefined,
              },
            ]);
          }}
        />
      </Form.Item>
      <Form.Item
        label="Quận/Huyện"
        name={[keyMap, 'district']}
        rules={[validateForm.required]}
      >
        <CSelect
          fieldNames={{ label: 'areaName', value: 'areaCode' }}
          disabled={isDisableSimple}
          showSearch
          loading={loadingDistrict}
          optionFilterProp="children"
          filterOption={(input, options: any) =>
            (options?.areaName ?? '')
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          options={optionsDistrict}
          onChange={(value, option: any) => {
            getMutateWard(option?.id);
            handleChangeValue();
            form.setFields([
              {
                name: [keyMap, 'precinct'],
                value: undefined,
              },
            ]);
          }}
        />
      </Form.Item>
      <Form.Item
        label="Phường/Xã"
        name={[keyMap, 'precinct']}
        rules={[validateForm.required]}
      >
        <CSelect
          fieldNames={{ label: 'areaName', value: 'areaCode' }}
          disabled={isDisableSimple}
          showSearch
          loading={loadingWard}
          optionFilterProp="children"
          filterOption={(input, options: any) =>
            (options?.areaName ?? '')
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          options={optionsWard}
          onChange={() => handleChangeValue()}
        />
      </Form.Item>
      <Form.Item
        label="Ngày hết hạn giấy tờ"
        name={[keyMap, 'idIssueDateExpire']}
        rules={[validateForm.required, ...idIssueDateExpireRules]}
      >
        <CDatePicker
          disabled={isDisableSimple}
          onChange={() => handleChangeValue()}
        />
      </Form.Item>
      <Form.Item label="Ngày hết hạn" name={[keyMap, 'idExpiryDateNote']}>
        <CInput
          disabled={isDisableSimple}
          onChange={() => handleChangeValue()}
        />
      </Form.Item>
      <ShowUploadImage
        label="Ảnh chân dung"
        urlImage={portraitImage?.urlImage || ''}
        name={[keyMap, 'portrait']}
        contentWatermark={portraitImage?.contentWatermark}
        isProfilePicture
      />
      <ShowUploadImage
        label="Ảnh GTTT (mặt trước)"
        urlImage={idFrontImage?.urlImage || ''}
        name={[keyMap, 'idFront']}
        contentWatermark={idFrontImage?.contentWatermark}
        isProfilePicture
      />
      <ShowUploadImage
        label="Ảnh GTTT (mặt sau)"
        urlImage={idBackImage?.urlImage || ''}
        name={[keyMap, 'idBack']}
        contentWatermark={idBackImage?.contentWatermark}
        isProfilePicture
      />
      <PreviewContact
        label="BBXN/ Hợp đồng"
        urlImage={contractImage?.urlImage || ''}
        name={[keyMap, 'contract']}
        contentWatermark={''}
        isOld={isOld}
      />
      {!isOld && (
        <ShowUploadImage
          label="Ảnh video call"
          urlImage={imageVideoCall?.urlImage || ''}
          name={[keyMap, 'videoCall']}
          contentWatermark={imageVideoCall?.contentWatermark}
        />
      )}
      <Form.Item label="NĐ13" name="fileND13" rules={[validateForm.required]}>
        <div className="flex justify-between">
          {pdfBlobUrl ? (
            <Typography.Link
              underline
              target="_blank"
              onClick={handlePreviewND13}
            >
              Biên_bản_xác_nhận_NĐ13
            </Typography.Link>
          ) : null}
        </div>
      </Form.Item>
      {!isOld && (
        <>
          <Form.Item
            label="Bản cam kết"
            name="fileND13"
            rules={[validateForm.required]}
          >
            {fileCommitment ? (
              <Typography.Link
                underline
                target="_blank"
                onClick={handlePreviewCommitment}
              >
                Bản cam kết
              </Typography.Link>
            ) : null}
          </Form.Item>
          {typeModal === ActionType.EDIT && !isDisableByNotPermission && (
            <div className="flex justify-center">
              <CButton
                disabled={!isUpdateCustomerInfoDoc || isCheckConditionSuccess}
                onClick={handleCheckCondition}
              >
                Kiểm tra thông tin
              </CButton>
            </div>
          )}
        </>
      )}
      <Form.Item name={[keyMap, 'ccdvvt']} hidden>
        <CInput />
      </Form.Item>
      <Form.Item name={['contractId']} hidden>
        <CInput />
      </Form.Item>
      <ModalPdf
        isOpen={isOpenPdfND13}
        setIsOpen={setIsOpenPdfND13}
        isSigned={false}
        pdfUrl={(pdfBlobUrl as any)?.url}
        title="Biên bản xác nhận"
      />
      <ModalPdf
        isOpen={isOpenCommitment}
        setIsOpen={setIsOpenCommitment}
        isSigned={false}
        pdfUrl={(pdfBlobUrlCommitment as any)?.url}
        title="Bản cam kết"
      />
    </fieldset>
  );
};
export default memo(CustomerInfoDoc);
