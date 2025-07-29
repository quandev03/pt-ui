import Checkbox from '@react/commons/Checkbox';
import { Col, Collapse, Form, Row, Typography } from 'antd';
import { useGetPdf } from 'apps/Internal/src/components/layouts/queryHooks';
import { FC, useMemo, useState } from 'react';
import { IActivationRequest, RequestImageResponse } from '../queryHook/useView';
import { useActiveSubscriptStore } from '../store';
import ModalPdf from './ModalPdf';
import { ActionType } from '@react/constants/app';
import { useGetND13 } from '../queryHook/useGetND13';

interface FormCheckND13Props {
  dataActivationView?: IActivationRequest;
}

const FormCheckND13: FC<FormCheckND13Props> = ({ dataActivationView }) => {
  const form = Form.useFormInstance();
  const { activeKeyNd13: activeKey } = useActiveSubscriptStore();
  const {
    isCheckUpdateSuccess
  } = useActiveSubscriptStore();
  const enabled = useMemo(() => {
    return isCheckUpdateSuccess;
  }, [isCheckUpdateSuccess]);
  let id = form.getFieldValue('contractNo');
  const {data:urlContractDecreeViewAfter} = useGetND13(form,enabled);
  const url = useMemo(() => {
    return (
      dataActivationView?.requestImageResponses?.find(
        (item: RequestImageResponse) => item.imageType === 3
      )?.imagePath ?? ''
    );
  }, [dataActivationView]);
  const { data: imageBlobUrl } = useGetPdf(urlContractDecreeViewAfter ?? url);

  const [isOpenPdf, setIsOpenPdf] = useState<boolean>(false);

  const handlePreview = () => {
    setIsOpenPdf(true);
    return;
  };

  return (
    <fieldset>
      <legend>
        <Checkbox checked={true} disabled></Checkbox>Đồng ý chia sẻ dữ liệu theo
        NĐ13
      </legend>
      <Collapse activeKey={activeKey} ghost>
        <Collapse.Panel
          showArrow={false}
          header={
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item label="Biên bản xác nhận" name="fileND13">
                  <Typography.Link
                    underline
                    target="_blank"
                    onClick={handlePreview}
                  >
                    {form.getFieldValue('fileND13')}
                  </Typography.Link>
                </Form.Item>
              </Col>
            </Row>
          }
          key="1"
        ></Collapse.Panel>
      </Collapse>
      <ModalPdf
        isOpen={isOpenPdf}
        setIsOpen={setIsOpenPdf}
        isSigned={false}
        isND13
        pdfUrl={imageBlobUrl}
      />
    </fieldset>
  );
};

export default FormCheckND13;
