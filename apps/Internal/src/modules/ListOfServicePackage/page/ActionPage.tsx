import {
  CButtonClose,
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
  CInput,
  CSelect,
  CSwitch,
  CTextArea,
  CTextInfo,
  EActionSubmit,
  getActionMode,
  getBase64,
  ImageFileType,
  IModeAction,
  MESSAGE,
  NotificationError,
  NumberInput,
  StatusEnum,
  TitleHeader,
  useActionMode,
  validateForm,
} from '@vissoft-react/common';
import { Button, Card, Col, Form, Row, Space, Spin, Upload } from 'antd';
import { RcFile } from 'antd/es/upload';
import { pathRoutes } from 'apps/Internal/src/routers';
import { UploadIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetImage } from '../hook';
import { useAdd } from '../hook/useAdd';
import { useEdit } from '../hook/useEdit';
import { useView } from '../hook/useView';
import { IListOfServicePackageForm } from '../types';

export const ActionPage = () => {
  const actionMode = useActionMode();
  const [type, setType] = useState<EActionSubmit | null>(null);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { id } = useParams();
  const { data: dataView } = useView(id ?? '', actionMode);
  const { mutate: mutateEdit } = useEdit(form, () => {
    navigate(-1);
    setImageUrl(null);
  });
  const { mutate: mutateAdd } = useAdd(form, () => {
    if (type === EActionSubmit.SAVE_AND_ADD) {
      form.resetFields([
        'pckCode',
        'pckName',
        'packagePrice',
        'images',
        'description',
        'cycleValue',
      ]);
      setImageUrl(null);
    } else {
      form.resetFields([
        'pckCode',
        'pckName',
        'packagePrice',
        'images',
        'description',
        'cycleValue',
      ]);
      setImageUrl(null);
      navigate(-1);
    }
  });
  const [imageUrl, setImageUrl] = useState<string | null | undefined>(null);
  const [isChangeImage, setIsChangeImage] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { mutate: mutateGetImage } = useGetImage((blobData) => {
    try {
      if (blobData instanceof Blob) {
        const url = window.URL.createObjectURL(blobData);
        setImageUrl(url);
        setImageError(false);
        const existingFile = new File([blobData], 'image.jpg', {
          type: blobData.type || 'image/jpeg',
        });
        form.setFieldValue('images', {
          file: existingFile,
        });
      } else {
        setImageError(true);
        setImageUrl(null);
      }
    } catch (error) {
      setImageError(true);
      setImageUrl(null);
    }
  });

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
        message: MESSAGE.G13,
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
    setImageError(false);
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

  // Placeholder component for when image fails to load
  const imagePlaceholder = (
    <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl h-36 w-[200px] flex flex-col items-center justify-center">
      <div className="text-gray-400 text-sm">Ảnh gói cước</div>
      <div className="text-gray-300 text-xs">Không có ảnh</div>
    </div>
  );

  const handleDeleteImage = () => {
    // Cleanup object URL if it exists
    if (imageUrl && imageUrl.startsWith('blob:')) {
      window.URL.revokeObjectURL(imageUrl);
    }
    setImageUrl(undefined);
    setIsChangeImage(true);
    setImageError(false);
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
      // The form stores the File directly in `images`
      const imageData = form.getFieldValue('images')?.file ?? undefined;
      const data = {
        ...values,
        images: imageData,
      };
      if (actionMode === IModeAction.CREATE) {
        mutateAdd(data);
      } else {
        mutateEdit({
          ...data,
          id: id ?? '',
          images: imageData,
          status: values.status ? StatusEnum.ACTIVE : StatusEnum.INACTIVE,
        });
      }
    },
    [form, id, mutateAdd, mutateEdit, actionMode, isChangeImage]
  );

  useEffect(() => {
    if (dataView && id) {
      form.setFieldsValue({
        ...dataView,
        status: dataView.status === StatusEnum.ACTIVE,
      });
      mutateGetImage(id);
    }
  }, [dataView, form, id, mutateGetImage]);

  // Cleanup object URL when component unmounts or imageUrl changes
  useEffect(() => {
    const currentImageUrl = imageUrl;
    return () => {
      if (currentImageUrl && currentImageUrl.startsWith('blob:')) {
        window.URL.revokeObjectURL(currentImageUrl);
      }
    };
  }, [imageUrl]);
  useEffect(() => {
    if (actionMode === IModeAction.CREATE) {
      form.setFieldValue('status', true);
    }
  }, [actionMode, form]);
  const unitOptions = [
    { label: 'Ngày', value: 0 },
    { label: 'Tháng', value: 1 },
  ];
  return (
    <div className="flex flex-col w-full h-full">
      <TitleHeader>{`${getActionMode(actionMode)} gói cước`}</TitleHeader>
      <Spin spinning={false}>
        <Form
          form={form}
          labelCol={{ flex: '120px' }}
          colon={false}
          onFinish={handleSubmit}
          labelAlign="left"
          initialValues={{ cycleUnit: 0 }}
        >
          <Card className="mb-2">
            <CTextInfo>Thông tin gói cước</CTextInfo>
            <Row className="mt-2" gutter={[30, 0]}>
              <Col span={12}>
                <Form.Item label="Hoạt động" name="status">
                  <CSwitch disabled={actionMode !== IModeAction.UPDATE} />
                </Form.Item>
              </Col>
              <Col span={12} />
              <Col span={12}>
                <Form.Item
                  rules={[validateForm.required]}
                  label="Mã gói cước"
                  name="pckCode"
                >
                  <CInput
                    disabled={actionMode !== IModeAction.CREATE}
                    placeholder="Nhập mã gói cước"
                    maxLength={20}
                    preventVietnamese
                    preventSpace
                    uppercase
                    preventSpecialExceptHyphenAndUnderscore
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  rules={[validateForm.required]}
                  label="Tên gói cước"
                  name="pckName"
                >
                  <CInput
                    disabled={actionMode === IModeAction.READ}
                    maxLength={100}
                    placeholder="Nhập tên gói cước"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  rules={[validateForm.required]}
                  label="Chu kỳ"
                  name="cycleValue"
                >
                  <CInput
                    disabled={actionMode === IModeAction.READ}
                    maxLength={3}
                    placeholder="Nhập chu kỳ"
                    onlyNumber
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Đơn vị" name="cycleUnit">
                  <CSelect
                    disabled={actionMode === IModeAction.READ}
                    placeholder="Chọn đơn vị"
                    options={unitOptions}
                    allowClear={false}
                  />
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
                        if (
                          value === undefined ||
                          value === null ||
                          value === ''
                        ) {
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
                    {imageUrl && !imageError ? (
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
                          onError={() => setImageError(true)}
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
                    ) : actionMode === IModeAction.CREATE &&
                      !imageUrl &&
                      !imageError ? (
                      uploadButton
                    ) : (
                      <div className="relative inline-block">
                        {actionMode !== IModeAction.READ && uploadButton}
                        {actionMode === IModeAction.READ && imagePlaceholder}
                      </div>
                    )}
                  </Upload>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Mô tả" name="description">
                  <CTextArea
                    disabled={actionMode === IModeAction.READ}
                    placeholder="Nhập mô tả"
                    maxLength={200}
                    rows={3}
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
                    disabled={false}
                    htmlType="submit"
                    onClick={() => setType(EActionSubmit.SAVE_AND_ADD)}
                  />
                  <CButtonSave
                    disabled={false}
                    htmlType="submit"
                    onClick={() => setType(EActionSubmit.SAVE)}
                  >
                    Lưu
                  </CButtonSave>
                  <CButtonClose onClick={() => navigate(-1)} disabled={false} />
                </>
              )}
              {actionMode === IModeAction.READ && (
                <>
                  <CButtonEdit
                    onClick={() => {
                      navigate(pathRoutes.listOfServicePackageEdit(id));
                    }}
                    disabled={false}
                  />
                  <CButtonClose onClick={() => navigate(-1)} disabled={false} />
                </>
              )}
              {actionMode === IModeAction.UPDATE && (
                <>
                  <CButtonSave disabled={false} htmlType="submit" />
                  <CButtonClose onClick={() => navigate(-1)} disabled={false} />
                </>
              )}
            </Space>
          </Row>
        </Form>
      </Spin>
    </div>
  );
};
