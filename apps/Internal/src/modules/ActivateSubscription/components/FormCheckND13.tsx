import {
  Col,
  Collapse,
  Form,
  Row,
  Table,
  TableColumnsType,
  Typography,
  Upload,
} from 'antd';
import Checkbox from '@react/commons/Checkbox';
import {
  ItemConfig,
  useGetApplicationConfig,
} from '../hooks/useGetApplicationConfig';
import { Key, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesDown, faAnglesUp } from '@fortawesome/free-solid-svg-icons';
import Button from '@react/commons/Button';
import validateForm from '@react/utils/validator';
import { useDownloadFilePdfMutation } from '../hooks/useDownloadFilePdfMutation';
import useActiveSubscriptStore from '../store';
import { ImageFileType } from '@react/constants/app';
import { MESSAGE } from '@react/utils/message';
import { RcFile } from 'antd/lib/upload';
import ModalImage from './ModalImage';
import ModalPdf from './ModalPdf';
import { NotificationSuccess } from '@react/commons/Notification';
import imageCompression from 'browser-image-compression';
import { useLocation } from 'react-router-dom';
import { pathRoutes } from 'apps/Internal/src/constants/routes';

const FormCheckND13 = () => {
  const form = Form.useFormInstance();
  const { mutate: mutateDownloadFilePdf } = useDownloadFilePdfMutation();
  const pkName = Form.useWatch('pkName', form);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {
    isSignND13Success,
    setSignND13Success,
    imageNd13,
    setImageNd13,
    activeKeyNd13: activeKey,
    setActiveKeyNd13: setActiveKey,
    selectedRowKeys,
    setSelectedRowKeys,
  } = useActiveSubscriptStore();

  const [isOpenPdf, setIsOpenPdf] = useState<boolean>(false);
  const { data: dataApplicationConfig, isLoading } =
    useGetApplicationConfig('SUB_DOCUMENT_ND13');
  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  useEffect(() => {
    if (dataApplicationConfig && dataApplicationConfig?.length > 0) {
      const listId = dataApplicationConfig?.map((item) => item.code);
      setSelectedRowKeys(listId);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [dataApplicationConfig?.length]);

  const rowSelection = {
    selectedRowKeys,
    columnWidth: 100,
    columnTitle: 'ĐỒNG Ý',
    onChange: onSelectChange,
    getCheckboxProps: (record: ItemConfig) => ({
      disabled: record.value === '1',
    }),
  };

  const columns: TableColumnsType<ItemConfig> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 50,
      render: (_, __, idx: number) => {
        return <div>{idx + 1}</div>;
      },
    },
    {
      title: 'MỤC ĐÍCH XỬ LÝ',
      dataIndex: 'name',
      width: 1000,
    },
  ];

  const beforeUpload = async (compressedFile: RcFile) => {
    if (!ImageFileType.includes(compressedFile.type || '')) {
      form.setFields([
        {
          name: 'fileND13',
          errors: [MESSAGE.G31],
        },
      ]);
      return;
    }

    const options = {
      maxSizeMB: 0.488,
      useWebWorker: true,
      maxWidthOrHeight: 1024,
    };
    const p1 = new Promise(function (resolve, reject) {
      setTimeout(resolve, 10000, compressedFile);
    });
    const race = Promise.race([p1, imageCompression(compressedFile, options)]);

    race.then(async (response) => {
      const file: any = response;
      // if (file.size && file.size > UploadFileMax) {
      //   form.setFields([
      //     {
      //       name: 'fileND13',
      //       errors: ["'Nén không thành công'"],
      //     },
      //   ]);
      //   return;
      // }
      const fileFormBlob = new File([file], file.name, { type: file.type });
      form.setFieldsValue({
        fileND13: `${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`,
        decree13: fileFormBlob,
      });
      form.validateFields(['fileND13']);
      const url = await imageCompression.getDataUrlFromFile(file);
      setImageNd13(url);
      setSignND13Success(false);
      NotificationSuccess('Tải ảnh thành công');
      setActiveKey('');
    });

    return false;
  };

  const handlePreview = () => {
    if (isSignND13Success) {
      setIsOpenPdf(true);
      return;
    }
    if (imageNd13.length > 0) {
      setIsOpen(true);
    }
  };

  const handleChangeCollapse = () => {
    setActiveKey(activeKey === '1' ? '' : '1');
  };

  return (
    <fieldset>
      <legend>
        <Checkbox checked={true} disabled></Checkbox>Đồng ý chia sẻ dữ liệu theo
        NĐ13
        <Button
          type="text"
          icon={
            <FontAwesomeIcon
              className="cursor-pointer"
              icon={activeKey === '1' ? faAnglesUp : faAnglesDown}
              size="lg"
            />
          }
          title="Làm mới"
          onClick={handleChangeCollapse}
        />
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
                {location.pathname !==
                  pathRoutes.activationRequestListCreate && (
                  <Col span={12}>
                    <Upload
                      accept={ImageFileType.join(',')}
                      showUploadList={false}
                      beforeUpload={beforeUpload}
                      multiple={false}
                      maxCount={1}
                    >
                      <Button disabled={!pkName} className="w-[8.5rem]">
                        Tải ảnh lên
                      </Button>
                    </Upload>
                  </Col>
                )}
              </Row>
            )
          }
          key="1"
        >
          <>
            <div
              className="w-fit"
              onClick={() =>
                mutateDownloadFilePdf({
                  uri: '/file/template/template_nd13_off.pdf',
                  filename: 'bien_ban_xac_nhan_ND13',
                })
              }
            >
              <Typography.Link underline target="_blank">
                Biên bản xác nhận NĐ13
              </Typography.Link>
            </div>
            <div
              className="w-fit"
              onClick={() =>
                mutateDownloadFilePdf({
                  uri: '/file/template/noi_dung_chi_tiet_nd13.pdf',
                  filename: 'chinh_sach_VBCT',
                })
              }
            >
              <Typography.Link underline target="_blank">
                Biểu mẫu/ Chính sách VBCT
              </Typography.Link>
            </div>
            <br />
            <Table
              bordered
              columns={columns}
              rowSelection={rowSelection}
              rowKey={'code'}
              dataSource={dataApplicationConfig}
              loading={isLoading}
              pagination={false}
            />
            <br />
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
              {location.pathname !== pathRoutes.activationRequestListCreate && (
                <Col span={4}>
                  <Upload
                    accept={ImageFileType.join(',')}
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    multiple={false}
                    maxCount={1}
                  >
                    <Button disabled={!pkName} className="w-[8.5rem]">
                      Tải ảnh lên
                    </Button>
                  </Upload>
                </Col>
              )}
            </Row>
          </>
        </Collapse.Panel>
      </Collapse>
      <Form.Item label="" name="decree13" hidden></Form.Item>
      <ModalImage isOpen={isOpen} setIsOpen={setIsOpen} src={imageNd13} />
      {isOpenPdf && (
        <ModalPdf
          isOpen={isOpenPdf}
          setIsOpen={setIsOpenPdf}
          isSigned={false}
          isND13
        />
      )}
    </fieldset>
  );
};

export default FormCheckND13;
