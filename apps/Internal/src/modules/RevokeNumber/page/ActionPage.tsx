import { faCancel } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton, {
  CButtonClose,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import { CModalConfirm, CRadio } from '@react/commons/index';
import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import CSelect from '@react/commons/Select';
import CTableUploadFile, { FileData } from '@react/commons/TableUploadFile';
import { Text, TitleHeader } from '@react/commons/Template/style';
import CTextArea from '@react/commons/TextArea';
import { IFieldErrorsItem } from '@react/commons/types';
import { ActionType } from '@react/constants/app';
import { DeliveryOrderApprovalStatusList } from '@react/constants/status';
import { downloadFile } from '@react/utils/handleFile';
import { MESSAGE } from '@react/utils/message';
import validateForm from '@react/utils/validator';
import { Card, Col, Form, Radio, Row, Space, Spin } from 'antd';
import {
  NumberProcessType,
  NumberStockTypes,
} from 'apps/Internal/src/constants/constants';
import { useDownloadResourceFile } from 'apps/Internal/src/hooks/useGetFileDownload';
import { useGetNumberStocks } from 'apps/Internal/src/hooks/useGetNumberStocks';
import {
  ReasonCodeEnum,
  useListReasonCatalogService,
} from 'apps/Internal/src/hooks/useReasonCatalogService';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BatchSelection from '../components/BatchSelection';
import SingleSelection from '../components/SingleSelection';
import { useAddRevokeNumberMutation } from '../queryHook/useAdd';
import useCancel from '../queryHook/useCancel';
import { useGetRevokeNumberDetail } from '../queryHook/useGetRevokeNumberDetail';
import { IStockIsdn } from '../types';

type Props = {
  typeModal: ActionType;
  isEnabledApproval?: boolean;
};

const ActionPage: React.FC<Props> = ({
  typeModal,
  isEnabledApproval = false,
}) => {
  const [form] = Form.useForm();
  const processType = Form.useWatch<NumberProcessType>('processType', form);
  const reasonId = Form.useWatch<NumberProcessType>('reasonId', form);
  const navigate = useNavigate();
  const { id } = useParams();

  const disableForm = isEnabledApproval || typeModal === ActionType.VIEW;
  const optionReason = useListReasonCatalogService(
    disableForm,
    reasonId,
    ReasonCodeEnum.BACK_NUMBER
  );

  const [listNumberSelected, setListNumberSelected] = useState<IStockIsdn[]>(
    []
  );

  const {
    mutate: getRevokeNumberDetail,
    data: revokeNumberTransactionDetail,
    isPending: loadingDetail,
  } = useGetRevokeNumberDetail((data) => {
    form.setFieldsValue({
      ...data,
      files: data?.attachments?.map((item) => ({
        name: item.fileName,
        size: item.fileVolume,
        desc: item.description,
        date: item.createdDate,
        fileUrl: item.fileUrl,
      })),
      numberFile: {
        name: data?.uploadFile?.fileName,
        fileUrl: data?.uploadFile?.fileUrl,
      },
    });
    setListNumberSelected(
      data.lines
        ? data.lines.map((item) => ({
            id: item.id,
            isdn: item.fromIsdn,
            groupCode: item.groupCode,
            generalFormat: item.generalFormat,
          }))
        : []
    );
  });

  const { data: dataSaleStock = [], isPending: loadingSaleStocks } =
    useGetNumberStocks([NumberStockTypes.SALE, NumberStockTypes.CANCELED]);
  const optionSaleStock = useMemo(() => {
    if (typeModal === ActionType.VIEW && revokeNumberTransactionDetail) {
      return [
        {
          label: revokeNumberTransactionDetail.stockName,
          value: revokeNumberTransactionDetail.stockId,
        },
      ];
    }
    return dataSaleStock;
  }, [dataSaleStock, typeModal, revokeNumberTransactionDetail]);

  const { data: dataGeneralStock = [], isPending: loadingGeneralStocks } =
    useGetNumberStocks([NumberStockTypes.GENERAL]);
  const optionGeneralStock = useMemo(() => {
    if (typeModal === ActionType.VIEW && revokeNumberTransactionDetail) {
      return [
        {
          label: revokeNumberTransactionDetail.ieStockName,
          value: revokeNumberTransactionDetail.ieStockId,
        },
      ];
    }
    return dataGeneralStock;
  }, [dataGeneralStock, revokeNumberTransactionDetail, typeModal]);

  useEffect(() => {
    if (id) {
      getRevokeNumberDetail(id);
    }
  }, [id]);

  const renderTitle = () => {
    const name = ' số';
    switch (typeModal) {
      case ActionType.ADD:
        return 'Thu hồi' + name;
      case ActionType.VIEW:
        return 'Xem chi tiết thu hồi' + name;
      default:
        return '';
    }
  };

  const handleClose = useCallback(() => {
    form.resetFields();
    navigate(-1);
  }, [form, navigate]);

  const handleCloseAddSave = useCallback(() => {
    form.resetFields();
  }, [form]);

  const [submitType, setSubmitType] = useState<string>('');
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
  const { mutate: addRevokeNumber, isPending: loadingAdd } =
    useAddRevokeNumberMutation((data) => {
      if (data instanceof Blob) {
        if (
          data.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) {
          NotificationError(
            'File tải lên sai thông tin, Vui lòng kiểm tra lại'
          );
          setTimeout(() => {
            downloadFile(data, 'Ket_qua_thu_hoi.xlsx');
          }, 2000);
        } else {
          setListNumberSelected([]);
          NotificationSuccess(MESSAGE.G01);
          if (submitType === 'saveAndAdd') {
            handleCloseAddSave();
          } else {
            handleClose();
          }
        }
      }
    }, setFieldError);

  const { mutate: handleDownloadFile } = useDownloadResourceFile();

  const handleDownloadAttachment = (record: FileData) => {
    handleDownloadFile({
      uri: record.url ?? '',
    });
  };

  const handleSubmit = useCallback(
    (values: Record<string, any>) => {
      const formData = {
        ...values,
        listNumberSelected: listNumberSelected,
      };
      addRevokeNumber(formData);
    },
    [form, listNumberSelected]
  );

  const { mutate: cancelRecallNumber, isPending: loadingCancelRecall } =
    useCancel(() => {
      handleClose();
    });
  const handleCancel = useCallback(() => {
    CModalConfirm({
      message: 'Bạn có chắc chắn hủy thu hồi số không?',
      onOk: () => id && cancelRecallNumber(Number(id)),
    });
  }, [cancelRecallNumber]);
  return (
    <>
      <TitleHeader>{renderTitle()}</TitleHeader>
      <Form
        form={form}
        labelCol={{ flex: '110px' }}
        disabled={disableForm}
        colon={false}
        className="mt-4"
        onFinish={handleSubmit}
        initialValues={{
          processType: NumberProcessType.INDIVIDUAL,
        }}
      >
        <Spin spinning={loadingAdd || loadingDetail}>
          <Card>
            <Row gutter={24} className="mb-5">
              <Col span={12}>
                <Form.Item
                  label="Kho thu hồi"
                  name="stockId"
                  rules={[validateForm.required]}
                >
                  <CSelect
                    options={optionSaleStock}
                    loading={loadingSaleStocks}
                    placeholder="Chọn kho"
                  ></CSelect>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Kho nhận"
                  name="ieStockId"
                  rules={[validateForm.required]}
                >
                  <CSelect
                    options={optionGeneralStock}
                    loading={loadingGeneralStocks}
                    placeholder="Chọn kho"
                  ></CSelect>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Lý do"
                  name="reasonId"
                  rules={[validateForm.required]}
                >
                  <CSelect options={optionReason} placeholder="Lý do"></CSelect>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item labelAlign="left" label="Ghi chú" name="description">
                  <CTextArea
                    maxLength={200}
                    placeholder="Ghi chú"
                    autoSize={{ minRows: 3, maxRows: 5 }}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <CTableUploadFile
                  onDownload={
                    disableForm ? handleDownloadAttachment : undefined
                  }
                  disabled={disableForm}
                  showAction={typeModal !== ActionType.VIEW}
                  acceptedFileTypes="*"
                />
              </Col>
              <Col span={24} className="mt-4">
                <Form.Item
                  label="Kiểu chọn số"
                  name="processType"
                  rules={[{ required: true }]}
                >
                  <Radio.Group>
                    <CRadio value={NumberProcessType.INDIVIDUAL}>
                      <Text className="radio-label">Chọn đơn lẻ</Text>
                    </CRadio>
                    <CRadio value={NumberProcessType.BATCH}>
                      <Text className="radio-label">Chọn theo lô</Text>
                    </CRadio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={24}>
                {processType === NumberProcessType.INDIVIDUAL ? (
                  <SingleSelection
                    hideAction={disableForm}
                    listNumberSelected={listNumberSelected}
                    setListNumberSelected={setListNumberSelected}
                  />
                ) : (
                  <BatchSelection disabled={disableForm} />
                )}
              </Col>
            </Row>
          </Card>
        </Spin>
        {!isEnabledApproval && (
          <Row className="mt-6" justify="end">
            <Space size="middle">
              {disableForm &&
                revokeNumberTransactionDetail &&
                revokeNumberTransactionDetail.approvalStatus ===
                  DeliveryOrderApprovalStatusList.PENDING && (
                  <CButton
                    icon={<FontAwesomeIcon icon={faCancel} />}
                    style={{
                      backgroundColor: '#ff4d4d',
                      borderColor: '#ff4d4d',
                      color: 'white',
                    }}
                    disabled={false}
                    onClick={handleCancel}
                    loading={loadingCancelRecall}
                  >
                    Hủy thu hồi
                  </CButton>
                )}
              {typeModal === ActionType.ADD ? (
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
    </>
  );
};

export default ActionPage;
