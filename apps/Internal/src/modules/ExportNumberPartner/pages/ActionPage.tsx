import {
  CButtonClose,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import {
  CInput,
  CTextArea,
  CUploadFileTemplate,
  SelectDebounce,
} from '@react/commons/index';
import CSelect from '@react/commons/Select';
import { RowButton, TitleHeader } from '@react/commons/Template/style';
import { IFieldErrorsItem } from '@react/commons/types';
import { ActionType } from '@react/constants/app';
import { prefixResourceService } from '@react/url/app';
import { Card, Col, Form, Row, Spin } from 'antd';
import { NumberStockTypes } from 'apps/Internal/src/constants/constants';
import { useGetNumberStocks } from 'apps/Internal/src/hooks/useGetNumberStocks';
import { axiosClient } from 'apps/Internal/src/service';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateExportNumberPartner } from '../hooks/useCreateExportNumberPartner';
import { useDownloadFileTemple } from '../hooks/useDownloadFileTemple';
import {
  ExportNumberPartnerOrderType,
  useExportNumberPartnerOrder,
} from '../hooks/useExportNumberPartnerOrder';
import { useGetDetailExportNumberPartner } from '../hooks/useGetDetailExportNumberPartner';
import { PayloadCreate } from '../types';
import { useDownloadResourceFile } from 'apps/Internal/src/hooks/useGetFileDownload';

type Props = {
  typeModal: ActionType;
};

const ActionPage: React.FC<Props> = ({ typeModal }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { id } = useParams();
  const {
    mutate: getDetailExportNumberPartner,
    isPending: loadingDetail,
    data: DetailExportNumberPartner,
  } = useGetDetailExportNumberPartner((data) => {
    form.setFieldsValue({
      orderId: data?.orderId,
      stockId: data?.stockId,
      ieStockId: data?.ieStockId,
      description: data?.description,
      quantity: data?.quantity,
      numberFile: {
        name: data?.uploadFile.fileName,
      },
    });
  });

  useEffect(() => {
    if (id) {
      getDetailExportNumberPartner(id);
    }
  }, [id, typeModal]);
  const orderId = Form.useWatch('orderId', form);
  const [isSubmitBack, setIsSubmitBack] = useState(false);

  const { data: dataOrder = [], isLoading: loadingExportNumberPartnerOrder } =
    useExportNumberPartnerOrder();
  const { data: optionStock = [], isLoading: loadingOptionStock } =
    useGetNumberStocks([
      NumberStockTypes.GENERAL,
      NumberStockTypes.SPECIFIC,
      NumberStockTypes.SALE,
    ]);

  const optionPartnerWarehouse = useMemo(() => {
    if (DetailExportNumberPartner && typeModal === ActionType.VIEW) {
      return [
        {
          label: DetailExportNumberPartner.ieStockName,
          value: DetailExportNumberPartner.ieStockId,
        },
      ];
    }
    const option = dataOrder.find((item) => item.orderId === orderId);
    if (option) {
      return [
        {
          label: option.partnerStockName,
          value: option.partnerStockId,
        },
      ];
    }
    return [];
  }, [orderId, optionStock]);

  const renderTitle = () => {
    switch (typeModal) {
      case ActionType.ADD:
        return 'Xuất số cho đối tác';
      case ActionType.VIEW:
        return 'Xem chi tiết xuất số cho đối tác';
    }
  };

  const handleClose = () => {
    form.resetFields();
    navigate(-1);
  };
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

  const { mutate: downloadTemplate } = useDownloadFileTemple();
  const { mutate: createExportNumberPartner, isPending: loadingCreate } =
    useCreateExportNumberPartner(() => {
      if (isSubmitBack) {
        handleClose();
      } else {
        form.resetFields();
      }
    }, setFieldError);

  const handleCreateExportNumberPartner = (values: PayloadCreate) => {
    const { orderId, stockId, description, numberFile } = values;
    createExportNumberPartner({ orderId, stockId, description, numberFile });
  };

  const fetcherOption = async (searchValue: string) => {
    const res = await axiosClient.get<string, ExportNumberPartnerOrderType[]>(
      `${prefixResourceService}/export-number-for-partner/orders`,
      { params: { orderNo: searchValue } }
    );
    return res.map((item) => ({
      ...item,
      label: item.orderNo,
      value: item.orderId,
    }));
  };

  const { mutate: handleDownloadFile } = useDownloadResourceFile();
  const handleDownloadUploadFile = useCallback(() => {
    handleDownloadFile({
      uri: DetailExportNumberPartner?.uploadFile?.fileUrl ?? '',
      filename: DetailExportNumberPartner?.uploadFile?.fileName ?? '',
    });
  }, [handleDownloadFile, DetailExportNumberPartner]);

  return (
    <>
      <TitleHeader>{renderTitle()}</TitleHeader>
      <Spin spinning={loadingDetail || loadingCreate}>
        <Form
          labelCol={{ style: { width: '140px' } }}
          colon={false}
          form={form}
          onFinish={handleCreateExportNumberPartner}
        >
          <Card>
            <Row gutter={[30, 0]}>
              <Col span={12}>
                <Form.Item
                  label="Mã đơn hàng"
                  name="orderId"
                  rules={[
                    {
                      required: true,
                      message: 'Không được để trống trường này',
                    },
                  ]}
                >
                  {typeModal === ActionType.VIEW ? (
                    <CSelect
                      options={[
                        {
                          label: DetailExportNumberPartner?.orderNo,
                          value: DetailExportNumberPartner?.orderId,
                        },
                      ]}
                      disabled
                    />
                  ) : (
                    <SelectDebounce
                      placeholder="Chọn mã đơn hàng"
                      fetchOptions={fetcherOption}
                      debounceTimeout={500}
                      onChange={(value, option: any) => {
                        if (option) {
                          form.setFieldsValue({
                            quantity: option.remainingQuantity,
                            ieStockId: option.partnerStockId,
                          });
                        } else {
                          form.setFieldsValue({
                            quantity: '',
                            ieStockId: null,
                          });
                        }
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}></Col>
              <Col span={12}>
                <Form.Item
                  label="Kho xuất"
                  name="stockId"
                  rules={[
                    {
                      required: true,
                      message: 'Không được để trống trường này',
                    },
                  ]}
                >
                  <CSelect
                    placeholder="Chọn kho xuất"
                    options={optionStock}
                    loading={loadingOptionStock}
                    disabled={typeModal === ActionType.VIEW}
                  ></CSelect>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Kho đối tác"
                  name="ieStockId"
                  rules={[
                    {
                      required: true,
                      message: 'Không được để trống trường này',
                    },
                  ]}
                >
                  <CSelect
                    disabled
                    options={optionPartnerWarehouse}
                    isLoading={loadingExportNumberPartnerOrder}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Số lượng" name="quantity">
                  <CInput disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <CUploadFileTemplate
                  required
                  label={
                    typeModal === ActionType.VIEW ? 'File số' : 'Tải file mẫu'
                  }
                  onDownloadTemplate={
                    typeModal === ActionType.ADD ? downloadTemplate : undefined
                  }
                  accept={[
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                  ]}
                  name={'numberFile'}
                  onDownloadFile={
                    typeModal === ActionType.VIEW
                      ? handleDownloadUploadFile
                      : undefined
                  }
                />
              </Col>
              <Col span={24}>
                <Form.Item labelAlign="left" label="Ghi chú" name="description">
                  <CTextArea
                    maxLength={200}
                    placeholder="Nhập ghi chú"
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    disabled={typeModal === ActionType.VIEW}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Row className="justify-end">
            <RowButton className="my-6">
              {typeModal !== ActionType.VIEW && (
                <>
                  <CButtonSaveAndAdd
                    htmlType="submit"
                    loading={loadingCreate}
                    onClick={() => {
                      setIsSubmitBack(false);
                    }}
                  />
                  <CButtonSave
                    htmlType="submit"
                    loading={loadingCreate}
                    onClick={() => {
                      setIsSubmitBack(true);
                    }}
                  />
                </>
              )}

              <CButtonClose
                onClick={handleClose}
                type="default"
                loading={loadingCreate}
              >
                Đóng
              </CButtonClose>
            </RowButton>
          </Row>
        </Form>
      </Spin>
    </>
  );
};

export default ActionPage;
