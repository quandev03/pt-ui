import validateForm from '@react/utils/validator';
import { Checkbox, Col, Collapse, Form, Row, Typography } from 'antd';
import { useGetImage } from 'apps/Internal/src/components/layouts/queryHooks';
import { useEffect, useMemo, useState } from 'react';
import useCensorshipStore from '../store';
import ModalImage from './ModalImage';
import ModalPdf from './ModalPdf';

const FormCheckND13 = () => {
  const form = Form.useFormInstance();
  const {
    imageNd13,
    setImageNd13,
    activeKeyNd13: activeKey,
    subDocDetail,
  } = useCensorshipStore();
  const [isOpenPdf, setIsOpenPdf] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const imageUrl =
    (subDocDetail &&
      subDocDetail?.subDocumentImageResponses?.find(
        (item) => item.imageType === '3' && item.imageCode === null
      )?.imagePath) ||
    '';
  const { data: imageBlobUrl } = useGetImage(imageUrl);
  const isContractPdf = useMemo(() => {
    if (imageBlobUrl && typeof imageBlobUrl === 'object') {
      return imageBlobUrl.isPdf;
    }
    return false;
  }, [imageBlobUrl]);
  const pdfUrl = useMemo(() => {
    if (imageBlobUrl && typeof imageBlobUrl === 'object') {
      return (imageBlobUrl as any).url;
    }
    return imageBlobUrl;
  }, [imageBlobUrl]);
  useEffect(() => {
    if (isContractPdf) {
      setImageNd13((imageBlobUrl as any).url);
    }
    form.setFields([
      { name: 'fileND13', value: 'Biên_bản_xác_nhận_NĐ13', errors: [] },
      {
        name: 'cardContract',
        errors: [],
      },
    ]);
  }, [imageBlobUrl]);
  const handlePreview = () => {
    if (isContractPdf) {
      setIsOpenPdf(true);
      return;
    }
    if (imageNd13.length > 0) {
      setIsOpen(true);
    }
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
            activeKey !== '1' && (
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item
                    label="Biên bản xác nhận"
                    name="fileND13"
                    rules={[validateForm.required]}
                  >
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
            )
          }
          key="1"
        ></Collapse.Panel>
      </Collapse>
      <ModalImage
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        src={imageNd13}
        isProfilePicture={false}
      />
      {isOpenPdf && (
        <ModalPdf
          isOpen={isOpenPdf}
          setIsOpen={setIsOpenPdf}
          isSigned={false}
          pdfUrl={pdfUrl ? pdfUrl : (imageBlobUrl as string)}
          isND13={true}
        />
      )}
    </fieldset>
  );
};
export default FormCheckND13;
