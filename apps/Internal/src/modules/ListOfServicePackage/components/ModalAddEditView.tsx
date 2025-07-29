import { UploadOutlined } from '@ant-design/icons';
import {
  CButtonClose,
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import CCheckbox from '@react/commons/Checkbox';
import CDatePicker from '@react/commons/DatePicker';
import CInput from '@react/commons/Input';
import { NotificationError } from '@react/commons/Notification';
import CSelect from '@react/commons/Select';
import { RowButton, TitleHeader } from '@react/commons/Template/style';
import CTextArea from '@react/commons/TextArea';
import {
  ActionsTypeEnum,
  ActionType,
  DateFormat,
  ImageFileType,
} from '@react/constants/app';
import { formatDateTimeHHmm } from '@react/constants/moment';
import {
  RegSpecicalChar,
  RegSpecicalCharExceptUnderscore,
} from '@react/constants/regex';
import { MESSAGE } from '@react/utils/message';
import { Card, Col, Form, Row, Upload, Modal, Button } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { useGetImageCatalog } from 'apps/Internal/src/components/layouts/queryHooks';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useProfileTypeList } from 'apps/Internal/src/hooks/useProfileTypeList';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdd } from '../queryHook/useAdd';
import { useConnectorList } from '../queryHook/useConnectorList';
import { useEditPackage } from '../queryHook/useEdit';
import { usePckTypeList } from '../queryHook/usePckTypeList';
import { useView } from '../queryHook/useView';
import usePackageServiceStore from '../store';
import { ServicePackageItem } from '../types';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { ParamsOption } from '@react/commons/types';

type Props = {
  typeModal: ActionType;
};

const ModalAddEditView: FC<Props> = ({ typeModal }) => {
  const intl = useIntl();
  const { id } = useParams();
  const navigate = useNavigate();
  const listRoleByRouter = useRolesByRouter();
  const [form] = Form.useForm();
  const groupType = Form.useWatch('groupType', form);
  const displayStt = Form.useWatch('displayStatus', form);
  const { isValuesChanged, setIsValuesChanged, resetPackageServiceStore } =
    usePackageServiceStore();
  const { data: connectionTypeOpts = [] } = useConnectorList();
  const { data: profileTypeOpts = [] } = useProfileTypeList();
  const { data: packages = [], mutate: getPackageType } = usePckTypeList();
  const { data: packageDetail } = useView(id || '');
  const { mutate: editPackage, isPending: loadingEdit } = useEditPackage(form);
  const startDate = Form.useWatch('fromDate', form);
  const endDate = Form.useWatch('toDate', form);
  const [imageUrl, setImageUrl] = useState<string>();
  const [isChangeImage, setIsChangeImage] = useState(false);
  const [isDisablePosition, setIsDisablePosition] = useState(false);
  const [isTopSale, setIsTopSale] = useState(false);
  const groupTypeDefault = '1';
  const cycleUnitDefault = 'Tháng';
  const defaultPckValueType = '1';
  useEffect(() => {
    if (displayStt === 'false') {
      setIsDisablePosition(true);
    } else {
      setIsDisablePosition(false);
    }
  }, [displayStt]);
  const packageTypes = useMemo(() => {
    if (!packages || !groupType) return [];
    return packages;
  }, [packages, groupType]);
  const { PACKAGE_PROFILE_GROUP_TYPE = [] } =
    useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);
  const packageGroupOpts = PACKAGE_PROFILE_GROUP_TYPE;
  const onSuccess = () => {
    if (form.getFieldValue('saveForm')) {
      const regDefault = form.getFieldValue('regType');
      form.resetFields();
      form.setFieldValue('regType', regDefault);
      form.setFieldValue('groupType', groupTypeDefault);
    } else {
      navigate(-1);
    }
    setIsTopSale(false);
    setImageUrl(undefined);
  };
  const { mutate: addPackageProfile, isPending: loadingAdd } = useAdd(
    onSuccess,
    form
  );
  useEffect(() => {
    if (startDate && !endDate) {
      form.setFieldValue(
        'toDate',
        dayjs(startDate, formatDateTimeHHmm).add(1, 'hour')
      );
    }
  }, [startDate, endDate]);
  useEffect(() => {
    if (
      startDate &&
      endDate &&
      dayjs(startDate, formatDateTimeHHmm).isAfter(
        dayjs(endDate, formatDateTimeHHmm)
      )
    ) {
      form.setFields([
        {
          name: 'toDate',
          errors: ['Ngày kết thúc không được nhỏ hơn ngày bắt đầu!'],
        },
      ]);
    } else {
      form.setFields([
        {
          name: 'toDate',
          errors: [],
        },
      ]);
    }
  }, [startDate, endDate]);
  const regDefault = useMemo(() => {
    const defaultReg = connectionTypeOpts?.find((item) => item.refId === -1);
    if (defaultReg) {
      return defaultReg.value;
    }
    return '';
  }, [connectionTypeOpts]);
  useEffect(() => {
    if (typeModal === ActionType.ADD) {
      form.setFieldsValue({
        groupType: groupTypeDefault,
        cycleUnit: cycleUnitDefault,
        topSale: false,
      });
    }
  }, []);
  useEffect(() => {
    if (groupType) {
      const pckGroupId = packageGroupOpts?.filter(
        (group) => group.value === groupType
      )[0].value;
      if (!pckGroupId) return;
      getPackageType(pckGroupId + '');
    }
  }, [groupType]);
  const { data: imageBlob } = useGetImageCatalog(packageDetail?.imageUrl || '');
  useEffect(() => {
    if (typeModal !== ActionType.ADD && packageDetail && form) {
      const {
        fromDate,
        toDate,
        mobileDisplayPos,
        pcDisplayPos,
        displayStatus,
        ...res
      } = packageDetail;
      form.setFieldsValue(res);
      form.setFieldValue(
        'displayStatus',
        displayStatus === true ? 'true' : 'false'
      );
      form.setFieldValue('fromDate', fromDate ? dayjs(fromDate) : undefined);
      form.setFieldValue('toDate', toDate ? dayjs(toDate) : undefined);
      form.setFieldValue('mobileDisplayPos', mobileDisplayPos ?? '');
      form.setFieldValue('pcDisplayPos', pcDisplayPos ?? '');
      setImageUrl(imageBlob);
      setIsTopSale(packageDetail.topSale === 1 ? true : false);
    } else if (typeModal === ActionType.ADD && regDefault) {
      form.setFieldValue('regType', regDefault);
    }
  }, [form, packageDetail, regDefault, imageBlob]);
  useEffect(() => {
    if (groupType === groupTypeDefault && packageTypes) {
      const pckTypeDefault = packageTypes.filter(
        (type) => type.valueType === defaultPckValueType
      )[0]?.code;
      form.setFieldValue('pckType', pckTypeDefault);
    }
  }, [form.getFieldValue('saveForm'), packageTypes]);
  const renderTitle = () => {
    const name = ' gói cước';
    switch (typeModal) {
      case ActionType.ADD:
        return 'Tạo' + name;
      case ActionType.EDIT:
        return 'Cập nhật' + name;
      case ActionType.VIEW:
        return 'Chi tiết' + name;
      default:
        return '';
    }
  };
  const handleClose = useCallback(() => {
    form.resetFields();
    resetPackageServiceStore();
    navigate(-1);
  }, [form, navigate, resetPackageServiceStore]);

  const handleCloseModal = () => {
    handleClose();
  };
  const handleFinish = (values: ServicePackageItem) => {
    form.setFields([
      { name: 'pckCode', errors: [] },
      { name: 'apiCode', errors: [] },
      { name: 'smsCode', errors: [] },
      { name: 'smsPromCode', errors: [] },
      { name: 'activationCode', errors: [] },
      { name: 'apiPromCode', errors: [] },
      { name: 'mobileDisplayPos', errors: [] },
      { name: 'pcDisplayPos', errors: [] },
    ]);
    if (typeModal === ActionType.ADD) {
      addPackageProfile({
        file: form.getFieldValue('images')?.file ?? null,
        form: {
          ...values,
          topSale: isTopSale ? 1 : 0,
        },
      });
    } else {
      ModalConfirm({
        message: MESSAGE.G04,
        handleConfirm: () => {
          editPackage({
            file: isChangeImage ? form.getFieldValue('images')?.file : null,
            form: {
              ...values,
              topSale: isTopSale ? 1 : 0,
              status: packageDetail?.status,
            },
            id: Number(id),
          });
        },
      });
    }
  };

  const cycleUnitOptions = [
    { value: 'Giờ', label: 'Giờ' },
    { value: 'Ngày', label: 'Ngày' },
    { value: 'Tuần', label: 'Tuần' },
    { value: 'Tháng', label: 'Tháng' },
  ];
  const displayStatusOptions = [
    { value: 'true', label: 'Hiển thị' },
    { value: 'false', label: 'Không hiển thị' },
  ];
  const handleChangePKGroup = () => {
    const packageType = form.getFieldValue('pckType');
    if (packageType) {
      form.setFieldValue('pckType', '');
    }
  };
  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  const beforeUpload = async (file: RcFile) => {
    if (!ImageFileType.includes(file.type || '')) {
      form.setFields([
        {
          name: 'images',
          errors: [MESSAGE.G31],
        },
      ]);
      return;
    }
    if (file.size && file.size / 1024 / 1024 > 5) {
      NotificationError('Kích thước ảnh phải nhỏ hơn 5MB');
      return;
    }
    form.setFields([
      {
        name: 'images',
        errors: [],
      },
    ]);
    const url = await getBase64(file);
    form.setFieldValue('images', file);
    setImageUrl(url);
    setIsChangeImage(true);
    return false;
  };
  const handleDeleteImage = () => {
    setImageUrl(undefined);
    setIsChangeImage(true);
    form.setFieldValue('images', null);
    form.setFields([
      {
        name: 'images',
        errors: [],
      },
    ]);
  };
  const uploadButton = (
    <button
      className={
        'border-2 border-dashed border-cyan-600 bg-none rounded-md px-16 py-8 ' +
        (typeModal === ActionType.VIEW
          ? 'cursor-not-allowed'
          : 'cursor-pointer')
      }
      type="button"
    >
      <UploadOutlined className="text-3xl text-cyan-700" />
      <div className="mt-2 text-cyan-700">Tải file lên</div>
    </button>
  );
  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    fieldName: string,
    isRemoveSpecial = false
  ) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    const processedText = text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/\s/g, '')
      .toLocaleUpperCase();
    const result = isRemoveSpecial
      ? processedText.replace(
        fieldName === 'pckCode'
          ? RegSpecicalCharExceptUnderscore
          : RegSpecicalChar,
        ''
      )
      : processedText;
    form.setFieldValue(fieldName, result);
  };
  return (
    <>
      <TitleHeader>{renderTitle()}</TitleHeader>
      <Card>
        <strong className="text-base text-[#2C3D94]">Thông tin gói cước</strong>
        <Form
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          disabled={typeModal === ActionType.VIEW}
          colon={false}
          className="mt-4"
          onValuesChange={() => {
            if (!isValuesChanged) {
              setIsValuesChanged(true);
            }
          }}
          onFinish={handleFinish}
        >
          <Row gutter={30}>
            <Col span={12}>
              <Form.Item
                label="SKY package code"
                name="pckCode"
                rules={[
                  {
                    required: true,
                    message: MESSAGE.G06,
                  },
                ]}
              >
                <CInput
                  maxLength={20}
                  uppercase
                  preventSpace
                  preventSpecialExceptUnderscore
                  preventVietnamese
                  placeholder="SKY package code"
                  disabled={typeModal !== ActionType.ADD}
                  onPaste={(e) => handlePaste(e, 'pckCode', true)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tên gói cước"
                name="pckName"
                rules={[
                  {
                    required: true,
                    message: MESSAGE.G06,
                  },
                ]}
              >
                <CInput maxLength={100} placeholder="Tên gói cước" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={12}>
              <Form.Item
                label="Loại đấu nối"
                name="regType"
                rules={[
                  {
                    required: true,
                    message: MESSAGE.G06,
                  },
                ]}
              >
                <CSelect options={connectionTypeOpts}  />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Loại profile"
                name="profileType"
                rules={[
                  {
                    required: true,
                    message: MESSAGE.G06,
                  },
                ]}
              >
                <CSelect
                  mode="multiple"
                  options={profileTypeOpts}
                  placeholder="Loại profile"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={12}>
              <Form.Item
                label="Nhóm gói cước"
                name="groupType"
                rules={[
                  {
                    required: true,
                    message: MESSAGE.G06,
                  },
                ]}
              >
                <CSelect
                  options={packageGroupOpts}
                  onChange={handleChangePKGroup}
                  placeholder="Nhóm gói cước"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Loại gói cước"
                name="pckType"
                rules={[
                  {
                    required: true,
                    message: MESSAGE.G06,
                  },
                ]}
              >
                <CSelect
                  placeholder="Loại gói cước"
                  disabled={typeModal === ActionType.VIEW}
                  options={packageTypes?.map((t) => ({
                    label: t?.value,
                    value: t?.code,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={12}>
              <Form.Item
                label="Ngày bắt đầu"
                name="fromDate"
                rules={[{ required: true, message: MESSAGE.G06 }]}
              >
                <CDatePicker
                  showTime={{ format: 'HH:mm' }}
                  format={DateFormat.DATE_TIME_NO_SECOND}
                  className="w-full"
                  placeholder="Ngày bắt đầu"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ngày kết thúc"
                name="toDate"
                rules={[
                  { required: true, message: MESSAGE.G06 },
                  {
                    validator: (_, value) => {
                      if (!startDate || !value) {
                        return Promise.resolve();
                      }
                      if (dayjs(startDate).isAfter(dayjs(value))) {
                        return Promise.reject(
                          new Error(
                            'Ngày kết thúc không được nhỏ hơn ngày bắt đầu!'
                          )
                        );
                      }
                      if (!dayjs(startDate).isAfter(dayjs(value))) {
                        return Promise.resolve();
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <CDatePicker
                  showTime={{ format: 'HH:mm' }}
                  format={DateFormat.DATE_TIME_NO_SECOND}
                  className="w-full"
                  placeholder="Ngày kết thúc"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={12}>
              <Form.Item label="Mã API" name="apiCode">
                <CInput
                  maxLength={20}
                  uppercase
                  preventSpace
                  preventVietnamese
                  placeholder="Mã API"
                  onPaste={(e) => handlePaste(e, 'apiCode')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Mã SMS"
                name="smsCode"
              >
                <CInput
                  maxLength={20}
                  uppercase
                  preventSpace
                  preventVietnamese
                  placeholder="Mã SMS"
                  onPaste={(e) => handlePaste(e, 'smsCode')}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={12}>
              <Form.Item label="Mã KM API" name="apiPromCode">
                <CInput
                  maxLength={20}
                  uppercase
                  preventSpace
                  preventVietnamese
                  placeholder="Mã KM API"
                  onPaste={(e) => handlePaste(e, 'apiPromCode')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Mã kích hoạt" name="activationCode">
                <CInput
                  maxLength={20}
                  uppercase
                  preventSpace
                  preventVietnamese
                  placeholder="Mã kích hoạt"
                  onPaste={(e) => handlePaste(e, 'activationCode')}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={12}>
              <Form.Item label="Mã KM SMS" name="smsPromCode">
                <CInput
                  maxLength={20}
                  uppercase
                  preventSpace
                  preventVietnamese
                  placeholder="Mã KM SMS"
                  onPaste={(e) => handlePaste(e, 'smsPromCode')}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={12}>
              <Form.Item
                label="Chu kỳ"
                name="cycleQuantity"
                rules={[
                  {
                    required: true,
                    message: MESSAGE.G06,
                  },
                ]}
              >
                <CInput
                  onlyNumber
                  maxLength={3}
                  className="w-full"
                  min={0}
                  placeholder="Chu kỳ"
                  disabled={typeModal === ActionType.VIEW}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Đơn vị" name="cycleUnit" initialValue={'Tháng'}>
                <CSelect
                  options={cycleUnitOptions}
                  allowClear={false}
                  placeholder="Đơn vị"
                  showSearch
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={12}>
              <Form.Item
                label="Trạng thái hiển thị"
                name="displayStatus"
                initialValue={'true'}
              >
                <CSelect
                  options={displayStatusOptions}
                  placeholder="Trạng thái hiển thị"
                  allowClear={false}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={12}>
              <Form.Item
                label="Vị trí hiển thị Mobile"
                name="mobileDisplayPos"
                rules={[{ required: !isDisablePosition, message: MESSAGE.G06 }]}
              >
                <CInput
                  maxLength={5}
                  style={{
                    backgroundColor: `${isDisablePosition || typeModal === ActionType.VIEW
                      ? '#f5f5f5'
                      : '#ffffff'
                      }`,
                  }}
                  min={0}
                  placeholder="Vị trí hiển thị Mobile"
                  disabled={isDisablePosition || typeModal === ActionType.VIEW}
                  onlyNumber
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Vị trí hiển thị PC"
                name="pcDisplayPos"
                rules={[{ required: !isDisablePosition, message: MESSAGE.G06 }]}
              >
                <CInput
                  maxLength={5}
                  style={{
                    backgroundColor: `${isDisablePosition || typeModal === ActionType.VIEW
                      ? '#f5f5f5'
                      : '#ffffff'
                      }`,
                  }}
                  min={0}
                  placeholder="Vị trí hiển thị PC"
                  disabled={isDisablePosition || typeModal === ActionType.VIEW}
                  onlyNumber
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Gói cước bán chạy"
                name="topSale"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 1 }}
              >
                <CCheckbox
                  className="ml-[-6px]"
                  checked={isTopSale}
                  onChange={(e) => setIsTopSale(e.target.checked)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ảnh gói cước"
                name="images"
                >
                  <Upload
                  accept={ImageFileType.join(',')}
                  showUploadList={false}
                  disabled={typeModal === ActionType.VIEW}
                  beforeUpload={beforeUpload}
                  multiple={false}
                  maxCount={1}
                >
                  {imageUrl ? (
                    <div className="relative inline-block">
                      <img
                        src={imageUrl}
                        alt="Ảnh gói cước"
                        className={
                          'rounded-xl object-cover h-36 w-[200px] ' +
                          (typeModal === ActionType.VIEW
                            ? 'cursor-not-allowed'
                            : 'cursor-pointer')
                        }
                      />
                      {typeModal !== ActionType.VIEW && (
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Button
                            type="primary"
                            danger
                            size="small"
                            className="!p-1 !w-8 !h-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteImage();
                            }}
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Mô tả" name="description">
                <CTextArea maxLength={200} rows={5} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <RowButton className="my-6">
        <Form.Item name="saveForm"></Form.Item>
        {typeModal === ActionType.ADD && (
          <CButtonSaveAndAdd
            onClick={() => {
              form.setFieldsValue({
                saveForm: true,
              });
              form.submit();
            }}
            loading={loadingAdd || loadingEdit}
          >
            Lưu và thêm mới
          </CButtonSaveAndAdd>
        )}
        {typeModal === ActionType.VIEW &&
          includes(listRoleByRouter, ActionsTypeEnum.UPDATE) && (
            <CButtonEdit
              onClick={() =>
                navigate(pathRoutes.list_of_service_package_edit(Number(id)))
              }
            >
              {intl.formatMessage({ id: 'common.edit' })}
            </CButtonEdit>
          )}

        {typeModal !== ActionType.VIEW && (
          <CButtonSave
            onClick={() => {
              form.setFieldsValue({
                saveForm: false,
              });
              form.submit();
            }}
            loading={loadingAdd}
          >
            <FormattedMessage id="common.save" />
          </CButtonSave>
        )}
        <CButtonClose type="default" onClick={handleCloseModal}>
          Đóng
        </CButtonClose>
      </RowButton>
    </>
  );
};
export default ModalAddEditView;
