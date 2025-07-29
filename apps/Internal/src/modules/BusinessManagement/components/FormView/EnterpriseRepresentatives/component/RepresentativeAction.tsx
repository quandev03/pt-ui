import CButton, {
  CButtonClose,
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import CDatePicker from '@react/commons/DatePicker';
import {
  CSwitch,
  CUploadFileTemplate,
  NotificationError,
} from '@react/commons/index';
import CInput from '@react/commons/Input';
import ModalConfirm from '@react/commons/Modal/Confirm';
import { NotificationWarning } from '@react/commons/Notification';
import CSelect from '@react/commons/Select';
import { BtnGroupFooter, TitleHeader } from '@react/commons/Template/style';
import { ActionType, FILE_TYPE } from '@react/constants/app';
import { formatDate, formatDateEnglishV2 } from '@react/constants/moment';
import { MESSAGE } from '@react/utils/message';
import validateForm from '@react/utils/validator';
import { Card, Col, Flex, Form, Row, Spin } from 'antd';
import { RcFile } from 'antd/es/upload';
import CadastralSelect from 'apps/Internal/src/components/Select/CadastralSelect';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import dayjs, { Dayjs } from 'dayjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ModalImage from '../../../ModalImage';
import ModalPdf from '../../../ModalPdf';
import { useAddRepresentative } from '../hooks/useAddRepresentative';
import { useCheckInfo } from '../hooks/useCheckInfo';
import { useEditRepStatus } from '../hooks/useEditRepStatus';
import { useGetConfigC06 } from '../hooks/useGetConfigC06';
import { useGetFile } from '../hooks/useGetFile';
import { useGetInfoOcr } from '../hooks/useGetInfoOcr';
import { useGetRepresentativeDetail } from '../hooks/useGetRepresentativeDetail';
import useRepresentativeStore from '../store';
import { IDType } from '../type';
import UploadImage from './UploadImage';

type Props = {
  actionType: ActionType;
};
const RepresentativeAction: React.FC<Props> = ({ actionType }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [fileSrc, setFileSrc] = useState<string>('');
  const [isOpenImg, setIsOpenImg] = useState(false);
  const [isOpenPdf, setIsOpenPdf] = useState(false);
  const {
    isDisableCheckInfo,
    resetStore,
    isAllowSave,
    setIsAllowSave,
    setIsDisableCheckInfo,
  } = useRepresentativeStore();
  const handleClose = useCallback(() => {
    resetStore();
    navigate(-1);
  }, []);
  const { id } = useParams();
  const { enterpriseId } = useParams();
  const { setAuthorizedFileName } = useRepresentativeStore();
  const onAddSuccess = () => {
    if (!form.getFieldValue('isSaveAndAdd')) {
      navigate(-1);
    }
    form.resetFields();
  };
  const {
    mutate: getInfoOcr,
    isPending: loadingOcr,
    isSuccess: isOcrSuccess,
  } = useGetInfoOcr(form);
  const { mutate: addRepresentative } = useAddRepresentative(onAddSuccess);
  const { mutate: editRepStatus } = useEditRepStatus();
  const { data: repDetail } = useGetRepresentativeDetail(id);
  const { data: isOnC06 } = useGetConfigC06();
  const { mutate: checkInfo } = useCheckInfo(form);
  const cardFront = Form.useWatch('cardFront', form);
  const cardBack = Form.useWatch('cardBack', form);
  const portrait = Form.useWatch('portrait', form);

  const attachFileUrl = useMemo(() => {
    if (repDetail) return repDetail.authorizedFilePath;
    return '';
  }, [repDetail]);
  const { mutate: getAttachFile } = useGetFile(form);
  useEffect(() => {
    if (cardFront && cardBack && portrait) {
      getInfoOcr({ front: cardFront, back: cardBack, portrait });
    }
  }, [cardFront, cardBack, portrait]);
  useEffect(() => {
    if (isOcrSuccess) {
      if (form.getFieldValue('idType') === IDType.CMND) {
        NotificationError(
          'Từ ngày 01/01/2025 không thể thêm mới với Giấy tờ tuỳ thân là Chứng minh nhân dân (9 số và 12 số)'
        );
      }
    }
  }, [isOcrSuccess]);
  useEffect(() => {
    if (repDetail) {
      setAuthorizedFileName(repDetail.authorizedFileName);
      getAttachFile(attachFileUrl);
      form.setFieldsValue({
        ...repDetail,
        startDate: dayjs(repDetail.startDate, formatDateEnglishV2),
        endDate: dayjs(repDetail.endDate, formatDateEnglishV2),
        birthday: dayjs(repDetail.birthday, formatDateEnglishV2),
        idExpiry: dayjs(repDetail.idExpiry, formatDateEnglishV2).isValid()
          ? dayjs(repDetail.idExpiry, formatDateEnglishV2)
          : undefined,
        idIssueDate: dayjs(repDetail.idIssueDate, formatDateEnglishV2),
        status: repDetail.status ? true : false,
      });
    }
  }, [repDetail]);
  const idTypeOptions = [
    {
      label: 'CCCD',
      value: '1',
    },
    {
      label: 'CMND',
      value: '2',
    },
  ];
  const sexOptions = [
    {
      label: 'Nữ',
      value: '0',
    },
    {
      label: 'Nam',
      value: '1',
    },
  ];
  const validateIssueDate = () => {
    const issueDate = form.getFieldValue('idIssueDate');
    if (dayjs(issueDate, formatDate).isAfter(dayjs())) {
      return Promise.reject(new Error('Ngày cấp phải nhỏ hơn ngày hiện tại'));
    }
    return Promise.resolve();
  };

  const validateExpiry = () => {
    const expiry = form.getFieldValue('idExpiry');
    if (dayjs(expiry, formatDate).isBefore(dayjs().subtract(1, 'day'))) {
      return Promise.reject(
        new Error('Ngày hết hạn giấy tờ phải lớn hơn hoặc bằng ngày hiện tại')
      );
    }
    return Promise.resolve();
  };
  const validateBirthDate = () => {
    const birthDate = form.getFieldValue('birthday');
    const issueDate = form.getFieldValue('idIssueDate');
    if (birthDate.isAfter(dayjs())) {
      return Promise.reject(new Error('Ngày sinh phải nhỏ hơn ngày hiện tại'));
    }
    if (birthDate.isAfter(issueDate.subtract(1, 'day'))) {
      return Promise.reject(new Error('Ngày sinh phải nhỏ hơn ngày cấp'));
    }
    return Promise.resolve();
  };
  const validateStartDate = () => {
    const startDate = form.getFieldValue('startDate');
    const endDate = form.getFieldValue('endDate');
    if (startDate && endDate && startDate.isAfter(endDate)) {
      return Promise.reject(
        new Error('Ngày bắt đầu không được lớn hơn ngày kết thúc')
      );
    }
    return Promise.resolve();
  };

  const validateEndDate = () => {
    const startDate = form.getFieldValue('startDate');
    const endDate = form.getFieldValue('endDate');
    if (startDate && endDate && startDate.isAfter(endDate)) {
      return Promise.reject(
        new Error('Ngày kết thúc không được nhỏ hơn ngày bắt đầu')
      );
    }
    return Promise.resolve();
  };

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  const handlePreview = async () => {
    const file = form.getFieldValue('authorizedFile');
    if (file.type === FILE_TYPE.pdf) {
      const url = URL.createObjectURL(file);
      setFileSrc(url);
      setIsOpenPdf(true);
    } else {
      const image = await getBase64(file);
      setFileSrc(image);
      setIsOpenImg(true);
    }
  };
  const disableFutureDates = (current: Dayjs | null): boolean => {
    return current ? current.isAfter(new Date(), 'day') : false;
  };

  const handleFinish = (values: any) => {
    if (actionType === ActionType.ADD) {
      if (form.getFieldValue('idType') === IDType.CMND) {
        NotificationError(
          'Từ ngày 01/01/2025 không thể thêm mới với Giấy tờ tuỳ thân là Chứng minh nhân dân (9 số và 12 số)'
        );
        return;
      }
      if (
        !form.getFieldValue('idExpiry') &&
        !form.getFieldValue('idExpiryNote')
      ) {
        NotificationWarning(
          'Vui lòng điền thông tin Ngày hết hạn giấy tờ hoặc Ngày hết hạn'
        );
        return;
      }
      const { cardFront, cardBack, portrait, authorizedFile, ...rest } = values;
      addRepresentative({
        files: {
          front: cardFront,
          back: cardBack,
          portrait: portrait,
          authorizedFile: authorizedFile,
        },
        form: rest,
        id: enterpriseId,
      });
    } else {
      ModalConfirm({
        message: MESSAGE.G04,
        onOk() {
          editRepStatus({ id, status: values.status });
        },
      });
    }
  };
  const handleCheckInfo = () => {
    checkInfo({
      birthday: form.getFieldValue('birthday').format(formatDateEnglishV2),
      document: form.getFieldValue('idType'),
      id: form.getFieldValue('idNo'),
      id_ekyc: form.getFieldValue('idEkyc'),
      name: form.getFieldValue('name'),
    });
  };
  const renderTitle = () => {
    const name = ' người ủy quyền';
    switch (actionType) {
      case ActionType.ADD:
        return 'Tạo' + name;
      case ActionType.EDIT:
        return 'Chỉnh sửa' + name;
      case ActionType.VIEW:
        return 'Chi tiết' + name;
      default:
        return '';
    }
  };
  const trackedFields: string[] = ['name', 'idNo', 'birthday', 'sex'];
  const handleValuesChange = (changedValues: Record<string, any>) => {
    const fieldName = Object.keys(changedValues)[0];
    if (trackedFields.includes(fieldName) && isOnC06 === 1) {
      setIsAllowSave(false);
      setIsDisableCheckInfo(false);
    }
  };
  return (
    <>
      <TitleHeader>{renderTitle()}</TitleHeader>
      <Spin spinning={loadingOcr}>
        <Form
          form={form}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          onFinish={handleFinish}
          initialValues={{ status: true, nationality: 'Việt Nam', idType: '1' }}
          disabled={actionType !== ActionType.ADD}
          onValuesChange={handleValuesChange}
        >
          <Card>
            <Row gutter={12}>
              <Col lg={{ span: 16, offset: 4 }} md={{ span: 24 }}>
                <Flex gap={24} justify="center">
                  <div className="flex flex-col items-center w-full">
                    <UploadImage
                      name="cardFront"
                      label="Ảnh GTTT mặt trước"
                      imageUrl={repDetail?.idFrontPath}
                      isEditing={actionType === ActionType.ADD}
                    />
                  </div>
                  <div className="flex flex-col items-center w-full">
                    <UploadImage
                      name="cardBack"
                      label="Ảnh GTTT mặt sau"
                      imageUrl={repDetail?.idBackPath}
                      isEditing={actionType === ActionType.ADD}
                    />
                  </div>
                  <div className="flex flex-col items-center w-full">
                    <UploadImage
                      name="portrait"
                      label="Ảnh chân dung"
                      imageUrl={repDetail?.portraitPath}
                      isEditing={actionType === ActionType.ADD}
                    />
                  </div>
                </Flex>
              </Col>
            </Row>
            <Row gutter={24} className="mt-3">
              <Col span={12}>
                <Form.Item
                  label="Loại GTTT"
                  name="idType"
                  rules={[validateForm.required]}
                >
                  <CSelect
                    options={idTypeOptions}
                    placeholder="Loại GTTT"
                    showSearch={false}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Họ và tên"
                  name="name"
                  rules={[validateForm.required, validateForm.maxLength(50)]}
                >
                  <CInput placeholder="Họ và tên" maxLength={100} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Số GTTT"
                  name="idNo"
                  rules={[validateForm.required, validateForm.maxLength(50)]}
                >
                  <CInput placeholder="Số GTTT" maxLength={12} onlyNumber />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Nơi cấp"
                  name="idIssuePlace"
                  rules={[validateForm.required, validateForm.maxLength(100)]}
                >
                  <CInput placeholder="Nơi cấp" maxLength={100} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Ngày cấp"
                  name="idIssueDate"
                  rules={[
                    validateForm.required,
                    { validator: validateIssueDate },
                  ]}
                >
                  <CDatePicker placeholder="Ngày cấp" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Ngày sinh"
                  name="birthday"
                  dependencies={['idIssueDate']}
                  rules={[
                    validateForm.required,
                    { validator: validateBirthDate },
                  ]}
                >
                  <CDatePicker placeholder="Ngày sinh" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Giới tính"
                  name="sex"
                  rules={[validateForm.required]}
                >
                  <CSelect
                    options={sexOptions}
                    placeholder="Giới tính"
                    showSearch={false}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Địa chỉ thường trú"
                  name="address"
                  rules={[validateForm.required]}
                >
                  <CInput placeholder="Địa chỉ thường trú" maxLength={100} />
                </Form.Item>
              </Col>
              <CadastralSelect
                col={<Col span={12} />}
                required={true}
                formName={{
                  province: 'province',
                  district: 'district',
                  village: 'precinct',
                }}
              />
              <Col span={12}>
                <Form.Item
                  label="Quốc tịch"
                  name="nationality"
                  rules={[validateForm.required]}
                >
                  <CInput placeholder="Quốc tịch" maxLength={100} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Ngày hết hạn giấy tờ"
                  name="idExpiry"
                  rules={[{ validator: validateExpiry }]}
                >
                  <CDatePicker placeholder="Ngày hết hạn giấy tờ" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Ngày hết hạn" name="idExpiryNote">
                  <CInput placeholder="Ngày hết hạn" maxLength={50} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <CUploadFileTemplate
                  label="Giấy ủy quyền"
                  name="authorizedFile"
                  accept={[
                    'image/png',
                    'image/jpeg',
                    'image/jpg',
                    'application/pdf',
                  ]}
                  onPreview={handlePreview}
                  required
                />
              </Col>
              <Col span={12}>
                <Form.Item
                  name={'startDate'}
                  label="Ngày bắt đầu"
                  rules={[
                    validateForm.required,
                    { validator: validateStartDate },
                  ]}
                >
                  <CDatePicker disabledDate={disableFutureDates} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={'endDate'}
                  label="Ngày kết thúc"
                  rules={[
                    validateForm.required,
                    { validator: validateEndDate },
                  ]}
                >
                  <CDatePicker />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={'status'} label="Hoạt động">
                  <CSwitch disabled={actionType !== ActionType.EDIT} />
                </Form.Item>
              </Col>
              <Form.Item hidden name="isSaveAndAdd"></Form.Item>
              <Form.Item hidden name="idEkyc"></Form.Item>
            </Row>
          </Card>
        </Form>
        <BtnGroupFooter className="mt-4">
          {actionType === ActionType.ADD && (
            <>
              <CButton
                disabled={isDisableCheckInfo || isOnC06 !== 1}
                onClick={handleCheckInfo}
              >
                Kiểm tra thông tin
              </CButton>
              <CButtonSaveAndAdd
                disabled={!isAllowSave}
                onClick={() => {
                  form.setFieldValue('isSaveAndAdd', true);
                  form.submit();
                }}
              />
            </>
          )}
          {actionType !== ActionType.VIEW && (
            <CButtonSave
              disabled={!isAllowSave}
              onClick={() => {
                form.setFieldValue('isSaveAndAdd', false);
                form.submit();
              }}
            />
          )}
          {actionType === ActionType.VIEW && (
            <CButtonEdit
              onClick={() => {
                navigate(pathRoutes.representativeEdit(id));
              }}
            />
          )}
          <CButtonClose onClick={handleClose} />
        </BtnGroupFooter>
      </Spin>
      <ModalImage src={fileSrc} isOpen={isOpenImg} setIsOpen={setIsOpenImg} />
      <ModalPdf src={fileSrc} isOpen={isOpenPdf} setIsOpen={setIsOpenPdf} />
    </>
  );
};
export default RepresentativeAction;
