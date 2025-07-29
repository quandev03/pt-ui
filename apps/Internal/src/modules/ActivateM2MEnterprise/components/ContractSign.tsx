import { Col, Flex, Form, Row, Typography } from 'antd';
import validateForm from '@react/utils/validator';
import { CInput, CSelect } from '../../../../../../commons/src/lib/commons';
import { useGetApplicationConfig } from '../hooks/useGetApplicationConfig';
import { useEffect, useState } from 'react';
import { useSubsList } from '../hooks/useListSub';
import { useSubsDetail } from '../hooks/useSubDetail';
import useActivateM2M from '../store';
import CadastralSelect from './Cadastral';
import UploadImage from './UploadImage';
import {
  useGetImage,
  useGetPdf,
} from 'apps/Internal/src/components/layouts/queryHooks';
import ModalPdf from './ModalPdf';
import ModalImage from './ModalImage';
import { useSuperDetail } from '../hooks/useEnterpriseSupervisor';

const ThongTinKichHoat = () => {
  const form = Form.useFormInstance();

  const { setDisableButtonCheck, listSub, isSub, setIsSub } = useActivateM2M();

  const [isOpenPdf, setIsOpenPdf] = useState<boolean>(false);
  const [isPdf, setIsPdf] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data: pdfBlobUrl } = useGetPdf(
    form.getFieldValue('authorizedFilePath')
  );
  const { data: imageBlobUrl } = useGetImage(
    form.getFieldValue('authorizedFilePath')
  );
  const handlePreview = () => {
    if (isPdf) {
      setIsOpenPdf(true);
    } else if (!isPdf) {
      setIsOpen(true);
    }
    return;
  };

  useEffect(() => {
    const splitStr = String(form.getFieldValue('authorizedFilePath')).split(
      '.'
    );
    if (splitStr[splitStr.length - 1] !== 'PDF') {
      setIsPdf(false);
    } else {
      setIsPdf(true);
    }
  }, [form.getFieldValue('authorizedFilePath')]);

  const {
    data: dataApplicationConfigIdType,
    isLoading: isLoadingIdTypeIdType,
  } = useGetApplicationConfig('ID_TYPE');
  const { data: dataApplicationConfigSex, isLoading: isLoadingSex } =
    useGetApplicationConfig('SEX');
  const { mutate: getSupervisor } = useSuperDetail();
  const { mutate: getSubDetail } = useSubsDetail(form);

  const dataSubOptions = listSub?.map((item: any) => ({
    label: item.name,
    value: item.id,
  }));

  const handleBlur = (e: any) => {
    form.setFieldValue('issue_by', e.target.value.trim());
    form.validateFields(['issue_by']);
  };

  const handleChangeRole = (value: any) => {
    if (value === 2) {
      getSupervisor(form.getFieldValue('enterpriseId'));
      setIsSub(false);
    } else {
      setIsSub(true);
    }
    form.resetFields([
      'responsiblePerson',
      'responsibleInfo',
      'startDate',
      'endDate',
      'idType',
      'name',
      'idNo',
      'idIssueDate',
      'idIssuePlace',
      'birthday',
      'sex',
      'address',
      'province',
      'district',
      'precinct',
      'idExpiry',
      'idFrontPath',
      'idBackPath',
      'portraitPath',
      'authorizedFilePath',
    ]);
  };

  return (
    <fieldset>
      <legend>
        <span>Thông tin người giao kết hợp đồng</span>
      </legend>
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item
            label="Vai trò người giao kết HĐ"
            name="contractSignerType"
            rules={[validateForm.required]}
            labelCol={{ span: 6 }}
            initialValue={1}
          >
            <CSelect
              disabled={!form.getFieldValue('enterpriseId')}
              options={[
                {
                  label: 'Người đại diện',
                  value: 2,
                },
                {
                  label: 'Người ủy quyền',
                  value: 1,
                },
              ]}
              placeholder="Chọn vai trò người giao kết HĐ"
              onChange={(value) => {
                handleChangeRole(value);
              }}
              allowClear={false}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Người ủy quyền"
            name="responsiblePerson"
            rules={[
              {
                required: isSub,
                message: 'Không được để trống trường này',
              },
            ]}
            hidden={!isSub}
          >
            <CSelect
              disabled={!form.getFieldValue('enterpriseId')}
              options={dataSubOptions}
              placeholder="Chọn người ủy quyền"
              onChange={(value) => {
                getSubDetail(value);
                setDisableButtonCheck(false);
              }}
              allowClear={false}
            />
          </Form.Item>
        </Col>
      </Row>
      <br />
      <Row gutter={12}>
        <Col span={24}>
          <Flex gap={16} justify="center">
            <div className="flex flex-col items-center w-1/4">
              <UploadImage
                url={form.getFieldValue('idFrontPath')}
                name="idFrontPath"
                label="Ảnh GTTT mặt trước"
              />
            </div>
            <div className="flex flex-col items-center w-1/4">
              <UploadImage
                url={form.getFieldValue('idBackPath')}
                name="idBackPath"
                label="Ảnh GTTT mặt sau"
              />
            </div>
            <div className="flex flex-col items-center w-1/4">
              <UploadImage
                url={form.getFieldValue('portraitPath')}
                name="portraitPath"
                label="Ảnh chân dung"
              />
            </div>
          </Flex>
        </Col>
      </Row>
      <br />
      <Row gutter={12}>
        <Col span={24}>
          <Form.Item
            label="Thông tin ủy quyền"
            name="responsibleInfo"
            hidden={!isSub}
          >
            <Typography.Link underline target="_blank" onClick={handlePreview}>
              {form.getFieldValue('responsiblePerson')
                ? 'Thông tin ủy quyền'
                : ''}
            </Typography.Link>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Ngày bắt đầu"
            name="startDate"
            rules={[validateForm.required, validateForm.maxLength(50)]}
            hidden={!isSub}
          >
            <CInput
              disabled={true}
              placeholder="Ngày bắt đầu"
              maxLength={50}
              onChange={() => setDisableButtonCheck(false)}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Ngày kết thúc"
            name="endDate"
            rules={[validateForm.required, validateForm.maxLength(50)]}
            hidden={!isSub}
          >
            <CInput
              disabled={true}
              placeholder="Ngày kết thúc"
              maxLength={50}
              onlyNumber
              onChange={() => setDisableButtonCheck(false)}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Loại giấy tờ"
            name="idType"
            rules={[validateForm.required]}
          >
            <CSelect
              disabled={true}
              fieldNames={{ label: 'code', value: 'value' }}
              loading={isLoadingIdTypeIdType}
              options={dataApplicationConfigIdType}
              placeholder="Loại giấy tờ"
              onChange={() => setDisableButtonCheck(false)}
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
              disabled={true}
              placeholder="Họ và tên"
              maxLength={50}
              onChange={() => setDisableButtonCheck(false)}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Số giấy tờ"
            name="idNo"
            rules={[validateForm.required, validateForm.maxLength(50)]}
          >
            <CInput
              disabled={true}
              placeholder="Số giấy tờ"
              maxLength={50}
              onlyNumber
              onChange={() => setDisableButtonCheck(false)}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Nơi cấp"
            name="idIssuePlace"
            rules={[validateForm.required, validateForm.maxLength(200)]}
          >
            <CInput
              disabled={true}
              placeholder="Nơi cấp"
              maxLength={200}
              onBlur={handleBlur}
              onChange={() => setDisableButtonCheck(false)}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Ngày cấp"
            name="idIssueDate"
            rules={[validateForm.required]}
          >
            <CInput
              disabled={true}
              placeholder="Ngày cấp"
              onChange={() => {
                form.validateFields(['birthday']);
                setDisableButtonCheck(false);
              }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Ngày sinh"
            name="birthday"
            rules={[validateForm.required]}
          >
            <CInput
              disabled={true}
              placeholder="Ngày sinh"
              onChange={() => setDisableButtonCheck(false)}
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
              fieldNames={{ label: 'name', value: 'value' }}
              loading={isLoadingSex}
              options={dataApplicationConfigSex}
              disabled={true}
              placeholder="Giới tính"
              onChange={() => setDisableButtonCheck(false)}
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
              disabled={true}
              placeholder="Địa chỉ thường trú"
              maxLength={200}
              onChange={() => setDisableButtonCheck(false)}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Ngày hết hạn giấy tờ" name="idExpiry">
            <CInput
              disabled={true}
              placeholder="Ngày hết hạn giấy tờ"
              onChange={() => setDisableButtonCheck(false)}
            />
          </Form.Item>
          <Form.Item
            label="Ngày hết hạn"
            name="idExpiryDateNote"
            rules={[validateForm.maxLength(50)]}
          >
            <CInput
              disabled={true}
              placeholder="Nhập thông tin"
              maxLength={50}
              onChange={() => setDisableButtonCheck(false)}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <CadastralSelect
            required={true}
            onChangeProp={() => setDisableButtonCheck(false)}
            formName={{
              province: 'province',
              district: 'district',
              village: 'precinct',
            }}
          />
        </Col>
      </Row>
      {isOpen && (
        <ModalImage
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          src={imageBlobUrl || ''}
        />
      )}
      {isOpenPdf && (
        <ModalPdf
          isOpen={isOpenPdf}
          setIsOpen={setIsOpenPdf}
          isSigned={false}
          isND13
          pdfUrl={pdfBlobUrl}
        />
      )}
    </fieldset>
  );
};

export default ThongTinKichHoat;
