import {
  CButtonClose,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import { CUploadFileTemplate } from '@react/commons/index';
import CInput from '@react/commons/Input';
import CRadio from '@react/commons/Radio';
import CSelect from '@react/commons/Select';
import CTableUploadFile, { FileData } from '@react/commons/TableUploadFile';
import { RowButton, TitleHeader } from '@react/commons/Template/style';
import CTextArea from '@react/commons/TextArea';
import { IFieldErrorsItem } from '@react/commons/types';
import { ActionType } from '@react/constants/app';
import { formatDateTime } from '@react/constants/moment';
import { prefixResourceService } from '@react/url/app';
import validateForm from '@react/utils/validator';
import { Card, Col, Form, Radio, Row, Spin, Typography } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import {
  NumberProcessType,
  NumberStockTypes,
} from 'apps/Internal/src/constants/constants';
import { useDownloadResourceFile } from 'apps/Internal/src/hooks/useGetFileDownload';
import { useGetNumberStocks } from 'apps/Internal/src/hooks/useGetNumberStocks';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAddClassifySpecialNumberMutation } from '../queryHook/useAddClassifySpecialNumber';
import { useDetailClassifySpecialNumber } from '../queryHook/useDetailClassifySpecialNumber';
import { useFetchProducts } from '../queryHook/useFetchProducts';
import { useGetFileUpload } from '../queryHook/useGetFileUpload';

type Props = {
  typeModal: ActionType;
};

const ActionPage: React.FC<Props> = ({ typeModal }) => {
  const [isSubmitBack, setIsSubmitBack] = useState<boolean>(false);

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const selectionType = useWatch<NumberProcessType>('processType', form);
  const { id } = useParams();
  const { mutate: getFileUpload } = useGetFileUpload();

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

  const { mutate: addClassifySpecialNumber, isPending: loadingAdd } =
    useAddClassifySpecialNumberMutation(() => {
      if (isSubmitBack) {
        form.resetFields();
      } else {
        navigate(-1);
      }
    }, setFieldError);

  const {
    mutate: getDetailClassifySpecialNumber,
    data: detailClassifySpecialNumber,
    isPending: loadingDetail,
  } = useDetailClassifySpecialNumber((data) => {
    form.setFieldsValue({
      files: data?.attachments?.map((attachment: any) => {
        return {
          desc: attachment.description,
          name: attachment.fileName,
          size: attachment.fileVolume,
          date: dayjs(attachment.createdDate).format(formatDateTime),
          url: attachment.fileUrl,
        };
      }),
      description: data.description,
      processType: data.processType,
      stockId: data.stockId,
      productId: data.productId,
      number:
        data.processType === NumberProcessType.INDIVIDUAL
          ? data?.lines?.[0]?.fromIsdn
          : '',
      numberFile: { name: data?.uploadFile?.fileName },
    });
  });

  const { data: listStockIsdnOrg = [] } = useGetNumberStocks(
    [
      NumberStockTypes.GENERAL,
      NumberStockTypes.SPECIFIC,
      NumberStockTypes.SALE,
    ],
    typeModal === ActionType.VIEW ? false : true
  );

  const optionListStockIsdn = useMemo(() => {
    if (typeModal === ActionType.VIEW && detailClassifySpecialNumber) {
      return [
        {
          label: detailClassifySpecialNumber.stockName,
          value: detailClassifySpecialNumber.stockId,
        },
      ];
    }
    return listStockIsdnOrg;
  }, [listStockIsdnOrg, detailClassifySpecialNumber, typeModal]);

  const { data: listProducts = [] } = useFetchProducts({
    categoryType: 4,
  });

  const optionProducts = useMemo(() => {
    if (typeModal === ActionType.VIEW && detailClassifySpecialNumber) {
      return [
        {
          label: detailClassifySpecialNumber.productName,
          value: detailClassifySpecialNumber.productId,
        },
      ];
    }
    return listProducts;
  }, [listProducts, detailClassifySpecialNumber, typeModal]);

  const renderTitle = () => {
    const name = ' số đặc biệt';

    switch (typeModal) {
      case ActionType.ADD:
        return 'Gán' + name;
      case ActionType.EDIT:
        return 'Cập nhật' + name;
      case ActionType.VIEW:
        return 'Xem chi tiết gán' + name;
      default:
        return '';
    }
  };

  useEffect(() => {
    if (id) {
      getDetailClassifySpecialNumber(id);
    }
  }, [id]);

  const handleClose = () => {
    form.resetFields();
    navigate(-1);
  };

  const { mutate: handleDownloadFile } = useDownloadResourceFile();

  const handleDownloadUploadFile = useCallback(() => {
    handleDownloadFile({
      uri: detailClassifySpecialNumber?.uploadFile?.fileUrl ?? '',
    });
  }, [handleDownloadFile, detailClassifySpecialNumber?.uploadFile?.fileUrl]);

  const handleDownloadAttachment = (record: FileData) => {
    console.log('🚀 ~ handleDownloadAttachment ~ record:', record);
    handleDownloadFile({
      uri: record.url ?? '',
    });
  };

  const handleExport = () => {
    getFileUpload({
      uri: `${prefixResourceService}/classify-special-number/samples/xlsx`,
      filename: 'Danh sach gan so dac biet.xlsx',
    });
  };

  const handleSubmit = async (values: Record<string, any>) => {
    addClassifySpecialNumber(values);
  };

  return (
    <>
      <TitleHeader>{renderTitle()}</TitleHeader>
      <Form
        form={form}
        onFinish={handleSubmit}
        labelCol={{ style: { width: '140px' } }}
        labelAlign="left"
        labelWrap
        colon={false}
        disabled={typeModal === ActionType.VIEW}
        initialValues={{ processType: NumberProcessType.INDIVIDUAL }}
      >
        <Spin spinning={loadingAdd || loadingDetail}>
          <Card>
            <Row gutter={[30, 0]}>
              <Col span={12}>
                <Form.Item
                  label="Gán số"
                  name="processType"
                  rules={[{ required: true }]}
                >
                  <Radio.Group>
                    <CRadio value={NumberProcessType.INDIVIDUAL}>
                      <Typography.Text className="radio-label">
                        Đơn lẻ
                      </Typography.Text>
                    </CRadio>
                    <CRadio value={NumberProcessType.BATCH}>
                      <Typography.Text className="radio-label">
                        Theo lô
                      </Typography.Text>
                    </CRadio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}></Col>
              <Col span={12}>
                <Form.Item
                  labelAlign="left"
                  label="Kho số"
                  name="stockId"
                  rules={[validateForm.required]}
                >
                  <CSelect
                    placeholder="Chọn kho số"
                    options={optionListStockIsdn}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  labelCol={{ flex: '130px' }}
                  label="Sản phẩm"
                  name="productId"
                  rules={[validateForm.required]}
                >
                  <CSelect
                    placeholder="Chọn sản phẩm"
                    options={optionProducts}
                  ></CSelect>
                </Form.Item>
              </Col>
              {selectionType === NumberProcessType.INDIVIDUAL ? (
                <Col span={12}>
                  <Form.Item
                    labelAlign="left"
                    label="Số"
                    name="number"
                    validateDebounce={1500}
                    rules={[validateForm.required]}
                  >
                    <CInput maxLength={11} onlyNumber placeholder="Nhập số" />
                  </Form.Item>
                </Col>
              ) : (
                <Col span={12}>
                  <Row className=" flex-col">
                    <CUploadFileTemplate
                      required
                      onDownloadTemplate={handleExport}
                      accept={[
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                      ]}
                      label="Số"
                      name={'numberFile'}
                      onDownloadFile={
                        typeModal === ActionType.VIEW
                          ? handleDownloadUploadFile
                          : undefined
                      }
                    />
                  </Row>
                </Col>
              )}
              <Col span={24}>
                <Form.Item labelAlign="left" label="Ghi chú" name="description">
                  <CTextArea
                    maxLength={200}
                    placeholder="Nhập ghi chú"
                    autoSize={{ minRows: 3, maxRows: 5 }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <CTableUploadFile
              disabled={typeModal === ActionType.VIEW}
              onDownload={
                typeModal === ActionType.VIEW
                  ? handleDownloadAttachment
                  : undefined
              }
              acceptedFileTypes="*"
              showAction={typeModal !== ActionType.VIEW}
            />
          </Card>
        </Spin>

        <Row className="justify-end">
          <RowButton className="my-6">
            {typeModal !== ActionType.VIEW && (
              <>
                <CButtonSaveAndAdd
                  htmlType="submit"
                  onClick={() => {
                    setIsSubmitBack(true);
                  }}
                  loading={loadingAdd}
                />
                <CButtonSave
                  htmlType="submit"
                  loading={loadingAdd}
                  onClick={() => {
                    setIsSubmitBack(false);
                  }}
                />
              </>
            )}

            <CButtonClose onClick={handleClose} disabled={false} type="default">
              Đóng
            </CButtonClose>
          </RowButton>
        </Row>
      </Form>
    </>
  );
};

export default ActionPage;
