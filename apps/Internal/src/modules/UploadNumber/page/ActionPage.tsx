import { Card, Col, Form, Row, Space, Spin } from 'antd';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { TitleHeader } from '@react/commons/Template/style';
import {
  CButtonClose,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { ActionType } from '@react/constants/app';
import {
  CModalConfirm,
  CTextArea,
  CUploadFileTemplate,
  WrapperPage,
} from '@react/commons/index';
import CTableUploadFile, { FileData } from '@react/commons/TableUploadFile';
import { urlUploadNumber } from '../services/url';
import useAddUploadNumber from '../hook/useAddUploadNumber';
import useGetDetailUploadNumber from '../hook/useGetDetailUploadNumber';
import { useGetFileSample } from '../hook/useGetFileSample';
import { DeliveryOrderApprovalStatusList } from '@react/constants/status';
import CButtonCancel from '../../StockOutForDistributor/components/CButtonCancel';
import useCancelUpload from '../hook/useCancelUpload';
import { useDownloadResourceFile } from 'apps/Internal/src/hooks/useGetFileDownload';

import { DefaultNumberTransactionDetail } from 'apps/Internal/src/constants/constants';
import { IFieldErrorsItem } from '@react/commons/types';

type Props = {
  actionType: ActionType;
  isEnabledApproval?: boolean;
};

const ModalAddView: FC<Props> = ({ actionType, isEnabledApproval = false }) => {
  const [form] = Form.useForm();
  const [submitType, setSubmitType] = useState<string>('');
  const { id } = useParams();
  const navigate = useNavigate();
  const renderTitle = () => {
    switch (actionType) {
      case ActionType.ADD:
        return 'Upload tài nguyên số';
      case ActionType.VIEW:
        return 'Xem chi tiết upload';
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
      console.log(fieldErrors);
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
    }, setFieldError);
  const numberTransactionDetail = useMemo(() => {
    if (!getNumberUploadTransactionDetail)
      return DefaultNumberTransactionDetail;
    return getNumberUploadTransactionDetail;
  }, [getNumberUploadTransactionDetail]);

  const onFinish = (values: Record<string, any>) => {
    addUploadDigitalResources(values);
  };

  useEffect(() => {
    if (
      actionType === ActionType.VIEW &&
      id &&
      !loadingGetDetailUploadDigitalResources &&
      numberTransactionDetail
    ) {
      form.setFieldsValue({
        description: numberTransactionDetail.description,
        files: numberTransactionDetail.attachments?.map((item) => {
          return {
            name: item.fileName,
            desc: item.description,
            size: item.size,
            url: item.fileUrl,
            date: item.createdDate,
          };
        }),
        numberFile: {
          name: numberTransactionDetail.uploadFile?.fileName,
        },
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
      uri: numberTransactionDetail.uploadFile?.fileUrl ?? '',
    });
  }, [handleDownloadFile, numberTransactionDetail.uploadFile?.fileUrl]);
  const handleDownloadAttachment = useCallback(
    (record: FileData) => {
      handleDownloadFile({
        uri: record.url ?? '',
      });
    },
    [handleDownloadFile]
  );
  const { mutate: cancelUpload, isPending: loadingCancelUpload } =
    useCancelUpload();
  const handleCancelUpload = useCallback(() => {
    CModalConfirm({
      message: 'Bạn có chắc chắn hủy upload tài nguyên số không?',
      onOk: () => id && cancelUpload(id),
    });
  }, [cancelUpload, id]);
  return (
    <WrapperPage>
      <TitleHeader>{renderTitle()}</TitleHeader>
      <Form
        form={form}
        onFinish={onFinish}
        colon={false}
        layout="horizontal"
        disabled={actionType === ActionType.VIEW}
        initialValues={{ files: [{}] }}
        labelCol={{ flex: '150px' }}
      >
        <Spin spinning={loadingAdd || loadingGetDetailUploadDigitalResources}>
          <Card className="mb-4">
            <Row gutter={24}>
              <Col span={24}>
                <CUploadFileTemplate
                  required
                  onDownloadTemplate={handleExport}
                  accept={['text/csv']}
                  label="Danh sách số"
                  name={'numberFile'}
                  onDownloadFile={
                    actionType === ActionType.VIEW
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
              <Col span={24}>
                <CTableUploadFile
                  showAction={actionType !== ActionType.VIEW}
                  onDownload={
                    actionType === ActionType.VIEW
                      ? handleDownloadAttachment
                      : undefined
                  }
                  disabled={actionType === ActionType.VIEW}
                  acceptedFileTypes="*"
                />
              </Col>
            </Row>
          </Card>
        </Spin>

        {!isEnabledApproval && (
          <Row justify="end">
            <Space size="middle">
              {actionType === ActionType.VIEW &&
                numberTransactionDetail &&
                numberTransactionDetail.approvalStatus ===
                  DeliveryOrderApprovalStatusList.PENDING &&
                numberTransactionDetail.transStatusName ===
                  'Chưa thực hiện' && (
                  <CButtonCancel
                    disabled={false}
                    onClick={handleCancelUpload}
                    loading={loadingCancelUpload}
                  >
                    Hủy upload
                  </CButtonCancel>
                )}
              {actionType === ActionType.ADD ? (
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
        )}
      </Form>
    </WrapperPage>
  );
};

export default ModalAddView;
