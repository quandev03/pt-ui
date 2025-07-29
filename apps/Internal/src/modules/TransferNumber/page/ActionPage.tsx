import { faCancel, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton, {
  CButtonClose,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import {
  CModalConfirm,
  CUploadFileTemplate,
  WrapperPage,
} from '@react/commons/index';
import CRadio from '@react/commons/Radio';
import CSelect from '@react/commons/Select';
import CTable from '@react/commons/Table';
import CTableUploadFile, { FileData } from '@react/commons/TableUploadFile';
import {
  BtnGroupFooter,
  RowButton,
  Text,
  TitleHeader,
} from '@react/commons/Template/style';
import CTextArea from '@react/commons/TextArea';
import { IFieldErrorsItem } from '@react/commons/types';
import { ActionType } from '@react/constants/app';
import { MESSAGE } from '@react/utils/message';
import validateForm from '@react/utils/validator';
import {
  Button,
  ButtonProps,
  Card,
  Col,
  Form,
  Radio,
  Row,
  Spin,
  Tooltip,
} from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import ModalSelectNumber from 'apps/Internal/src/components/ModalSelectNumber';
import {
  ApprovalStatus,
  NumberProcessType,
  NumberStockTypes,
  NumberTransactionStatus,
} from 'apps/Internal/src/constants/constants';
import { useDownloadResourceFile } from 'apps/Internal/src/hooks/useGetFileDownload';
import { useGetNumberStocksNoSelect } from 'apps/Internal/src/hooks/useGetNumberStocks';
import {
  ReasonCodeEnum,
  useListReasonCatalogService,
} from 'apps/Internal/src/hooks/useReasonCatalogService';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TRANSFER_MOVE_TYPE_OPTION, TransferMoveTypeEnum } from '../constants';
import { useAddTransferNumber } from '../hooks/useAddTransferNumber';
import { useCancelTransferNumber } from '../hooks/useCancleTransferNumber';
import { useGetFileUpload } from '../hooks/useGetFileUpload';
import { useGetTransferNumberDetail } from '../hooks/useGetTransferNumberDetail';
import { API_PATHS } from '../services/url';
import { IStockNumber } from '../type';

type Props = {
  typeModal: ActionType;
  isEnabledApproval?: boolean;
};
export const CButtonCancel: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <Button
      icon={<FontAwesomeIcon icon={faCancel} />}
      style={{
        backgroundColor: '#ff4d4d',
        borderColor: '#ff4d4d',
        color: 'white',
      }}
      {...rest}
    >
      Hủy điều chuyển
    </Button>
  );
};

const ActionPage: React.FC<Props> = ({
  typeModal,
  isEnabledApproval = false,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [isSubmitBack, setIsSubmitBack] = useState<boolean>(false);
  const selectionType = useWatch<NumberProcessType>('processType', form);
  const moveType = useWatch<TransferMoveTypeEnum>('moveType', form);
  const stockId = useWatch<NumberProcessType>('stockId', form);
  const reasonId = useWatch<NumberProcessType>('reasonId', form);
  const [dataSource, setDataSource] = useState<any[]>([]);

  const {
    mutate: getTransferNumberDetail,
    data: detailTransferNumber,
    isPending: loadingDetail,
  } = useGetTransferNumberDetail((data) => {
    form.setFieldsValue({
      ...data,
      numberFile: {
        name: data?.uploadFile?.fileName,
      },
      files: data?.attachments?.map((file: any) => ({
        // files: file,
        name: file.fileName,
        size: file.fileVolume,
        desc: file.desc,
        date: file.createdDate,
        id: file.id,
        url: file.fileUrl,
      })),
    });
    const valueData = data.lines?.map((item) => {
      return {
        isdn: item.fromIsdn,
        generalFormat: item.generalFormat,
        groupCode: item.groupCode,
      };
    });
    setDataSource(valueData ?? []);
  });

  const [isOpenSelectNumber, setIsOpenSelectNumber] = useState<boolean>(false);
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
  const { mutate: addTransferNumber, isPending: loadingAddTransferNumber } =
    useAddTransferNumber(() => {
      form.resetFields();
      setDataSource([]);
      if (!isSubmitBack) {
        navigate(-1);
      }
    }, setFieldError);

  const { data: optionStock = [] } = useGetNumberStocksNoSelect([
    NumberStockTypes.SPECIFIC,
    NumberStockTypes.SALE,
  ]);

  const stockSaleInternal = useMemo(() => {
    return optionStock
      .filter((item) => item.stockType === NumberStockTypes.SALE)
      .map((item) => ({
        value: item.id,
        label: item.stockName,
      }));
  }, [optionStock]);

  const stockSpecific = useMemo(() => {
    return optionStock
      .filter((item) => item.stockType === NumberStockTypes.SPECIFIC)
      .map((item) => ({
        value: item.id,
        label: item.stockName,
      }));
  }, [optionStock]);

  const optionStockId = useMemo(() => {
    if (typeModal === ActionType.VIEW && detailTransferNumber) {
      return [
        {
          label: detailTransferNumber.stockName,
          value: detailTransferNumber.stockId,
        },
      ];
    }
    const result = optionStock.map((item) => ({
      value: item.id,
      label: item.stockName,
    }));
    if (moveType === TransferMoveTypeEnum.INTERNAL) return stockSaleInternal;
    else if (moveType === TransferMoveTypeEnum.OTHER)
      return stockSpecific.concat(stockSaleInternal);
    return result;
  }, [
    optionStock,
    stockId,
    moveType,
    stockSaleInternal,
    stockSpecific,
    typeModal,
    detailTransferNumber,
  ]);

  const optionIeStockId = useMemo(() => {
    if (typeModal === ActionType.VIEW && detailTransferNumber) {
      return [
        {
          label: detailTransferNumber.ieStockName,
          value: detailTransferNumber.ieStockId,
        },
      ];
    }

    if (moveType && moveType === TransferMoveTypeEnum.INTERNAL) {
      return stockSaleInternal.filter((item) => item.value !== stockId);
    } else if (moveType && moveType === TransferMoveTypeEnum.OTHER) {
      const checkStock = optionStock.find((item) => item.id === stockId);
      console.log(checkStock);
      if (checkStock && checkStock.stockType === NumberStockTypes.SPECIFIC) {
        return stockSpecific
          .concat(stockSaleInternal)
          .filter((item) => item.value !== stockId);
      } else if (checkStock && checkStock.stockType === NumberStockTypes.SALE) {
        return stockSpecific.filter((item) => item.value !== stockId);
      }
    }
    return optionStock
      .map((item) => ({
        value: item.id,
        label: item.stockName,
      }))
      .filter((item) => item.value !== stockId);
  }, [
    optionStock,
    moveType,
    stockSaleInternal,
    stockSpecific,
    stockId,
    typeModal,
    detailTransferNumber,
  ]);
  const disableForm = isEnabledApproval || typeModal === ActionType.VIEW;

  const optionReason = useListReasonCatalogService(
    disableForm,
    reasonId,
    ReasonCodeEnum.CANCELSIM1
  );

  const { mutate: getFileUpload } = useGetFileUpload();

  const showSelectNumberModal = () => {
    setIsOpenSelectNumber(true);
  };

  const handleSubmit = (values: Record<string, any>) => {
    addTransferNumber({ ...values, listNumbers: dataSource });
  };

  const handleCancel = () => {
    setIsOpenSelectNumber(false);
  };

  const handleClose = () => {
    form.resetFields();
    navigate(-1);
  };

  const handleCloseModal = () => {
    if (typeModal === ActionType.ADD) {
      handleClose();
    } else {
      navigate(-1);
    }
  };
  const renderTitle = () => {
    const name = ' số';
    switch (typeModal) {
      case ActionType.ADD:
        return 'Điều chuyển' + name;
      case ActionType.EDIT:
        return 'Cập nhật' + name;
      case ActionType.VIEW:
        return 'Xem chi tiết điều chuyển' + name;
      default:
        return '';
    }
  };
  const { mutate: cancelTransferNumber } =
    useCancelTransferNumber(handleCloseModal);
  const handleCancelTransferNumber = useCallback(() => {
    CModalConfirm({
      message: 'Bạn có chắc chắn hủy điều chuyển số không?',
      onOk: () => cancelTransferNumber(Number(id)),
    });
  }, [cancelTransferNumber, id]);

  const handleExport = () => {
    getFileUpload({
      url: API_PATHS.GET_FILE_UPLOAD,
      filename: 'Danh_sach_dieu_chuyen_so',
    });
  };

  const columns: ColumnsType<any> = [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 50,
      render: (_, __, index) => <Text>{index + 1}</Text>,
    },

    {
      title: 'Số',
      dataIndex: 'isdn',
      width: 200,
      align: 'left',
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },

    {
      title: 'Nhóm số',
      dataIndex: 'groupCode',
      width: 200,
      align: 'left',
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Định dạng số',
      dataIndex: 'generalFormat',
      width: 200,
      align: 'left',
      render(value) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: '',
      align: 'center',
      width: 50,
      fixed: 'right',
      dataIndex: 'id',
      render(_, __, index) {
        return (
          <div className="flex">
            {typeModal !== ActionType.VIEW && (
              <FontAwesomeIcon
                fontSize={20}
                icon={faMinus}
                className="mr-6 cursor-pointer"
                onClick={() =>
                  setDataSource(dataSource.filter((item, idx) => idx !== index))
                }
              />
            )}
          </div>
        );
      },
    },
  ];

  const handleChangeForm = (changedValues: Record<string, any>) => {
    if (changedValues.moveType) {
      form.setFieldsValue({
        stockId: undefined,
        ieStockId: undefined,
      });
    }
  };
  useEffect(() => {
    if (id) {
      getTransferNumberDetail(Number(id));
    }
  }, [id]);
  const { mutate: handleDownloadFile } = useDownloadResourceFile();
  const handleDownloadUploadFile = () => {
    handleDownloadFile({
      uri: detailTransferNumber?.uploadFile?.fileUrl ?? '',
    });
  };
  const handleDownloadAttachment = (record: FileData) => {
    handleDownloadFile({
      uri: record.url ?? '',
    });
  };

  const handleAddTransferNumber = (data: IStockNumber[]) => {
    setDataSource(data);
    setIsOpenSelectNumber(false);
  };

  return (
    <WrapperPage>
      <TitleHeader>{renderTitle()}</TitleHeader>
      <Form
        form={form}
        labelCol={{ style: { width: '140px' } }}
        disabled={disableForm}
        colon={false}
        onFinish={handleSubmit}
        initialValues={{
          processType: NumberProcessType.INDIVIDUAL,
          moveType: TransferMoveTypeEnum.INTERNAL,
        }}
        onValuesChange={handleChangeForm}
      >
        <Spin spinning={loadingAddTransferNumber || loadingDetail}>
          <Card className="mb-5">
            <Row gutter={[30, 0]}>
              <Col span={12}>
                <Form.Item
                  label={'Loại điều chuyển'}
                  name={'moveType'}
                  rules={[validateForm.required]}
                >
                  <CSelect
                    allowClear={false}
                    options={TRANSFER_MOVE_TYPE_OPTION}
                    placeholder="Chọn loại điều chuyển"
                  ></CSelect>
                </Form.Item>
              </Col>
              <Col span={12}></Col>
              <Col span={12}>
                <Form.Item
                  label="Kho xuất"
                  name="stockId"
                  rules={[validateForm.required]}
                >
                  <CSelect
                    placeholder="Chọn kho"
                    options={optionStockId}
                    onChange={(value) => {
                      form.setFieldValue('ieStockId', null);
                      setDataSource([]);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Kho nhận"
                  name="ieStockId"
                  rules={[
                    {
                      required: true,
                      message: MESSAGE.G06,
                    },
                  ]}
                >
                  <CSelect placeholder="Chọn kho" options={optionIeStockId} />
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
                    maxLength={250}
                    placeholder="Ghi chú"
                    autoSize={{ minRows: 3, maxRows: 5 }}
                  />
                </Form.Item>
              </Col>
              <Col span={24} className="my-6">
                <CTableUploadFile
                  onDownload={
                    typeModal === ActionType.VIEW
                      ? handleDownloadAttachment
                      : undefined
                  }
                  disabled={typeModal === ActionType.VIEW}
                  showAction={typeModal !== ActionType.VIEW}
                  acceptedFileTypes="*"
                />
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Item
                  labelAlign="left"
                  name="processType"
                  label="Kiểu chọn số"
                  rules={[validateForm.required]}
                >
                  <Radio.Group>
                    <CRadio checked value={NumberProcessType.INDIVIDUAL}>
                      Chọn đơn lẻ
                    </CRadio>
                    <CRadio value={NumberProcessType.BATCH}>
                      Chọn theo lô
                    </CRadio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            {selectionType === NumberProcessType.INDIVIDUAL ? (
              <>
                <Col span={24}>
                  <div className="flex justify-between my-4">
                    <div className="font-bold text-lg">Danh sách số</div>
                    <BtnGroupFooter>
                      {typeModal === ActionType.ADD && (
                        <CButton
                          onClick={showSelectNumberModal}
                          icon={<FontAwesomeIcon icon={faPlus} size="lg" />}
                          disabled={!stockId}
                        >
                          Chọn số
                        </CButton>
                      )}
                    </BtnGroupFooter>
                  </div>
                </Col>

                <CTable
                  columns={columns}
                  dataSource={dataSource}
                  scroll={{ y: 500 }}
                />
              </>
            ) : (
              <Row gutter={30}>
                <Col span={24}>
                  <CUploadFileTemplate
                    onDownloadTemplate={handleExport}
                    onDownloadFile={
                      typeModal === ActionType.VIEW
                        ? handleDownloadUploadFile
                        : undefined
                    }
                    accept={[
                      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    ]}
                    name={'numberFile'}
                    label="Danh sách số"
                  />
                </Col>
              </Row>
            )}
          </Card>
        </Spin>

        {!isEnabledApproval && (
          <RowButton className="my-6">
            {typeModal === ActionType.VIEW &&
              detailTransferNumber &&
              detailTransferNumber.approvalStatus ===
                ApprovalStatus.WAITING_APPROVAL &&
              detailTransferNumber.transStatus ===
                NumberTransactionStatus.PRE_START && (
                <CButtonCancel
                  disabled={false}
                  onClick={handleCancelTransferNumber}
                />
              )}
            {(typeModal === ActionType.ADD ||
              typeModal === ActionType.EDIT) && (
              <>
                <CButtonSaveAndAdd
                  htmlType="submit"
                  loading={loadingAddTransferNumber}
                  onClick={() => {
                    setIsSubmitBack(true);
                  }}
                />
                <CButtonSave
                  htmlType="submit"
                  loading={loadingAddTransferNumber}
                  onClick={() => {
                    setIsSubmitBack(false);
                  }}
                />
              </>
            )}
            <CButtonClose
              disabled={false}
              onClick={handleCloseModal}
              type="default"
            >
              Đóng
            </CButtonClose>
          </RowButton>
        )}
        <ModalSelectNumber
          open={isOpenSelectNumber}
          defaultSelected={dataSource}
          onCancel={handleCancel}
          onSave={handleAddTransferNumber}
          nameField="stockId"
        />
      </Form>
    </WrapperPage>
  );
};

export default ActionPage;
