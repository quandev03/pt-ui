import {
  AnyElement,
  CButtonClose,
  CButtonSave,
  CButtonSaveAndAdd,
  CTextArea,
  IErrorResponse,
  IFieldErrorsItem,
  IModeAction,
  TitleHeader,
  UploadFileTemplate,
  useActionMode,
  Wrapper,
} from '@vissoft-react/common';
import { Card, Col, Form, Row, Space, Spin } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAddUploadNumber from '../hook/useAddUploadNumber';
import { useDownloadResourceFile } from '../hook/useDownloadResourceFile';
import useGetDetailUploadNumber from '../hook/useGetDetailUploadNumber';
import { useGetFileSample } from '../hook/useGetFileSample';
import { urlUploadNumber } from '../services/url';
import { IFormUploadNumber } from '../types';

export const ActionPage = () => {
  const actionType = useActionMode();
  const [form] = Form.useForm();
  const [submitType, setSubmitType] = useState<string>('');
  const { id } = useParams();
  const navigate = useNavigate();
  const renderTitle = () => {
    switch (actionType) {
      case IModeAction.CREATE:
        return 'Upload tài nguyên số';
      case IModeAction.READ:
        return 'Xem chi tiết upload tài nguyên số';
      default:
        return '';
    }
  };
  const { mutate } = useGetFileSample();
  const handleExport = () => {
    mutate({
      uri: `${urlUploadNumber}/samples/csv`,
    });
  };
  const {
    data: getNumberUploadTransactionDetail,
    isLoading: loadingGetDetailUploadDigitalResources,
  } = useGetDetailUploadNumber(id as string);
  const handleClose = useCallback(() => {
    form.resetFields();
    navigate(-1);
  }, [form, navigate]);
  const handleCloseAddSave = useCallback(() => {
    form.resetFields();
  }, [form]);

  const setFieldError = useCallback(
    (fieldErrors: IFieldErrorsItem[]) => {
      form.setFields(
        fieldErrors.map((item: IFieldErrorsItem) => ({
          name: item.field,
          errors: [item.detail],
        }))
      );
    },
    [form]
  );
  const { mutate: addUploadDigitalResources, isPending: loadingAdd } =
    useAddUploadNumber(() => {
      if (submitType === 'saveAndAdd') {
        handleCloseAddSave();
      } else {
        handleClose();
      }
    });
  const numberTransactionDetail = useMemo(() => {
    if (!getNumberUploadTransactionDetail) return null;
    return getNumberUploadTransactionDetail;
  }, [getNumberUploadTransactionDetail]);

  const onFinish = (values: IFormUploadNumber) => {
    addUploadDigitalResources(values, {
      onError: (error: AnyElement) => {
        if (error.errors && error.errors.length > 0) {
          setFieldError(error.errors);
        }
      },
    });
  };

  useEffect(() => {
    if (actionType === IModeAction.READ && id && numberTransactionDetail) {
      form.setFieldsValue({
        description: numberTransactionDetail.description,
        numberFile: {},
      });
    }
  }, [
    actionType,
    id,
    numberTransactionDetail,
    loadingGetDetailUploadDigitalResources,
  ]);
  const { mutate: handleDownloadFile } = useDownloadResourceFile();
  const handleDownloadUploadFile = useCallback(() => {
    handleDownloadFile({
      uri: '',
    });
  }, [handleDownloadFile]);
  return (
    <Wrapper>
      <TitleHeader>{renderTitle()}</TitleHeader>
      <Form
        form={form}
        onFinish={onFinish}
        colon={false}
        layout="horizontal"
        disabled={actionType === IModeAction.READ}
        initialValues={{ files: [{}] }}
        labelCol={{ flex: '150px' }}
      >
        <Spin spinning={loadingAdd || loadingGetDetailUploadDigitalResources}>
          <Card className="mb-4">
            <Row gutter={24}>
              <Col span={24}>
                <UploadFileTemplate
                  required
                  onDownloadTemplate={handleExport}
                  accept={['text/csv']}
                  label="Danh sách số"
                  name={'numberFile'}
                  onDownloadFile={
                    actionType === IModeAction.READ
                      ? handleDownloadUploadFile
                      : undefined
                  }
                />
              </Col>
              <Col span={22}></Col>
              <Col className="mt-4" span={24}>
                <Form.Item
                  name="description"
                  className="items-center"
                  label="Ghi chú"
                >
                  <CTextArea maxLength={200} rows={3} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Spin>

        <Row justify="end">
          <Space size="middle">
            {actionType === IModeAction.CREATE ? (
              <>
                <CButtonSaveAndAdd
                  onClick={() => setSubmitType('saveAndAdd')}
                  loading={loadingAdd}
                  htmlType="submit"
                />
                <CButtonSave
                  onClick={() => setSubmitType('save')}
                  loading={loadingAdd}
                  htmlType="submit"
                />
                <CButtonClose
                  disabled={false}
                  onClick={() => {
                    navigate(-1);
                    form.resetFields();
                  }}
                />
              </>
            ) : (
              <CButtonClose disabled={false} onClick={handleClose} />
            )}
          </Space>
        </Row>
      </Form>
    </Wrapper>
  );
};
