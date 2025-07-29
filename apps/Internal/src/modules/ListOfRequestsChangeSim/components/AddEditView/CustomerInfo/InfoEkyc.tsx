import CInput from '@react/commons/Input';
import validateForm from '@react/utils/validator';
import { Col, Form, Row } from 'antd';
import PreviewImageUpload from 'apps/Internal/src/components/PreviewImageUpload';
import { usePrefixIsdnRegex } from 'apps/Internal/src/hooks/usePrefixIsdnQuery';
import { useSubInfo } from 'apps/Internal/src/modules/ListOfRequestsChangeSim/hooks/useSubInfo';
import useStoreListOfRequestsChangeSim from 'apps/Internal/src/modules/ListOfRequestsChangeSim/store';

const InfoEkyc = () => {
  const form = Form.useFormInstance();
  const prefixIsdn = usePrefixIsdnRegex();
  const urlCardFront = Form.useWatch('cardFrontOld', form);
  const urlCardBack = Form.useWatch('cardBackOld', form);
  const urlPortrait = Form.useWatch('portraitOld', form);
  const urlCardContract = Form.useWatch('cardContractOld', form);
  const { mutate: mutateCheckSerialSim } = useSubInfo();
  const { changeSimCode } = useStoreListOfRequestsChangeSim();

  const handleCheckNumberPhone = (e: any) => {
    const value = e.target.value.trim();
    if (!value.startsWith('0') && value.length > 0 && value.length < 11) {
      form.setFieldValue('isdn', '0' + value);
    }

    form.validateFields(['isdn']).then((value) => {
      mutateCheckSerialSim({
        changeSimCode: changeSimCode,
        isdn: value.isdn,
      });
    });
  };

  return (
    <fieldset className="bg-white">
      <legend>Hồ sơ ekyc</legend>
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item
            label="Số thuê bao"
            name="isdn"
            rules={[
              validateForm.required,
              validateForm.maxLength(11),
              prefixIsdn,
            ]}
          >
            <CInput
              placeholder="Số thuê bao"
              onlyNumber
              maxLength={11}
              onBlur={(e) => {
                handleCheckNumberPhone(e);
              }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={12}>
        <Col span={6}>
          <PreviewImageUpload
            url={urlCardFront}
            label="Ảnh GTTT mặt trước"
            isProfilePicture
          />
        </Col>
        <Col span={6}>
          <PreviewImageUpload
            url={urlCardBack}
            label="Ảnh GTTT mặt sau"
            isProfilePicture
          />
        </Col>
        <Col span={6}>
          <PreviewImageUpload
            url={urlPortrait}
            label="Ảnh chân dung"
            isProfilePicture
          />
        </Col>
        <Col span={6}>
          <PreviewImageUpload url={urlCardContract} label="Ảnh hợp đồng" />
        </Col>
      </Row>
      <Form.Item label="" name="cardFrontOld" hidden />
      <Form.Item label="" name="cardBackOld" hidden />
      <Form.Item label="" name="portraitOld" hidden />
      <Form.Item label="" name="cardContractOld" hidden />
      <Form.Item label="" name="customerCode" hidden />
      <Form.Item label="" name="oldSerialSim" hidden />
    </fieldset>
  );
};

export default InfoEkyc;
