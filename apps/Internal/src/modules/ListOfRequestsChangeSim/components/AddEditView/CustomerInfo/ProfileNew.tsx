import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CInput from '@react/commons/Input';
import { Col, Flex, Form, Row, Spin } from 'antd';
import UploadImage from './UploadImage';
import { FC, useEffect } from 'react';
import { useCallOcr } from 'apps/Internal/src/modules/ListOfRequestsChangeSim/hooks/useCallOcr';
import CSelect from '@react/commons/Select';
import { useGetApplicationConfig } from 'apps/Internal/src/hooks/useGetApplicationConfig';
import Button from '@react/commons/Button';
import useStoreListOfRequestsChangeSim from 'apps/Internal/src/modules/ListOfRequestsChangeSim/store';
import PreviewImageUpload from 'apps/Internal/src/components/PreviewImageUpload';
import { ActionType } from '@react/constants/app';
import ContactNumber from './ContactNumber';

type Props = {
  typeModal: ActionType;
};

const ProfileNew: FC<Props> = ({ typeModal }) => {
  const form = Form.useFormInstance();
  const cardFront = Form.useWatch('cardFront', form);
  const cardBack = Form.useWatch('cardBack', form);
  const portrait = Form.useWatch('portrait', form);
  const cardContract = Form.useWatch('cardContract', form);
  const requestType = Form.useWatch('requestType', form);

  const { resetDataActivateInfo, interval } = useStoreListOfRequestsChangeSim();

  const {
    data: dataApplicationConfigIdType,
    isLoading: isLoadingIdTypeIdType,
  } = useGetApplicationConfig('ID_TYPE');
  const { data: dataApplicationConfigSex, isLoading: isLoadingSex } =
    useGetApplicationConfig('SEX');

  const { mutate: mutateCallOcr, isPending: isLoadingCallOcr } = useCallOcr();

  useEffect(() => {
    if (cardFront && cardBack && portrait && typeModal === ActionType.ADD) {
      mutateCallOcr({
        front: cardFront,
        back: cardBack,
        portrait: portrait,
      });
    }
  }, [cardFront, cardBack, portrait, typeModal]);

  const handleReset = () => {
    resetDataActivateInfo();
    clearTimeout(interval);
    form.resetFields(['cardFront', 'cardBack', 'portrait', 'cardContract']);
    form.setFieldsValue({
      id: '',
      issueDate: '',
      sex: null,
      nationality: '',
      documentType: null,
      issueBy: '',
      name: '',
      birthday: '',
      address: '',
      idEkyc: '',
    });
  };

  return (
    <fieldset className="bg-white">
      <legend>
        Hồ sơ mới
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
      </legend>
      <Spin spinning={isLoadingCallOcr}>
        {typeModal === ActionType.ADD ? (
          <Row gutter={12}>
            <Col span={24}>
              <Flex gap={16} justify="center">
                <div className="flex flex-col items-center w-full">
                  <UploadImage name="cardFront" label="Ảnh GTTT mặt trước" />
                </div>
                <div className="flex flex-col items-center w-full">
                  <UploadImage name="cardBack" label="Ảnh GTTT mặt sau" />
                </div>
                <div className="flex flex-col items-center w-full">
                  <UploadImage name="portrait" label="Ảnh chân dung" />
                </div>
                <div className="flex flex-col items-center w-full">
                  <UploadImage
                    name="cardContract"
                    label="Phiếu yêu cầu đổi SIM"
                  />
                </div>
              </Flex>
            </Col>
          </Row>
        ) : (
          <Row gutter={12}>
            <Col span={6}>
              <PreviewImageUpload
                url={cardFront}
                label="Ảnh GTTT mặt trước"
                isProfilePicture
              />
            </Col>
            <Col span={6}>
              <PreviewImageUpload
                url={cardBack}
                label="Ảnh GTTT mặt sau"
                isProfilePicture
              />
            </Col>
            <Col span={6}>
              <PreviewImageUpload
                url={portrait}
                label="Ảnh chân dung"
                isProfilePicture
              />
            </Col>
            <Col span={6}>
              <PreviewImageUpload
                url={cardContract}
                label="Phiếu yêu cầu đổi SIM"
              />
            </Col>
          </Row>
        )}
        {/* {typeModal === ActionType.VIEW && requestType !== 'BCSS' && (
          <ContactNumber isView />
        )} */}
        <legend>Thông tin khách hàng</legend>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              label="Loại khách hàng"
              name="typeUser"
              initialValue="Cá nhân"
            >
              <CInput placeholder="Cá nhân" disabled />
            </Form.Item>
            <Form.Item label="Số giấy tờ" name="id">
              <CInput placeholder="Số giấy tờ" disabled />
            </Form.Item>
            <Form.Item label="Ngày cấp" name="issueDate">
              <CInput placeholder="Ngày cấp" disabled />
            </Form.Item>
            <Form.Item label="Giới tính" name="sex">
              <CSelect
                loading={isLoadingSex}
                fieldNames={{ label: 'name', value: 'value' }}
                options={dataApplicationConfigSex}
                disabled
                placeholder="Giới tính"
              />
            </Form.Item>
            <Form.Item
              label="Quốc tịch"
              name="nationality"
              initialValue="Việt Nam"
            >
              <CInput placeholder="Quốc tịch" disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Loại giấy tờ" name="documentType">
              <CSelect
                fieldNames={{ label: 'code', value: 'value' }}
                loading={isLoadingIdTypeIdType}
                options={dataApplicationConfigIdType}
                disabled
                placeholder="Loại giấy tờ"
              />
            </Form.Item>
            <Form.Item label="Nơi cấp" name="issueBy">
              <CInput placeholder="Nơi cấp" disabled />
            </Form.Item>
            <Form.Item label="Tên khách hàng" name="name">
              <CInput placeholder="Tên khách hàng" disabled />
            </Form.Item>
            <Form.Item label="Ngày sinh" name="birthday">
              <CInput placeholder="Ngày sinh" disabled />
            </Form.Item>
            <Form.Item label="Địa chỉ TT" name="address">
              <CInput placeholder="Địa chỉ TT" disabled />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="" name="idEkyc" hidden />
        <Form.Item label="" name="ccdvvt" hidden />
        <Form.Item label="" name="contractId" hidden />
        <Form.Item label="" name="cardFront" hidden />
        <Form.Item label="" name="cardBack" hidden />
        <Form.Item label="" name="portrait" hidden />
        <Form.Item label="" name="cardContract" hidden />
        <Form.Item label="" name="isFakeOcr" hidden />
      </Spin>
    </fieldset>
  );
};

export default ProfileNew;
