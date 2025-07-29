import { CalendarOutlined } from '@ant-design/icons';
import {
  faExclamationCircle,
  faRotateRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton from '@react/commons/Button';
import CDatePicker from '@react/commons/DatePicker';
import CInput from '@react/commons/Input';
import {
  NotificationError,
  NotificationWarning,
} from '@react/commons/Notification';
import CSelect from '@react/commons/Select';
import { IFieldErrorsItem } from '@react/commons/types';
import { ActionsTypeEnum } from '@react/constants/app';
import { IdTypeOptions } from '@react/constants/combobox';
import {
  formatDate,
  formatDateTime,
  formatDateV2,
} from '@react/constants/moment';
import validateForm from '@react/utils/validator';
import { Col, Flex, Form, Row, Tooltip } from 'antd';
import { useGetApplicationConfig } from 'apps/Internal/src/hooks/useGetApplicationConfig';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import dayjs, { Dayjs } from 'dayjs';
import { includes } from 'lodash';
import { useEffect, useState } from 'react';
import { useCheckInfo } from '../hooks/useCheckInfo';
import useCensorshipStore from '../store';
import { IDType, ISubDocument } from '../types';
import CadastralSelect from './Cadastral';
import UploadImage from './UploadImage';

type Props = {
  isEditing: boolean;
  subDocDetail: ISubDocument | undefined;
  isView: boolean;
};
const ActivateInfo: React.FC<Props> = ({ isEditing, subDocDetail, isView }) => {
  const form = Form.useFormInstance();

  const {
    resetDataActivateInfo,
    setIsDisabledContract,
    criteriaErrList,
    isClickCheckInfo,
    setIsClickCheckInfo,
    listErr,
    setListErr,
  } = useCensorshipStore();
  const { mutate: checkInfo } = useCheckInfo(
    () => {
      setListErr([]);
    },
    (errorField) => {
      if (errorField && !isClickCheckInfo) {
        setListErr(errorField);
      }
    },
    isClickCheckInfo
  );
  useEffect(() => {
    if (subDocDetail) {
      const {
        birthday,
        issue_by,
        id,
        document,
        name,
        subDocumentId,
        sex,
        issue_date,
      } = subDocDetail;
      const payload = {
        birthday: dayjs(birthday).format(formatDate),
        issue_by,
        id,
        document,
        name,
        subDocumentId,
        sex,
        issueDate: dayjs(issue_date).format(formatDate),
      };
      checkInfo(payload);
    }
  }, [subDocDetail, checkInfo]);
  // fix bug kiem duyet
  const actionByRole = useRolesByRouter();
  const validateIssueDate = () => {
    const issueDate = form.getFieldValue('issue_date');
    if (dayjs(issueDate, formatDate).isAfter(dayjs())) {
      return Promise.reject(new Error('Ngày cấp phải nhỏ hơn ngày hiện tại'));
    }
    return Promise.resolve();
  };

  useEffect(() => {
    form.setFieldValue('isDisableCheck', true);
    form.setFieldValue('isResetImage', false);
  }, []);

  const isDisableCheck = form.getFieldValue('isDisableCheck');

  const isEnoughAge = (birth: Dayjs, today: Dayjs) => {
    const year = today.year() - birth.year();
    const month = today.month() - birth.month();
    const day = today.date() - birth.date();
    if (year < 14) {
      return false;
    }
    if (year === 14) {
      if (month < 0) {
        return false;
      }
      if (month === 0) {
        if (day < 0) {
          return false;
        }
      }
    }
    return true;
  };

  const validateBirthDate = () => {
    const birthDate = form.getFieldValue('birthday');
    const issueDate = form.getFieldValue('issue_date');
    const isEnough = isEnoughAge(birthDate, dayjs());
    if (birthDate.isAfter(dayjs())) {
      return Promise.reject(new Error('Ngày sinh phải nhỏ hơn ngày hiện tại'));
    }
    if (birthDate.isAfter(issueDate)) {
      return Promise.reject(new Error('Ngày sinh phải nhỏ hơn ngày cấp'));
    }
    if (!isEnough) {
      return Promise.reject(
        new Error('Khách hàng không đủ điều kiện để thực hiện kích hoạt')
      );
    }
    return Promise.resolve();
  };
  const handleReset = () => {
    if (!isEditing) return;
    resetDataActivateInfo();
    setIsDisabledContract(true);
    form.setFieldsValue({
      cardFront: undefined,
      cardBack: undefined,
      portrait: undefined,
      cardContract: undefined,
      isResetImage: true,
      issue_date: undefined,
      birthday: undefined,
      expiry: undefined,
      idExpireDateNote: undefined,
      document: undefined,
      name: undefined,
      id: undefined,
      issue_by: undefined,
      sex: undefined,
      address: undefined,
      nationality: undefined,
      packagePlan: undefined,
      uploadDocumentDate: undefined,
      city: undefined,
      district: undefined,
      ward: undefined,
    });
    setListErr([]);
  };
  useEffect(() => {
    if (subDocDetail) {
      const {
        issue_date,
        birthday,
        expiry,
        document,
        name,
        id,
        issue_by,
        sex,
        address,
        nationality,
        idExpireDateNote,
        packagePlan,
        uploadDocumentDate,
        createdContractDate,
        city,
        district,
        ward,
      } = subDocDetail;
      console.log(dayjs(birthday, formatDateV2).isValid());

      form.setFieldsValue({
        issue_date: dayjs(issue_date),
        birthday:
          birthday && dayjs(birthday).isValid() ? dayjs(birthday) : undefined,
        expiry: expiry && dayjs(expiry).isValid() ? dayjs(expiry) : undefined,
        idExpireDateNote,
        document,
        name,
        id,
        issue_by,
        sex,
        address,
        nationality,
        packagePlan,
        uploadDocumentDate,
        createdContractDate,
        city,
        district,
        ward,
      });
    }
  }, [subDocDetail]);

  useEffect(() => {
    if (isClickCheckInfo && criteriaErrList) {
      setListErr(criteriaErrList);
    }
  }, [criteriaErrList, subDocDetail]);
  const subscriberNameErr = listErr
    .filter((item) => item.field === 'name')
    .map((item) => item.detail);
  const docNoErr = listErr
    .filter((item) => item.field === 'id')
    .map((item) => item.detail);
  const birthDateErr = listErr
    .filter((item) => item.field === 'birthday')
    .map((item) => item.detail);
  const { data: sexOptions, isLoading: isLoadingSex } =
    useGetApplicationConfig('SEX');
  const getImageUrl = (imageType: string, imageCode: string | null) => {
    const listImg = subDocDetail?.subDocumentImageResponses || [];
    const image = listImg.find(
      (item) =>
        item.imageType === imageType &&
        item.imageCode === imageCode &&
        !item.imagePath.includes('ND13')
    );
    return image ? image.imagePath : '';
  };
  const [isContractPdf, setIsContractPdf] = useState(false);
  const frontUrl = getImageUrl('1', '1');
  const backUrl = getImageUrl('1', '2');
  const portraitUrl = getImageUrl('1', '3');
  const contractUrl = getImageUrl('2', null) || getImageUrl('3', null);
  const videoCallUrl = getImageUrl('6', '0');
  useEffect(() => {
    if (contractUrl.toLowerCase().endsWith('.pdf')) {
      setIsContractPdf(true);
    }
  }, [contractUrl]);
  const handleCheckInfo = async () => {
    if (form.getFieldValue('document') === IDType.CMND) {
      NotificationError(
        'Từ ngày 01/01/2025 không thể kích hoạt với Giấy tờ tuỳ thân là Chứng minh nhân dân (9 số và 12 số)'
      );
      return;
    }
    if (
      !form.getFieldValue('expiry') &&
      !form.getFieldValue('idExpireDateNote')
    ) {
      NotificationWarning(
        'Vui lòng điền thông tin Ngày hết hạn giấy tờ hoặc Ngày hết hạn'
      );
      return;
    }
    try {
      await form.validateFields();
      setIsClickCheckInfo(true);
      const data = {
        birthday: form.getFieldValue('birthday').format(formatDate),
        issue_by: form.getFieldValue('issue_by'),
        id: form.getFieldValue('id'),
        document: form.getFieldValue('document'),
        name: form.getFieldValue('name'),
        subDocumentId: subDocDetail?.subDocumentId,
        sex: form.getFieldValue('sex'),
        issueDate: form.getFieldValue('issue_date').format(formatDate),
      };
      checkInfo(data);
    } catch (errorInfo) {
      return;
    }
  };
  return (
    <Col span={24} className="!px-0">
      <Row gutter={16}>
        <Col span={12}>
          <fieldset className="h-[98%]">
            <legend>Thông tin giấy tờ tùy thân</legend>
            <Form.Item
              label="Loại giấy tờ"
              name="document"
              rules={[validateForm.required]}
            >
              <CSelect
                options={IdTypeOptions}
                disabled={
                  !isEditing ||
                  !includes(actionByRole, ActionsTypeEnum.UPDATE_FULL)
                }
                placeholder="Loại giấy tờ"
                showSearch={false}
              />
            </Form.Item>
            <Form.Item
              label="Họ và tên"
              name="name"
              rules={[validateForm.required, validateForm.maxLength(50)]}
            >
              <CInput
                className={
                  subscriberNameErr.length > 0 ? '!border-[#ff4d4f]' : ''
                }
                disabled={
                  !isEditing ||
                  !includes(actionByRole, ActionsTypeEnum.UPDATE_FULL)
                }
                placeholder="Họ và tên"
                maxLength={50}
                suffix={
                  subscriberNameErr.length > 0 ? (
                    <Tooltip title={subscriberNameErr.join('\n')}>
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
              label="Số giấy tờ"
              name="id"
              rules={[validateForm.required, validateForm.maxLength(50)]}
            >
              <CInput
                className={docNoErr.length > 0 ? '!border-[#ff4d4f] ' : ''}
                disabled={
                  isEditing ||
                  isView ||
                  !includes(actionByRole, ActionsTypeEnum.UPDATE_FULL)
                }
                placeholder="Số giấy tờ"
                maxLength={50}
                suffix={
                  docNoErr.length > 0 ? (
                    <Tooltip title={docNoErr.join('\n')}>
                      <FontAwesomeIcon
                        className="text-red-500 text-lg"
                        icon={faExclamationCircle}
                      />
                    </Tooltip>
                  ) : null
                }
                onlyNumber
              />
            </Form.Item>
            <Form.Item
              label="Nơi cấp"
              name="issue_by"
              rules={[validateForm.required, validateForm.maxLength(200)]}
            >
              <CInput
                disabled={
                  !isEditing ||
                  !includes(actionByRole, ActionsTypeEnum.UPDATE_FULL)
                }
                placeholder="Nơi cấp"
                maxLength={200}
              />
            </Form.Item>
            <Form.Item
              label="Ngày cấp"
              name="issue_date"
              rules={[validateForm.required, { validator: validateIssueDate }]}
            >
              <CDatePicker
                disabled={
                  !isEditing ||
                  !includes(actionByRole, ActionsTypeEnum.UPDATE_FULL)
                }
                placeholder="Ngày cấp"
              />
            </Form.Item>
            <Form.Item
              label="Ngày sinh"
              name="birthday"
              rules={[validateForm.required, { validator: validateBirthDate }]}
            >
              <CDatePicker
                className={birthDateErr.length > 0 ? '!border-[#ff4d4f]' : ''}
                disabled={
                  !isEditing ||
                  !includes(actionByRole, ActionsTypeEnum.UPDATE_FULL)
                }
                placeholder="Ngày sinh"
                allowClear={birthDateErr.length > 0 ? false : true}
                suffixIcon={
                  birthDateErr.length > 0 ? (
                    <span>
                      <CalendarOutlined style={{ marginRight: 8 }} />
                      <Tooltip title={birthDateErr.join('\n')}>
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
              label="Giới tính"
              name="sex"
              rules={[validateForm.required]}
            >
              <CSelect
                options={sexOptions}
                disabled={!isEditing}
                placeholder="Giới tính"
                loading={isLoadingSex}
                fieldNames={{ label: 'name', value: 'value' }}
                showSearch={false}
              />
            </Form.Item>
            <Form.Item
              label="Địa chỉ thường trú"
              name="address"
              rules={[validateForm.required]}
            >
              <CInput
                disabled={!isEditing}
                placeholder="Địa chỉ thường trú"
                maxLength={200}
              />
            </Form.Item>
            <CadastralSelect
              col={<Col span={24} className="!px-0" />}
              required={true}
              isEditing={isEditing}
              formName={{
                province: 'city',
                district: 'district',
                village: 'ward',
              }}
              subDocDetail={subDocDetail}
            />
            <Form.Item label="Ngày hết hạn giấy tờ" name="expiry" rules={[]}>
              <CDatePicker
                disabled={
                  !isEditing ||
                  !includes(actionByRole, ActionsTypeEnum.UPDATE_FULL)
                }
                placeholder="Ngày hết hạn giấy tờ"
              />
            </Form.Item>
            <Form.Item label="Ngày hết hạn" name="idExpireDateNote">
              <CInput
                disabled={!isEditing}
                placeholder="Thông tin ngày hết hạn"
                maxLength={50}
              />
            </Form.Item>
            <Form.Item name={'packagePlan'} hidden></Form.Item>
            <Form.Item name={'uploadDocumentDate'} hidden></Form.Item>
            <Form.Item name={'createdContractDate'} hidden></Form.Item>
            {isEditing && (
              <CButton
                className="ml-[50%] mb-3 translate-x-[-50%]"
                disabled={isDisableCheck}
                onClick={handleCheckInfo}
              >
                Kiểm tra thông tin
              </CButton>
            )}
            <Form.Item name={'isDisableCheck'} hidden></Form.Item>
          </fieldset>
        </Col>
        <Col span={12}>
          <fieldset className="h-[98%]">
            <legend>
              <span>Thông tin kích hoạt</span>
              <FontAwesomeIcon
                className="ml-2 cursor-pointer"
                icon={faRotateRight}
                onClick={handleReset}
                title="Làm mới"
              />
              <Form.Item name={'isResetImage'} hidden></Form.Item>
            </legend>
            <Row gutter={12}>
              <Col span={12}>
                <div className="flex flex-col items-center w-full">
                  <UploadImage
                    name="cardFront"
                    isEditing={isEditing}
                    label="Ảnh GTTT mặt trước"
                    imageUrl={frontUrl}
                    isProfilePicture={true}
                  />
                </div>
              </Col>
              <Col span={12}>
                <div className="flex flex-col items-center w-full">
                  <UploadImage
                    name="cardBack"
                    isEditing={isEditing}
                    label="Ảnh GTTT mặt sau"
                    imageUrl={backUrl}
                    isProfilePicture={true}
                  />
                </div>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <div className="flex flex-col items-center w-full">
                  <UploadImage
                    name="portrait"
                    isEditing={isEditing}
                    label="Ảnh chân dung"
                    imageUrl={portraitUrl}
                    isProfilePicture={true}
                  />
                </div>
              </Col>
              <Col span={12}>
                <div className="flex flex-col items-center w-full">
                  <UploadImage
                    name="cardContract"
                    isEditing={isEditing}
                    label="Ảnh hợp đồng/BBXN"
                    imageUrl={contractUrl}
                    isProfilePicture={false}
                  />
                </div>
              </Col>
              {videoCallUrl && (
                <Col span={12}>
                  <div className="flex flex-col items-center w-full">
                    <UploadImage
                      name="videoCall"
                      isEditing={false}
                      label="Ảnh video call"
                      imageUrl={videoCallUrl}
                      isProfilePicture={true}
                    />
                  </div>
                </Col>
              )}
            </Row>
            <Flex justify="center">
              <strong>{`Thời gian upload giấy tờ: ${
                subDocDetail?.uploadDocumentDate
                  ? dayjs(subDocDetail?.uploadDocumentDate).format(
                      formatDateTime
                    )
                  : ''
              }`}</strong>
            </Flex>
          </fieldset>
        </Col>
      </Row>
    </Col>
  );
};

export default ActivateInfo;
