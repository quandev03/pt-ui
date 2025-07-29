import CButton, { CButtonClose } from '@react/commons/Button';
import { CUploadFileTemplate } from '@react/commons/index';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import { RowButton } from '@react/commons/Template/style';
import CTextArea from '@react/commons/TextArea';
import { ParamsOption } from '@react/commons/types';
import { ActionsTypeEnum, FILE_TYPE } from '@react/constants/app';
import { emailRegex } from '@react/constants/regex';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { prefixCustomerServicePublic } from '@react/url/app';
import { MESSAGE } from '@react/utils/message';
import { Card, Col, Form, Row } from 'antd';
import { RcFile } from 'antd/es/upload';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';
import { useExportMutation } from 'apps/Partner/src/hooks/useExportMutation';
import { useRolesByRouter } from 'apps/Partner/src/hooks/useRolesByRouter';
import { includes } from 'lodash';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdd } from '../hooks/useAdd';
import { useGetAllOrg } from '../hooks/useGetAllOrg';
import { useGetProfileSimReplacement } from '../hooks/useGetProfileSimReplacement';
import ModalImage from './ModalImage';
import ModalPdf from './ModalPdf';
import { useWatch } from 'antd/es/form/Form';
import { SimTypeEnum } from '../types';

const ModalAdd = () => {
  const [form] = Form.useForm();
  const [isOpenImage, setIsOpenImage] = useState(false);
  const [isOpenPdf, setIsOpenPdf] = useState(false);
  const [fileSrc, setFileSrc] = useState<string>('');
  const actionByRole = useRolesByRouter();
  const simType = useWatch('simType', form);
  const navigate = useNavigate();
  const { COMBINE_KIT_SIM_TYPE = [] } = useGetDataFromQueryKey<ParamsOption>([
    REACT_QUERY_KEYS.GET_PARAMS,
  ]);
  const { data: profile } = useGetProfileSimReplacement();
  const { data: stockList } = useGetAllOrg();
  const { mutate: addSimReplacement, isPending: loadingAdd } = useAdd(form);
  const { mutate: downloadTemplate } = useExportMutation();
  const handleClose = () => {
    navigate(-1);
  };
  const handleFinish = (values: any) => {
    addSimReplacement(values);
  };
  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  const handlePreview = async () => {
    const file = form.getFieldValue('attachmentFile');
    console.log(file.type);
    if (file.type === FILE_TYPE.pdf) {
      const url = URL.createObjectURL(file);
      setFileSrc(url);
      setIsOpenPdf(true);
    } else {
      const image = await getBase64(file);
      setFileSrc(image);
      setIsOpenImage(true);
    }
  };
  const handleDownloadTemplate = () => {
    downloadTemplate({
      uri: `${prefixCustomerServicePublic}/change-sim-bulk/download-file?fileType=TEMPLATE`,
      filename: 'file_doi_sim_hang_loat_mau.xlsx',
    });
  };
  useEffect(() => {
    if (profile) {
      form.setFieldsValue({
        email: profile.email ?? '',
      });
    }
  }, [profile]);
  return (
    <>
      <Card>
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          colon={false}
          onFinish={handleFinish}
        >
          <Row gutter={[30, 6]}>
            <Col span={12}>
              <Form.Item
                label="Loại mặt hàng"
                name={'simType'}
                rules={[{ required: true, message: MESSAGE.G06 }]}
              >
                <CSelect
                  options={COMBINE_KIT_SIM_TYPE}
                  placeholder="Chọn loại mặt hàng"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Mã kho"
                name={'stockCode'}
                rules={[{ required: true, message: MESSAGE.G06 }]}
              >
                <CSelect
                  options={stockList}
                  fieldNames={{ label: 'orgName', value: 'orgCode' }}
                  showSearch
                  filterOption={(input, options: any) =>
                    (options?.orgName ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  placeholder="Chọn mã kho"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <CUploadFileTemplate
                accept={[
                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                ]}
                name="isdnFile"
                onDownloadTemplate={handleDownloadTemplate}
                label="Danh sách số"
                required
              />
            </Col>
            <Col span={12}>
              <CUploadFileTemplate
                accept={[
                  'application/pdf',
                  'image/jpg',
                  'image/png',
                  'image/jpeg',
                ]}
                name={'attachmentFile'}
                label="File đính kèm"
                onPreview={handlePreview}
                required={false}
              />
            </Col>
            <Col span={12}>
              <Form.Item
                label="Email"
                required={simType === SimTypeEnum.ESIM}
                rules={[
                  {
                    validator(_, value) {
                      if (!value && simType === SimTypeEnum.ESIM) {
                        return Promise.reject(MESSAGE.G06);
                      } else if (value && !emailRegex.test(value)) {
                        return Promise.reject('Email không đúng định dạng');
                      } else {
                        return Promise.resolve();
                      }
                    },
                  },
                ]}
                name={'email'}
              >
                <CInput
                  onBlur={(e) => {
                    form.setFieldValue('email', e.target.value.trim());
                    form.validateFields(['email']);
                  }}
                  maxLength={100}
                  placeholder="Nhập thông tin email"
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Mô tả"
                name={'description'}
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 21 }}
              >
                <CTextArea
                  rows={3}
                  className="ml-[-4px]"
                  maxLength={255}
                  placeholder="Nhập thông tin mô tả"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <RowButton className="my-6">
        {includes(actionByRole, ActionsTypeEnum.CREATE) && (
          <CButton
            loading={loadingAdd}
            htmlType="submit"
            onClick={() => form.submit()}
          >
            Thực hiện
          </CButton>
        )}
        <CButtonClose type="default" onClick={handleClose}>
          Đóng
        </CButtonClose>
      </RowButton>
      <ModalImage
        isOpen={isOpenImage}
        setIsOpen={setIsOpenImage}
        src={fileSrc}
      />
      <ModalPdf isOpen={isOpenPdf} setIsOpen={setIsOpenPdf} src={fileSrc} />
    </>
  );
};
export default ModalAdd;
