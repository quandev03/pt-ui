import {
  AnyElement,
  CButtonClose,
  CButtonDelete,
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
  CInput,
  CSwitch,
  CTextInfo,
  EActionSubmit,
  EStatus,
  getActionMode,
  getBase64,
  ImageFileType,
  IModeAction,
  MESSAGE,
  NotificationError,
  NumberInput,
  TitleHeader,
  useActionMode,
  validateForm,
} from '@vissoft-react/common';
import {
  Button,
  Card,
  Col,
  Form,
  Row,
  Space,
  Spin,
  Switch,
  Upload,
} from 'antd';
import { RcFile } from 'antd/es/upload';
import { UploadIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { IListOfServicePackageForm } from '../types';
import { useNavigate, useParams } from 'react-router-dom';
import { useView } from '../hook/useView';
import { useDelete } from '../hook/useDelete';
import { useEdit } from '../hook/useEdit';
import { useAdd } from '../hook/useAdd';

export const ActionPage = () => {
  const actionMode = useActionMode();
  const [type, setType] = useState<EActionSubmit | null>(null);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { id } = useParams();
  const { data: dataView } = useView(id ?? '');
  const { mutate: mutateDelete } = useDelete(() => {
    navigate(-1);
  });
  const { mutate: mutateEdit } = useEdit();
  const { mutate: mutateAdd } = useAdd(() => {
    if (type === EActionSubmit.SAVE_AND_ADD) {
      form.resetFields();
      setImageUrl(null);
    } else {
      form.resetFields();
      setImageUrl(null);
      navigate(-1);
    }
  });
  const [imageUrl, setImageUrl] = useState<string | null | undefined>(null);
  const [isChangeImage, setIsChangeImage] = useState(false);
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
      NotificationError({
        message: MESSAGE.G31,
      });
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
  const uploadButton = (
    <button
      className={
        'border-2 border-dashed border-cyan-600 bg-none rounded-md px-16 py-8 flex flex-col items-center justify-center' +
        (actionMode === IModeAction.READ
          ? 'cursor-not-allowed'
          : 'cursor-pointer')
      }
      type="button"
    >
      <UploadIcon className="text-3xl text-cyan-700" />
      <div className="mt-2 text-cyan-700">Tải file lên</div>
    </button>
  );
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
  const handleSubmit = useCallback(
    (values: IListOfServicePackageForm) => {
      const data = {
        ...values,
        images: form.getFieldValue('images')?.file ?? undefined,
      };
      console.log('data', data);
      if (actionMode === IModeAction.CREATE) {
        mutateAdd(data);
      } else {
        mutateEdit({
          ...data,
          id: id ?? '',
        });
      }
    },
    [form, id, mutateAdd, mutateEdit]
  );
  const handleDelete = useCallback(() => {
    mutateDelete(id ?? '');
  }, [mutateDelete, id]);
  useEffect(() => {
    if (dataView) {
      form.setFieldsValue({
        ...dataView,
      });
    }
  }, [dataView]);
  return (
    <div className="flex flex-col w-full h-full">
      <TitleHeader>{`${getActionMode(actionMode)} gói cước`}</TitleHeader>
      <Spin spinning={false}>
        <Form
          disabled={actionMode === IModeAction.READ}
          form={form}
          labelCol={{ span: 4 }}
          colon={false}
          onFinish={handleSubmit}
        >
          <Card className="mb-2">
            <CTextInfo>Thông tin gói cước</CTextInfo>
            <Row className="mt-2" gutter={[24, 12]}>
              <Col span={12}>
                <Form.Item
                  rules={[validateForm.required]}
                  label="Mã gói cước"
                  name="pckCode"
                >
                  <CInput placeholder="Nhập mã gói cước" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  rules={[validateForm.required]}
                  label="Tên gói cước"
                  name="pckName"
                >
                  <CInput placeholder="Nhập tên gói cước" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Giá gói cước"
                  name="packagePrice"
                  required
                  rules={[
                    {
                      validator(_, value) {
                        if (!value || value.length === 0) {
                          return Promise.reject(
                            'Không được để trống trường này'
                          );
                        } else {
                          return Promise.resolve();
                        }
                      },
                    },
                  ]}
                >
                  <NumberInput
                    disabled={actionMode === IModeAction.READ}
                    placeholder="Nhập giá"
                    addonAfter="VND"
                    maxLength={11}
                    thousandSeparator="."
                    decimalSeparator=","
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Ảnh gói cước" name="images">
                  <Upload
                    accept={ImageFileType.join(',')}
                    showUploadList={false}
                    disabled={actionMode === IModeAction.READ}
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
                            (actionMode === IModeAction.READ
                              ? 'cursor-not-allowed'
                              : 'cursor-pointer')
                          }
                        />
                        {actionMode !== IModeAction.READ && (
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
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
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
                <Form.Item label="Hoạt động" name="status">
                  <CSwitch
                    disabled={actionMode !== IModeAction.UPDATE}
                    checked={true}
                    onChange={(value) => {
                      console.log('value', value);
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Row justify="end" className="mt-4">
            <Space size="middle">
              {actionMode === IModeAction.CREATE && (
                <>
                  <CButtonSaveAndAdd
                    htmlType="submit"
                    onClick={() => setType(EActionSubmit.SAVE_AND_ADD)}
                  />
                  <CButtonSave
                    htmlType="submit"
                    onClick={() => setType(EActionSubmit.SAVE)}
                  >
                    Lưu
                  </CButtonSave>
                  <CButtonClose type="default" onClick={() => navigate(-1)}>
                    Đóng
                  </CButtonClose>
                </>
              )}
              {actionMode === IModeAction.READ && (
                <>
                  <CButtonDelete onClick={handleDelete}>Xóa</CButtonDelete>
                  <CButtonEdit
                    htmlType="submit"
                    onClick={() => setType(EActionSubmit.SAVE)}
                  >
                    Sửa
                  </CButtonEdit>
                  <CButtonClose type="default" onClick={() => navigate(-1)}>
                    Đóng
                  </CButtonClose>
                </>
              )}
              {actionMode === IModeAction.UPDATE && (
                <>
                  <CButtonSave
                    htmlType="submit"
                    onClick={() => setType(EActionSubmit.SAVE)}
                  >
                    Lưu
                  </CButtonSave>
                  <CButtonClose type="default" onClick={() => navigate(-1)}>
                    Đóng
                  </CButtonClose>
                </>
              )}
            </Space>
          </Row>
        </Form>
      </Spin>
    </div>
  );
};
