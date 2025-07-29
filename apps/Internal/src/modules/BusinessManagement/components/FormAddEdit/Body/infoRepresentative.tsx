import { FC, useEffect } from 'react';
import { ActionType } from '@react/constants/app';
import { Col, Flex, Form, Row, Spin } from 'antd';
import CInput from '@react/commons/Input';
import { CDatePicker, CSelect } from '@react/commons/index';
import { useGetApplicationConfig } from 'apps/Internal/src/hooks/useGetApplicationConfig';
import UploadImage from './UploadImage';
import CadastralSelect from 'apps/Internal/src/components/Select/CadastralSelect';
import validateForm from '@react/utils/validator';
import dayjs from 'dayjs';
import { useCallOcr } from 'apps/Internal/src/modules/BusinessManagement/hooks/useCallOcr';
import { formatDate } from '@react/constants/moment';
import { StoreValue } from 'antd/es/form/interface';
import useStoreBusinessManagement from '../../../store';

type Props = {
  typeModal: ActionType;
};

const validateExpiry = (value: string) => {
  if (value && dayjs().isAfter(dayjs(value), 'days')) {
    return Promise.reject(
      new Error('Ngày hết hạn giấy tờ phải lớn hơn hoặc bằng ngày hiện tại')
    );
  }

  return Promise.resolve();
};

const InfoRepresentative: FC<Props> = ({ typeModal }) => {
  const form = Form.useFormInstance();
  const { data: dataApplicationConfigSex, isLoading: isLoadingSex } =
    useGetApplicationConfig('SEX');
  const {
    data: dataApplicationConfigIdType,
    isLoading: isLoadingIdTypeIdType,
  } = useGetApplicationConfig('ID_TYPE');

  const { mutate: mutateCallOcr, isPending: isLoadingCallOcr } = useCallOcr();

  const cardFront = Form.useWatch('cardFront', form);
  const cardBack = Form.useWatch('cardBack', form);
  const portrait = Form.useWatch('portrait', form);
  const cardFrontView = Form.useWatch('cardFrontView', form);
  const cardBackView = Form.useWatch('cardBackView', form);
  const portraitView = Form.useWatch('portraitView', form);
  const { changedFields } = useStoreBusinessManagement();

  useEffect(() => {
    if (
      cardFront &&
      cardBack &&
      portrait &&
      typeModal !== ActionType.VIEW &&
      !cardFrontView
    ) {
      mutateCallOcr({
        front: cardFront,
        back: cardBack,
        portrait: portrait,
      });
    }
  }, [cardFront, cardBack, portrait, typeModal, cardFrontView]);

  const validateIssueDate = (value: StoreValue) => {
    if (dayjs(value, formatDate).isAfter(dayjs())) {
      return Promise.reject(new Error('Ngày cấp phải nhỏ hơn ngày hiện tại'));
    }
    return Promise.resolve();
  };

  const validateBirthDate = (value: StoreValue) => {
    const representativeIdIssueDate = form.getFieldValue(
      'representativeIdIssueDate'
    );
    if (
      value &&
      representativeIdIssueDate &&
      !dayjs(representativeIdIssueDate).isAfter(dayjs(value))
    ) {
      return Promise.reject(new Error('Ngày sinh phải nhỏ hơn ngày cấp'));
    }

    if (dayjs(value, formatDate).isAfter(dayjs())) {
      return Promise.reject(new Error('Ngày sinh phải nhỏ hơn ngày hiện tại'));
    }
    return Promise.resolve();
  };

  return (
    <fieldset>
      <legend>Thông tin người đại diện</legend>
      <Spin spinning={isLoadingCallOcr}>
        <Row gutter={12}>
          <Col lg={{ span: 16, offset: 4 }} md={{ span: 24 }}>
            <Flex gap={16} justify="center">
              <div className="flex flex-col items-center w-full">
                <UploadImage
                  typeModal={typeModal}
                  name="cardFront"
                  label="Ảnh GTTT mặt trước"
                  urlView={cardFrontView}
                  changedFieldName={
                    changedFields.includes('representativeFrontImgPath')
                      ? 'representativeFrontImgPath'
                      : ''
                  }
                />
              </div>
              <div className="flex flex-col items-center w-full">
                <UploadImage
                  typeModal={typeModal}
                  name="cardBack"
                  label="Ảnh GTTT mặt sau"
                  urlView={cardBackView}
                  changedFieldName={
                    changedFields.includes('representativeBackImgPath')
                      ? 'representativeBackImgPath'
                      : ''
                  }
                />
              </div>
              <div className="flex flex-col items-center w-full">
                <UploadImage
                  typeModal={typeModal}
                  name="portrait"
                  label="Ảnh chân dung"
                  urlView={portraitView}
                  changedFieldName={
                    changedFields.includes('representativePortraitImgPath')
                      ? 'representativePortraitImgPath'
                      : ''
                  }
                />
              </div>
            </Flex>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              label="Loại GTTT"
              name="representativeIdType"
              rules={[validateForm.required]}
              initialValue={'1'}
            >
              <CSelect
                fieldNames={{ label: 'code', value: 'value' }}
                loading={isLoadingIdTypeIdType}
                options={dataApplicationConfigIdType}
                placeholder="Loại GTTT"
                showSearch={false}
              />
            </Form.Item>
            <Form.Item
              label="Số GTTT"
              name="representativeIdNumber"
              rules={[validateForm.required]}
            >
              <CInput
                placeholder="Số GTTT"
                onChange={() =>
                  form.setFieldsValue({
                    isDisableButtonCheck: false,
                  })
                }
                maxLength={12}
              />
            </Form.Item>
            <Form.Item
              label="Ngày cấp"
              name="representativeIdIssueDate"
              rules={[
                validateForm.required,
                {
                  validator: (_, value) => validateIssueDate(value),
                },
              ]}
            >
              <CDatePicker placeholder="Ngày cấp" />
            </Form.Item>
            <Form.Item
              label="Giới tính"
              name="representativeGender"
              rules={[validateForm.required]}
            >
              <CSelect
                loading={isLoadingSex}
                fieldNames={{ label: 'name', value: 'value' }}
                options={dataApplicationConfigSex}
                showSearch={false}
                placeholder="Giới tính"
                onChange={() =>
                  form.setFieldsValue({
                    isDisableButtonCheck: false,
                  })
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Họ và tên"
              name="representativeName"
              rules={[validateForm.required]}
            >
              <CInput
                placeholder="Họ và tên"
                onChange={() =>
                  form.setFieldsValue({
                    isDisableButtonCheck: false,
                  })
                }
                maxLength={100}
              />
            </Form.Item>
            <Form.Item
              label="Nơi cấp"
              name="representativeIdIssuePlace"
              rules={[validateForm.required]}
            >
              <CInput placeholder="Nơi cấp" maxLength={100} />
            </Form.Item>

            <Form.Item
              label="Ngày sinh"
              name="representativeBirthDate"
              dependencies={['representativeIdIssueDate']}
              rules={[
                validateForm.required,
                {
                  validator: (_, value) => validateBirthDate(value),
                },
              ]}
            >
              <CDatePicker
                placeholder="Ngày sinh"
                onChange={() =>
                  form.setFieldsValue({
                    isDisableButtonCheck: false,
                  })
                }
              />
            </Form.Item>
            <Form.Item
              label="Địa chỉ thường trú"
              name="representativePermanentAddress"
              rules={[validateForm.required]}
            >
              <CInput placeholder="Địa chỉ thường trú" maxLength={100} />
            </Form.Item>
          </Col>
          <CadastralSelect
            col={<Col span={12} />}
            formName={{
              province: 'representativeProvince',
              district: 'representativeDistrict',
              village: 'representativePrecinct',
            }}
          />
          <Col span={12}>
            <Form.Item
              label="Quốc tịch"
              name="representativeNationality"
              rules={[validateForm.required]}
            >
              <CInput placeholder="Quốc tịch" maxLength={100} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Ngày hết hạn giấy tờ"
              name="idExpiryDate"
              rules={[{ validator: (_, value) => validateExpiry(value) }]}
            >
              <CDatePicker placeholder="Ngày hết hạn giấy tờ" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Ngày hết hạn"
              name="idExpiryDateNote"
              rules={[validateForm.maxLength(50)]}
            >
              <CInput placeholder="Nhập thông tin" maxLength={50} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="" name="idEkyc" hidden />
        <Form.Item label="" name="cardFrontView" hidden />
        <Form.Item label="" name="cardBackView" hidden />
        <Form.Item label="" name="portraitView" hidden />
        <Form.Item label="" name="isChangeUploadImage" hidden />
      </Spin>
    </fieldset>
  );
};

export default InfoRepresentative;
