import { Col, Flex, Form, Row } from 'antd';
import validateForm from '@react/utils/validator';
import {
  Button,
  CDatePicker,
  CInput,
  CSelect,
} from '../../../../../../commons/src/lib/commons';
import UploadImage from './UploadImage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import CadastralSelect from './Cadastral';
import { useActiveSubscriptStore } from '../store';
import { RangePickerProps } from 'antd/es/date-picker';
import dayjs, { Dayjs } from 'dayjs';
import { ActionType } from '@react/constants/app';
import { useEffect, useState } from 'react';
import CButton from '@react/commons/Button';
import { useCheckCondition } from '../queryHook/useCheckCondition';

type Props = {
  typeModal: ActionType;
  isFromApprove: boolean;
};
const SexList = [
  {
    label: 'Nam',
    value: '1',
  },
  {
    label: 'Nữ',
    value: '0',
  },
];

const AuthCardList = [
  {
    label: 'CCCD',
    value: '1',
  },
  {
    label: 'CMND',
    value: '2',
  },
];

const ActivateInfo: React.FC<Props> = ({ typeModal, isFromApprove }) => {
  const form = Form.useFormInstance();
  const [_, setIsContractPdf] = useState(false);
  const [enableButton, setEnableButton] = useState(false);
  const {
    resetDataActivateInfo,
    isChangeValue,
    dataActivationRequest,
    setIsChangeValue,
    isSuccessCheckCondition,
    setIsSignAgainFlag,
    isRefresh,
    setIsRefresh,
    setIsShowContract,
    resetGroupStore,
  } = useActiveSubscriptStore();
  const { mutate: mutateCheckCondition, isPending: isPendingCheckCondition } =
    useCheckCondition(form, () => {
      console.log('hahhha');
    });
  const imgContainer = form.getFieldValue('requestImageResponses');
  const handleReset = () => {
    resetGroupStore();
    setIsRefresh(true);
    resetDataActivateInfo();
    setIsShowContract(false);
    setEnableButton(false);
    form.setFieldsValue({
      cardFront: undefined,
      cardBack: undefined,
      portrait: undefined,
      cardContract: undefined,
      document: '1',
      name: '',
      id: '',
      issue_by: '',
      issue_date: '',
      birthday: '',
      sex: null,
      address: '',
      city: null,
      district: null,
      ward: null,
      expiry: '',
      idExpireDateNote: '',
      idExpireDate: '',
      fileND13: '',
    });
    form.resetFields(['otp', 'signLink']);
  };

  const disabledDate: RangePickerProps['disabledDate'] = (
    startValue: Dayjs
  ) => {
    return dayjs(startValue).isAfter(dayjs().endOf('day'));
  };

  const validateBirthday = (value: string) => {
    const issueDate = form.getFieldValue('issue_date');
    if (!form.getFieldValue('birthday')) {
      return Promise.reject(new Error('Không được bỏ trống trường này'));
    }
    if (issueDate && !dayjs(issueDate).isAfter(dayjs(value))) {
      return Promise.reject(new Error('Ngày sinh phải nhỏ hơn ngày cấp'));
    }
    if (value && dayjs().subtract(14, 'year').isBefore(dayjs(value))) {
      return Promise.reject(
        new Error('Khách hàng không đủ điều kiện để thực hiện kích hoạt')
      );
    }
    return Promise.resolve();
  };

  const validateExpiry = (value: string) => {
    if (value && dayjs().isAfter(dayjs(value), 'days')) {
      return Promise.reject(
        new Error(
          'Thời gian kích hoạt phải nhỏ hơn hoặc bằng Thời gian hết hạn giấy tờ'
        )
      );
    }

    return Promise.resolve();
  };

  useEffect(() => {
    if (
      imgContainer?.[3]?.imageType === 3 &&
      imgContainer?.[3]?.imageCode === 4
    ) {
      setIsContractPdf(true);
    }
  }, [imgContainer?.[3]]);

  const handleCheckCondition = () => {
    if (
      form.getFieldValue('oldName') !== form.getFieldValue('name') ||
      dataActivationRequest.id
    ) {
      setIsSignAgainFlag(true);
    } else {
      setIsSignAgainFlag(false);
    }

    form
      .validateFields([
        'address',
        'birthday',
        'city',
        'district',
        'document',
        'expiry',
        'idExpireDateNote',
        'id',
        'id_ekyc',
        'issue_by',
        'issue_date',
        'name',
        'sex',
        'ward',
      ])
      .then((value) => {
        mutateCheckCondition({
          ...value,
          idExpiryDateNote: value.idExpireDateNote,
          birthday: dayjs(value.birthday, 'DD-MM-YYYY').format('YYYY-MM-DD'),
          expiry: value.expiry
            ? dayjs(value.expiry, 'DD-MM-YYYY').format('YYYY-MM-DD')
            : '',
          issue_date: dayjs(value.issue_date, 'DD-MM-YYYY').format(
            'YYYY-MM-DD'
          ),
        });
      });
    setEnableButton(false);
  };

  return (
    <>
      <fieldset>
        <legend>
          <span>Thông tin kích hoạt</span>
          {typeModal === ActionType.EDIT && (
            <Button
              type="text"
              icon={
                <FontAwesomeIcon
                  className="ml-2 cursor-pointer"
                  icon={faRotateRight}
                  size="lg"
                />
              }
              title="Làm mới"
              onClick={handleReset}
            />
          )}
        </legend>
        <Row gutter={12}>
          <Col span={24}>
            <Flex gap={16} justify="center">
              <div className="flex flex-col items-center w-full">
                <div className="label-required-suffix">Ảnh GTTT mặt trước</div>
                <UploadImage
                  url={
                    isRefresh
                      ? ''
                      : imgContainer?.find((item: any) => item.imageCode === 1)
                          ?.imagePath
                  }
                  label=""
                  name="cardFront"
                  typeModal={typeModal}
                  isRefresh={isRefresh}
                />
              </div>
              <div className="flex flex-col items-center w-full">
                <span className="label-required-suffix">Ảnh GTTT mặt sau</span>
                <UploadImage
                  url={
                    isRefresh
                      ? ''
                      : imgContainer?.find((item: any) => item.imageCode === 2)
                          ?.imagePath
                  }
                  label=""
                  name="cardBack"
                  typeModal={typeModal}
                  isRefresh={isRefresh}
                />
              </div>
              <div className="flex flex-col items-center w-full">
                <span className="label-required-suffix"> Ảnh chân dung</span>
                <UploadImage
                  url={
                    isRefresh
                      ? ''
                      : imgContainer?.find((item: any) => item.imageCode === 3)
                          ?.imagePath
                  }
                  label=""
                  name="portrait"
                  typeModal={typeModal}
                  isRefresh={isRefresh}
                />
              </div>
              <div className="flex flex-col items-center w-full">
                <span className="label-suffix">Ảnh hợp đồng/BBXN</span>
                <UploadImage
                  url={
                    isRefresh
                      ? ''
                      : imgContainer?.find(
                          (item: any) =>
                            item.imageType === 2 && item.imageCode === null
                        )?.imagePath
                  }
                  label=""
                  name="cardContract"
                  typeModal={typeModal}
                  isRefresh={isRefresh}
                />
              </div>
            </Flex>
          </Col>
        </Row>
      </fieldset>
      <fieldset>
        <legend>Thông tin giấy tờ tùy thân</legend>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              label="Loại giấy tờ"
              name="document"
              rules={[validateForm.required]}
            >
              <CSelect
                options={AuthCardList}
                disabled={typeModal === ActionType.VIEW}
                placeholder="Loại giấy tờ"
                allowClear={false}
                showSearch={false}
                onChange={() => {
                  setIsChangeValue(true);
                  setEnableButton(true);
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Họ và tên"
              name="name"
              rules={[validateForm.required, validateForm.maxLength(50)]}
            >
              <CInput
                disabled={typeModal === ActionType.VIEW}
                placeholder="Họ và tên"
                maxLength={50}
                onChange={() => {
                  setIsChangeValue(true);
                  setEnableButton(true);
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Số giấy tờ"
              name="id"
              rules={[validateForm.required, validateForm.maxLength(50)]}
            >
              <CInput
                disabled={typeModal === ActionType.VIEW}
                placeholder="Số giấy tờ"
                maxLength={50}
                onlyNumber
                onChange={() => {
                  setIsChangeValue(true);
                  setEnableButton(true);
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Ngày sinh"
              name="birthday"
              rules={[
                // validateForm.required,
                { validator: (_, value) => validateBirthday(value) },
              ]}
            >
              <CDatePicker
                disabled={typeModal === ActionType.VIEW}
                placeholder="Ngày sinh"
                disabledDate={disabledDate}
                onChange={() => {
                  setIsChangeValue(true);
                  setEnableButton(true);
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Ngày cấp"
              name="issue_date"
              rules={[validateForm.required]}
            >
              <CDatePicker
                disabled={typeModal === ActionType.VIEW}
                placeholder="Ngày cấp"
                disabledDate={disabledDate}
                onChange={() => {
                  form.validateFields(['birthday']);
                  setIsChangeValue(true);
                  setEnableButton(true);
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Giới tính"
              name="sex"
              rules={[validateForm.required]}
            >
              <CSelect
                options={SexList}
                disabled={typeModal === ActionType.VIEW}
                placeholder="Giới tính"
                allowClear={false}
                showSearch={false}
                onChange={() => {
                  setIsChangeValue(true);
                  setEnableButton(true);
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Nơi cấp"
              name="issue_by"
              rules={[validateForm.required, validateForm.maxLength(200)]}
            >
              <CInput
                disabled={typeModal === ActionType.VIEW}
                placeholder="Nơi cấp"
                maxLength={200}
                onChange={() => {
                  setIsChangeValue(true);
                  setEnableButton(true);
                }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Địa chỉ thường trú"
              name="address"
              rules={[validateForm.required, validateForm.maxLength(200)]}
            >
              <CInput
                disabled={typeModal === ActionType.VIEW}
                placeholder="Địa chỉ thường trú"
                maxLength={200}
                onChange={() => {
                  setIsChangeValue(true);
                  setEnableButton(true);
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Ngày hết hạn giấy tờ"
              name="expiry"
              rules={[{ validator: (_, value) => validateExpiry(value) }]}
            >
              <CDatePicker
                disabled={typeModal === ActionType.VIEW}
                placeholder="Ngày hết hạn giấy tờ"
                onChange={() => {
                  setIsChangeValue(true);
                  setEnableButton(true);
                }}
              />
            </Form.Item>
            <Form.Item
              label="Ngày hết hạn"
              name="idExpireDateNote"
              rules={[validateForm.maxLength(50)]}
            >
              <CInput
                disabled={typeModal === ActionType.VIEW}
                placeholder="Ngày hết hạn"
                maxLength={50}
                onChange={() => {
                  setIsChangeValue(true);
                  setEnableButton(true);
                }}
              />
            </Form.Item>
            {!isFromApprove && (
              <Form.Item
                label="Trạng thái tiền kiểm"
                // name="approveStatus"
                rules={[validateForm.maxLength(50)]}
              >
                <CInput
                  disabled={true}
                  value={
                    form.getFieldValue('approveStatus') === 0
                      ? 'Chờ duyệt'
                      : form.getFieldValue('approveStatus') === 1
                      ? 'Đã duyệt'
                      : form.getFieldValue('approveStatus') === 2
                      ? 'Từ chối'
                      : ' Hủy yêu cầu kích hoạt'
                  }
                  maxLength={50}
                />
              </Form.Item>
            )}
          </Col>
          <Col span={12}>
            <CadastralSelect
              // col={<Col span={12} />}
              required={true}
              formName={{
                province: 'city',
                district: 'district',
                village: 'ward',
              }}
              typeModal={typeModal}
            />
          </Col>
          {!isFromApprove && (
            <Col span={12}>
              <Form.Item
                label="Lí do từ chối"
                name="reasonReject"
                rules={[validateForm.maxLength(50)]}
              >
                <CInput disabled={true} placeholder="" maxLength={50} />
              </Form.Item>
            </Col>
          )}
          <Col span={12} />
        </Row>
        {typeModal === ActionType.EDIT && (
          <div className="flex justify-center">
            <CButton
              disabled={
                (!isChangeValue && !enableButton) ||
                (!enableButton && isSuccessCheckCondition)
              }
              loading={isPendingCheckCondition}
              onClick={handleCheckCondition}
            >
              Kiểm tra thông tin
            </CButton>
          </div>
        )}
      </fieldset>
    </>
  );
};

export default ActivateInfo;
