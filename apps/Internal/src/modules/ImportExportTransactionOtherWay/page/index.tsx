import { CButtonClose, CButtonSaveAndAdd } from '@react/commons/Button';
import CRadio from '@react/commons/Radio';
import CSelect from '@react/commons/Select';
import { RowButton, TitleHeader } from '@react/commons/Template/style';
import CTextArea from '@react/commons/TextArea';
import { CDatePicker, CInput, CUploadFileTemplate } from '@react/commons/index';
import { ACTION_MODE_ENUM, IFieldErrorsItem } from '@react/commons/types';
import { DateFormat } from '@react/constants/app';
import { MODE_METHOD, MODE_TYPE } from '@react/constants/eximTransaction';
import { formatDateBe } from '@react/constants/moment';
import { MESSAGE } from '@react/utils/message';
import { Card, Col, Form, FormProps, Radio, Row } from 'antd';
import { useForm, useWatch } from 'antd/es/form/Form';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import { useGetFileDownload } from 'apps/Internal/src/hooks/useGetFileDownload';
import {
  ReasonCodeEnum,
  useListReasonCatalogService,
} from 'apps/Internal/src/hooks/useReasonCatalogService';
import TableListNumber from 'apps/Internal/src/modules/ImportExportTransactionOtherWay/components/TableListNumber';
import { ELEMENT_MODE } from 'apps/Internal/src/modules/ImportExportTransactionOtherWay/constant';
import { useCreateExportTransaction } from 'apps/Internal/src/modules/ImportExportTransactionOtherWay/hooks/useCreateExportTransaction';
import { useGetFileExcel } from 'apps/Internal/src/modules/ImportExportTransactionOtherWay/hooks/useGetFileExcel';
import { useGetOrdId } from 'apps/Internal/src/modules/ImportExportTransactionOtherWay/hooks/useGetOrdId';
import { API_PATHS } from 'apps/Internal/src/modules/ImportExportTransactionOtherWay/services/url';
import {
  IFromExportTransaction,
  IItemProduct,
  IPayloadTransaction,
  ISerialItem,
  TypePage,
} from 'apps/Internal/src/modules/ImportExportTransactionOtherWay/type';
import dayjs from 'dayjs';
import { FC, useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Wrapper } from '../../ActivationRequestList/page/style';
import CButtonCancel from '../../StockOutForDistributor/components/CButtonCancel';
import { useCancelTransaction } from '../../TransactionSearchImportExport/hooks';
import { TransactionSearchImportExportItem } from '../../TransactionSearchImportExport/types';
import { useFilterSerial } from '../hooks/useFilterSerial';
import { useGetDetailTransaction } from '../hooks/useGetDetailTransaction';
import useModal from '../store/useModal';
import validateForm from '@react/utils/validator';

type Props = {
  actionMode: ACTION_MODE_ENUM;
  type: TypePage;
};

const ImportExportTransactionOtherWay: FC<Props> = ({ actionMode, type }) => {
  const titleHeader = useMemo(() => {
    const title = actionMode === ACTION_MODE_ENUM.VIEW ? 'Xem chi tiết' : 'Tạo';
    const text = `giao dịch`;
    const result = {
      [TypePage.EXPORT_KIT]: `${title} ${text} xuất kit`,
      [TypePage.IMPORT_KIT]: `${title} ${text} nhập kit`,
      [TypePage.IMPORT]: `${title} ${text} nhập khác`,
      [TypePage.EXPORT]: `${title} ${text} xuất khác`,
      [TypePage.EXPORT_SIM]: `${title} ${text} xuất SIM`,
      [TypePage.IMPORT_SIM]: `${title} ${text} nhập SIM`,
    };
    return result[type];
  }, [type, actionMode]);

  const [form] = useForm();
  const orgId = useWatch('orgId', form);
  const reasonId = useWatch('reasonId', form);
  const { id } = useParams();
  const { pathname } = useLocation();
  const { setError } = useModal();
  const { data: detailTransaction } = useGetDetailTransaction(id);

  const navigate = useNavigate();
  const handleResetForm = () => {
    navigate(-1);
    form.resetFields();
  };
  const { mutate: cancelTransaction } = useCancelTransaction(() => {
    handleResetForm();
  });
  const handleCancelTransaction = useCallback(
    (record: TransactionSearchImportExportItem) => {
      ModalConfirm({
        message: 'Bạn có chắc chắn muốn Hủy giao dịch này không?',
        handleConfirm: () => {
          cancelTransaction(record.id);
        },
      });
    },
    []
  );

  useEffect(() => {
    if (detailTransaction) {
      form.setFieldsValue({
        ...detailTransaction,
        reasonId: detailTransaction?.reasonDTO?.id,
        moveDate: dayjs(detailTransaction.createdDate, formatDateBe),
        products: detailTransaction.stockMoveLineDTOS
          ? detailTransaction.stockMoveLineDTOS.map((item) => ({
              fromSerial: item.fromSerial,
              toSerial: item.toSerial,
              quantity: item.quantity,
              productId: item.productDTO.id,
              productCode: item.productDTO.productCode,
              productName: item.productDTO.productName,
              productUom: item.productDTO.productUom,
            }))
          : [],
        chooseProduct:
          detailTransaction.attachments &&
          detailTransaction.attachments.length > 0
            ? ELEMENT_MODE.FILE
            : ELEMENT_MODE.SINGLE,
        files:
          detailTransaction.attachments &&
          detailTransaction.attachments.length > 0
            ? {
                name: detailTransaction.attachments[0].fileName,
              }
            : [],
      });
    }
  }, [detailTransaction]);

  useEffect(() => {
    return () => {
      form.resetFields();
      setError('');
    };
  }, [pathname]);

  const chooseProduct = useWatch('chooseProduct', form);

  const setFieldError = useCallback(
    (fieldErrors: IFieldErrorsItem[]) => {
      form.setFields(
        fieldErrors.map((item: IFieldErrorsItem) => ({
          name: item.field === 'attachmentFiles' ? 'files' : item.field,
          errors: [item.detail],
        }))
      );
    },
    [form]
  );

  const { mutate: createExportTransaction } = useCreateExportTransaction(() => {
    form.resetFields();
  }, setFieldError);

  const { mutate } = useGetFileExcel();

  const optionReason = useListReasonCatalogService(
    actionMode === ACTION_MODE_ENUM.VIEW,
    reasonId,
    type === TypePage.EXPORT
      ? ReasonCodeEnum.OTHER_EXPORT
      : ReasonCodeEnum.OTHER_IMPORT
  );

  const { data: orgList = [] } = useGetOrdId();
  const currentOrg = useMemo(() => {
    const currentOrg = orgList.find((item) => item.isCurrent);
    return currentOrg;
  }, [orgList]);

  const optionOrgCurrent = useMemo(() => {
    if (actionMode === ACTION_MODE_ENUM.VIEW && detailTransaction) {
      if (
        type === TypePage.EXPORT_KIT ||
        type === TypePage.EXPORT ||
        type === TypePage.EXPORT_SIM
      ) {
        return [
          {
            value: detailTransaction.orgId,
            label: detailTransaction?.orgName,
          },
        ];
      }
      if (
        type === TypePage.IMPORT_KIT ||
        type === TypePage.IMPORT ||
        type === TypePage.IMPORT_SIM
      ) {
        return [
          {
            value: detailTransaction.ieOrgId,
            label: detailTransaction?.ieOrgName,
          },
        ];
      }
    }
    if (!orgList) return [];
    return orgList.map((item) => ({
      label: item.orgName,
      value: item.orgId,
    }));
  }, [orgList, actionMode, type, detailTransaction]);

  useEffect(() => {
    if (orgList && orgList.length > 0 && actionMode !== ACTION_MODE_ENUM.VIEW) {
      const currentOrg = orgList.find((item) => item.isCurrent);
      if (currentOrg) {
        form.setFieldsValue({
          orgId: currentOrg.orgId,
        });
      }
    }
  }, [orgList]);

  const extractStockMoveLineDTOS = useCallback(
    (
      orgId: string,
      type: TypePage,
      products?: IItemProduct[]
    ): ISerialItem[] => {
      if (!products) return [];
      if (type === TypePage.EXPORT) {
        return products.reduce((result: ISerialItem[], item) => {
          if (item.children) {
            const { children } = item;
            result.push(...children);
          }
          return result;
        }, []);
      } else {
        return products.map((item) => {
          return {
            orgId: orgId,
            fromSerial: item.fromSerial,
            quantity: +item.quantity,
            productCode: item.productCode,
            productId: item.productId,
            toSerial: item.toSerial,
          } as ISerialItem;
        });
      }
    },
    []
  );

  const createPayload = useCallback(
    (
      stockMoveDTO: Partial<IFromExportTransaction>,
      stockMoveLineDTOS: ISerialItem[],
      type: TypePage,
      files?: File
    ): IPayloadTransaction => {
      return {
        stockMoveDTO: {
          ...stockMoveDTO,
          moveType: MODE_TYPE.OTHER,
          moveMethod:
            type === TypePage.EXPORT ? MODE_METHOD.EXPORT : MODE_METHOD.IMPORT,
          stockMoveLineDTOS: stockMoveLineDTOS,
          ieOrgId: stockMoveDTO.orgId,
        },
        attachments: files,
      } as IPayloadTransaction;
    },
    []
  );

  const dataTable: IItemProduct[] = useWatch('products', form) ?? [];

  const mapDataTable = useCallback(
    (dataTable: IItemProduct[], data: ISerialItem[]) => {
      return dataTable.map((item, index, array) => {
        const dataSelected = data.find(
          (serial) => String(item.id) === String(serial.productId)
        );
        return {
          ...item,
          ...dataSelected,
          toSerial:
            dataSelected && (dataSelected.checkSerial || item.checkSerial)
              ? dataSelected.toSerial
              : '',
          children:
            dataSelected && (dataSelected.checkSerial || item.checkSerial)
              ? dataSelected.serialChildrenList?.map((i) => ({
                  ...i,
                  productCode: item.productCode,
                }))
              : [],
        };
      });
    },
    []
  );

  const mapErrors = useCallback(
    (dataTable: IItemProduct[], type: TypePage, data: ISerialItem[]) => {
      return dataTable.map((item, index) => {
        const dataSelected = data.find(
          (serial) => String(item.id) === String(serial.productId)
        );
        const currentError = form.getFieldError([
          'products',
          index,
          'quantity',
        ]);
        let errors: string[] = [];
        if (
          dataSelected &&
          dataSelected.serialChildrenList &&
          dataSelected.serialChildrenList.length === 0
        ) {
          if (type === TypePage.EXPORT) {
            errors = ['Số lượng sản phẩm trong kho không đủ'];
          }
        }
        if (currentError && currentError.length > 0) {
          errors = currentError;
        }
        return {
          name: ['products', index, 'quantity'],
          errors: errors,
        };
      });
    },
    []
  );
  const onFinish: FormProps<IFromExportTransaction>['onFinish'] = useCallback(
    (values: IFromExportTransaction) => {
      const { files, products, ...stockMoveDTO } = values;
      const stockMoveLineDTOS = extractStockMoveLineDTOS(orgId, type, products);
      const payload = createPayload(
        stockMoveDTO,
        stockMoveLineDTOS,
        type,
        files
      );
      createExportTransaction(payload);
    },
    [type, orgId]
  );
  const { mutate: fillSerial } = useFilterSerial((data) => {
    const result = mapDataTable(dataTable, data);
    const errors = mapErrors(dataTable, type, data);
    form.setFields([
      {
        name: 'products',
        value: result,
      },
      ...errors,
    ]);
    const isError = errors.some((item) => item.errors.length > 0);

    if (!isError) {
      const stockMoveCode = type === TypePage.EXPORT ? 'GDXK' : 'GDNK';
      const values = form.getFieldsValue();
      onFinish({
        ...values,
        stockMoveCode: stockMoveCode + values.stockMoveCode,
      });
    }
  });

  const handleFillSerial = (values: IFromExportTransaction) => {
    if (type === TypePage.EXPORT && chooseProduct === ELEMENT_MODE.SINGLE) {
      const productCalculation = dataTable
        .filter((item) => item.quantity)
        .map((item) => ({ ...item, quantity: Number(item.quantity) }));
      if (productCalculation.length > 0) {
        fillSerial(
          productCalculation.map((item) => {
            return {
              productId: item.id as any,
              fromSerial: item.fromSerial as any,
              quantity: item.quantity as any,
              orgId: orgId,
            };
          })
        );
      }
    } else {
      const stockMoveCode = type === TypePage.EXPORT ? 'GDXK' : 'GDNK';
      onFinish({
        ...values,
        stockMoveCode: stockMoveCode + values.stockMoveCode,
      });
    }
  };

  const handleExport = () => {
    mutate({
      uri: API_PATHS.GET_FILE_EXCEL,
      filename:
        type === TypePage.IMPORT ? 'File_mau_Nhap_khac' : 'File_mau_Xuat_khac',
    });
  };

  const { mutate: downloadFile } = useGetFileDownload();

  const handleDownloadFile = () => {
    if (
      detailTransaction?.attachments &&
      detailTransaction.attachments.length > 0 &&
      detailTransaction.attachments[0].id
    ) {
      downloadFile({
        id: detailTransaction.attachments[0].id,
        fileName: detailTransaction.attachments[0].fileName,
      });
    }
  };

  const moveDateLabel = useMemo(() => {
    return {
      [TypePage.EXPORT]: 'Ngày xuất',
      [TypePage.IMPORT]: 'Ngày nhập',
      [TypePage.EXPORT_KIT]: 'Ngày xuất',
      [TypePage.IMPORT_KIT]: 'Ngày nhập',
      [TypePage.EXPORT_SIM]: 'Ngày xuất',
      [TypePage.IMPORT_SIM]: 'Ngày nhập',
    };
  }, []);

  const orgIdLabel = useMemo(() => {
    return {
      [TypePage.EXPORT]: 'Kho xuất',
      [TypePage.IMPORT]: 'Kho nhập',
      [TypePage.EXPORT_KIT]: 'Kho xuất',
      [TypePage.IMPORT_KIT]: 'Kho nhập',
      [TypePage.EXPORT_SIM]: 'Kho xuất',
      [TypePage.IMPORT_SIM]: 'Kho nhập',
    };
  }, []);

  const orgIdPlaceholder = useMemo(() => {
    return {
      [TypePage.EXPORT]: 'Chọn kho xuất',
      [TypePage.IMPORT]: 'Chọn kho nhập',
      [TypePage.EXPORT_KIT]: 'Chọn kho xuất',
      [TypePage.IMPORT_KIT]: 'Chọn kho nhập',
      [TypePage.EXPORT_SIM]: 'Chọn kho xuất',
      [TypePage.IMPORT_SIM]: 'Chọn kho nhập',
    };
  }, []);

  const nameWarehouseLabel = useMemo(() => {
    return {
      [TypePage.EXPORT]: 'orgId',
      [TypePage.IMPORT]: 'orgId',
      [TypePage.EXPORT_KIT]: 'orgId',
      [TypePage.IMPORT_KIT]: 'ieOrgId',
      [TypePage.EXPORT_SIM]: 'orgId',
      [TypePage.IMPORT_SIM]: 'ieOrgId',
    };
  }, []);

  const reasonLabel = useMemo(() => {
    return {
      [TypePage.EXPORT]: 'Lý do xuất kho',
      [TypePage.IMPORT]: 'Lý do nhập kho',
      [TypePage.EXPORT_KIT]: 'Lý do xuất kho',
      [TypePage.IMPORT_KIT]: 'Lý do nhập kho',
      [TypePage.EXPORT_SIM]: 'Lý do xuất kho',
      [TypePage.IMPORT_SIM]: 'Lý do nhập kho',
    };
  }, []);

  return (
    <Wrapper>
      <TitleHeader>{titleHeader}</TitleHeader>
      <Form
        form={form}
        labelCol={{ flex: '140px' }}
        labelWrap={true}
        onFinish={handleFillSerial}
        autoComplete="off"
        colon={false}
        initialValues={{
          listSerial: [],
          chooseProduct: ELEMENT_MODE.SINGLE,
          moveDate: dayjs(),
          orgId: currentOrg?.orgId,
        }}
      >
        <Card>
          <Row gutter={[24, 0]}>
            <Col span={12}>
              <Form.Item
                labelAlign="left"
                label="Mã giao dịch"
                name="stockMoveCode"
                rules={[{ required: true, message: MESSAGE.G06 }]}
              >
                <CInput
                  uppercase
                  preventVietnamese
                  preventSpace
                  placeholder="Mã giao dich"
                  maxLength={20}
                  prefix={
                    actionMode === ACTION_MODE_ENUM.VIEW
                      ? undefined
                      : type === TypePage.EXPORT
                      ? 'GDXK'
                      : 'GDNK'
                  }
                  disabled={actionMode === ACTION_MODE_ENUM.VIEW}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelAlign="left"
                label={moveDateLabel[type]}
                name="moveDate"
                className="w-70"
                rules={[
                  {
                    required: true,
                    message: MESSAGE.G06,
                  },
                ]}
              >
                <CDatePicker
                  placeholder="Chọn ngày xuất"
                  format={DateFormat.DEFAULT}
                  disabled={actionMode === ACTION_MODE_ENUM.VIEW}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelAlign="left"
                label={orgIdLabel[type]}
                name={nameWarehouseLabel[type]}
                rules={[validateForm.required]}
              >
                <CSelect
                  options={optionOrgCurrent}
                  placeholder={orgIdPlaceholder[type]}
                  disabled={actionMode === ACTION_MODE_ENUM.VIEW}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelAlign="left"
                label={reasonLabel[type]}
                name="reasonId"
                rules={
                  actionMode === ACTION_MODE_ENUM.VIEW &&
                  (type === TypePage.EXPORT_KIT ||
                    type === TypePage.IMPORT_KIT ||
                    type === TypePage.IMPORT_SIM ||
                    type === TypePage.EXPORT_SIM)
                    ? undefined
                    : [{ required: true, message: MESSAGE.G06 }]
                }
              >
                <CSelect
                  options={optionReason}
                  placeholder="Chọn lý do"
                  disabled={actionMode === ACTION_MODE_ENUM.VIEW}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                labelAlign="left"
                label="Ghi chú"
                name="description"
                rules={[{ required: true, message: MESSAGE.G06 }]}
              >
                <CTextArea
                  placeholder="Ghi chú"
                  maxLength={200}
                  rows={3}
                  disabled={actionMode === ACTION_MODE_ENUM.VIEW}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="chooseProduct"
                labelAlign="left"
                label="Thêm sản phẩm"
                rules={[{ required: true, message: MESSAGE.G06 }]}
              >
                <Radio.Group disabled={actionMode === ACTION_MODE_ENUM.VIEW}>
                  <CRadio value={ELEMENT_MODE.SINGLE}>Đơn lẻ</CRadio>
                  <CRadio value={ELEMENT_MODE.FILE}>Theo file</CRadio>
                </Radio.Group>
              </Form.Item>
            </Col>
            {chooseProduct === ELEMENT_MODE.FILE ? (
              <Col span={12}>
                <CUploadFileTemplate
                  label="File"
                  required
                  onDownloadTemplate={handleExport}
                  onDownloadFile={
                    detailTransaction ? handleDownloadFile : undefined
                  }
                  accept={[
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                  ]}
                  name={'files'}
                  allowClear
                />
              </Col>
            ) : (
              <Col span={24}>
                <TableListNumber actionMode={actionMode} type={type} />
              </Col>
            )}
          </Row>
        </Card>
        <RowButton className="my-6">
          {actionMode === ACTION_MODE_ENUM.VIEW &&
          (type === TypePage.EXPORT || type === TypePage.IMPORT) &&
          detailTransaction &&
          detailTransaction.status !== 3 ? (
            <CButtonCancel
              onClick={() => {
                handleCancelTransaction(detailTransaction as any);
              }}
            >
              Hủy giao dịch
            </CButtonCancel>
          ) : null}
          {actionMode === ACTION_MODE_ENUM.CREATE ? (
            <CButtonSaveAndAdd
              onClick={() => {
                const products = form.getFieldValue('products');
                const chooseProduct = form.getFieldValue('chooseProduct');
                if (
                  (!products || products.length === 0) &&
                  chooseProduct === ELEMENT_MODE.SINGLE
                ) {
                  setError(MESSAGE.G06);
                } else {
                  setError('');
                }
                form.submit();
              }}
            />
          ) : null}
          <CButtonClose onClick={handleResetForm} type="default" />
        </RowButton>
      </Form>
    </Wrapper>
  );
};

export default ImportExportTransactionOtherWay;
