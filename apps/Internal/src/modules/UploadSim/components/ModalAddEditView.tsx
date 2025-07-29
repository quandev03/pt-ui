import {
  CButtonClose,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import CSelect from '@react/commons/Select';
import CTableUploadFile, { FileData } from '@react/commons/TableUploadFile';
import { RowButton, TitleHeader } from '@react/commons/Template/style';
import { ActionType } from '@react/constants/app';
import { Card, Col, Form, Row, Tooltip, Typography } from 'antd';
import { FC, useCallback, useEffect, useState } from 'react';
import { useListUploadOrder } from '../queryHook/useUploadOrder';
import CTable from '@react/commons/Table';
import { ExtendedColumnsType } from '@react/commons/TableSearch';
import { ProductItem } from '../types';
import { useGetFile } from '../queryHook/useGetFile';
import { useListProducts } from '../queryHook/useGetProductsList';
import { useNavigate, useParams } from 'react-router-dom';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import CUpload from './UploadFile';
import { useGetFileTemplate } from '../queryHook/useGetTemplateFile';
import { useAddUploadSim } from '../queryHook/useAdd';
import { useView } from '../queryHook/useView';
import { useGetFileDownloadFn } from '../queryHook/useGetFileDownload';
import { useGetFileDownload } from 'apps/Internal/src/hooks/useGetFileDownload';
import { useListExtendTransaction } from '../queryHook/useListExtendTransaction';
import { debounce } from 'lodash';

type Props = {
  typeModal: ActionType;
};

const ModalAddEditView: FC<Props> = ({ typeModal }) => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isEsim, setIsEsim] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { data: dataUploadOrder } = useListUploadOrder(searchValue);
  const { data: dataExtendTransaction } = useListExtendTransaction(searchValue);
  const [listProducts, setListProducts] = useState([]);
  const { mutate: mutateGetListProducts } = useListProducts(setListProducts);
  const { PRODUCT_CATEGORY_CATEGORY_TYPE = [] } =
    useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);

  const { mutate: getFileTemplate } = useGetFileTemplate(isEsim);
  const { mutate: uploadSimFn } = useAddUploadSim(form, () => {
    setDataTable([
      {
        id: 0,
        productCode: '',
        uploadOrderId: 0,
        deliveryOrderLineId: 0,
        amountNumber: "",
        categoryName: '',
        categoryType: 0,
        productName: '',
        productId: 0,
      },
    ]);
  });
  const { mutate: getFileDownload } = useGetFileDownloadFn();
  const { mutate: getFileDownloadAttachs } = useGetFileDownload();
  const { data: uploadSimData } = useView(id?.toString());
  
  const [dataTable, setDataTable] = useState([
    {
      id: 0,
      productCode: '',
      uploadOrderId: 0,
      deliveryOrderLineId: 0,
      amountNumber: "",
      categoryName: '',
      categoryType: 0,
      productName: '',
      productId: 0,
    },
  ]);
  const dataUploadOrderOptions = dataUploadOrder?.content.map((item: any) => ({
    label: item.uploadOrderNo,
    value: item.id,
  }));
  const dataExtendTransactionOptions = dataExtendTransaction?.content.map(
    (item: any) => ({
      label: item.moveCode,
      value: item.id,
    })
  );
  const dataSelectors = [
    ...(dataUploadOrderOptions || []),
    ...(dataExtendTransactionOptions || []),
  ];
  const { mutate: getInfoFile } = useGetFile(form, async (data) => {
    console.log('SUCCCESSSSSSS');
  });
  useEffect(() => {
    if (uploadSimData && typeModal === ActionType.VIEW) {
      form.setFields([
        {
          name: 'stockProductUploadOrderLineId',
          value: uploadSimData?.uploadSourceNo,
        },
        {
          name: 'uploadOrderId',
          value: uploadSimData?.productCode,
        },
        {
          name: 'categoryType',
          value: PRODUCT_CATEGORY_CATEGORY_TYPE?.find(
            (item: any) => item.value === uploadSimData?.categoryType
          )?.label,
        },
        {
          name: 'files',
          value: uploadSimData?.attachments.map((item: any) => ({
            id: item.id,
            desc: item.description,
            name: item.fileName,
            url: item.fileUrl ? item.fileUrl : '',
            size: item.fileVolume,
            date: item.createdDate,
          })),
        },
        {
          name: 'fileProducts',
          value: uploadSimData?.fileUrl,
        },
        {
          name: 'fileProductsName',
          value: uploadSimData?.fileUrl.split('/')[2],
        },
      ]);

      setDataTable([
        {
          id: uploadSimData?.id,
          productCode: uploadSimData?.productCode,
          uploadOrderId: uploadSimData?.uploadOrderId,
          deliveryOrderLineId: uploadSimData?.productId,
          amountNumber: uploadSimData?.amountQuantity,
          categoryName: '',
          categoryType: uploadSimData?.categoryType,
          productName: uploadSimData?.productName,
          productId: uploadSimData?.productId,
        },
      ]);
    }
  }, [typeModal, uploadSimData]);
  const productTypeOptions = listProducts?.map((item: any) => ({
    label: item.productCode,
    value: item.id,
  }));

  const handleChangeFile = (changedValues: any, allValues: any) => {
    console.log('VÀO HÀM CHANGE FILE ', changedValues);

    const formData = new FormData();
    const { fileProducts, uploadOrderId, ...value } = allValues;
    if (uploadOrderId && Object.prototype.hasOwnProperty.call(changedValues, 'uploadOrderId')) {
      form.resetFields(['fileProducts'])
      const obj = listProducts?.find(
        (item: any) => item.id === form.getFieldValue('uploadOrderId')
      );
      form.setFieldValue('productId', obj.productId);
      console.log('TYPEOF OBJ ', typeof obj, ' OBJJJ ', obj);

      setDataTable([obj]);
    } else if (fileProducts && Object.prototype.hasOwnProperty.call(changedValues, 'fileProducts')) {
      formData.append('file', fileProducts);
      formData.append('id', form.getFieldValue('productId'));
      getInfoFile(formData);
    }
  };

  const handleGetProductsList = () => {
    form.resetFields(['uploadOrderId', 'fileProducts'])
    setDataTable([
      {
        id: 0,
        productCode: '',
        uploadOrderId: 0,
        deliveryOrderLineId: 0,
        amountNumber: "",
        categoryName: '',
        categoryType: 0,
        productName: '',
        productId: 0,
      },
    ]);
    setListProducts([]);
    const case1 = dataUploadOrderOptions?.filter(
      (item: any) =>
        item.value === form.getFieldValue('stockProductUploadOrderLineId')
    )[0]?.label;
    const case2 = dataExtendTransactionOptions?.filter(
      (item: any) =>
        item.value === form.getFieldValue('stockProductUploadOrderLineId')
    )[0]?.label;
    form.setFieldValue('uploadSourceType', case1 ? 1 : 2);
    form.setFieldValue('uploadSourceNo', case1 ?? case2);
    
    mutateGetListProducts({
      id: form.getFieldValue('stockProductUploadOrderLineId'),
      type: case1 ? 1 : 2,
      moveCode: case2
    });
  };

  const handleFinish = (values: any) => {
    console.log('GỬI LÊN NÈee ', form.getFieldsValue());
    uploadSimFn(form.getFieldsValue());
  };

  const handleDownloadFileAttachs = (file: FileData) => {
    if (file.id) {
      getFileDownloadAttachs({
        id: file.id as number,
        fileName: file.name ?? '',
      });
    }
  };

  const handleDownloadFile = (url: string) => {
    getFileDownload(url);
  };

  const handleSearch = useCallback(
    debounce((value) => {
      setSearchValue(value)
    }, 500),
    []
  );

  const columns: ExtendedColumnsType<ProductItem> = [
    {
      title: 'STT',
      align: 'left',
      fixed: 'left',
      width: 50,
      render(_, record, index) {
        return 1;
      },
    },

    {
      title: 'Mã sản phẩm',
      // dataIndex: 'productCode',
      width: 280,
      align: 'left',
      render(value, record) {
        return (
          <Form.Item
            label=""
            name="uploadOrderId"
            rules={[
              {
                required: true,
                message: 'Không được để trống trường này',
              },
            ]}
          >
            <CSelect
              placeholder="Chọn mã sản phẩm"
              options={productTypeOptions}
              disabled={
                typeModal === ActionType.VIEW ||
                !form.getFieldValue('stockProductUploadOrderLineId')
              }
              allowClear={false}
            ></CSelect>
          </Form.Item>
        );
      },
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      width: 120,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            {value}
          </Tooltip>
        );
      },
    },
    {
      title: 'Nhóm loại sản phẩm',
      dataIndex: 'categoryType',
      width: 120,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip
            title={
              PRODUCT_CATEGORY_CATEGORY_TYPE?.find(
                (item: any) => item.value === value.toString()
              )?.label
            }
            placement="topLeft"
          >
            {
              PRODUCT_CATEGORY_CATEGORY_TYPE?.find(
                (item: any) => item.value === value.toString()
              )?.label
            }
          </Tooltip>
        );
      },
    },

    {
      title: 'Số lượng',
      dataIndex: 'amountNumber',
      width: 80,
      align: 'left',
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            {value}
          </Tooltip>
        );
      },
    },
    {
      title: 'Upload file',
      width: 180,
      align: 'left',
      render(value, record) {
        return (
          <>
            <Form.Item
              label=""
              name="fileProducts"
              rules={[
                {
                  required: true,
                  message: 'Không được để trống trường này',
                },
              ]}
            >
              {typeModal === ActionType.ADD && (
                <CUpload
                  accept=".xlsx"
                  className="w-40"
                  disabled={!form.getFieldValue('uploadOrderId')}
                >
                  Chọn file
                </CUpload>
              )}
              {typeModal === ActionType.VIEW && (
                <Tooltip
                  title={form.getFieldValue('fileProductsName')}
                  placement="topLeft"
                >
                  <span
                    style={{ color: 'blue', cursor: 'pointer' }}
                    onClick={() =>
                      handleDownloadFile(form.getFieldValue('fileProducts'))
                    }
                  >
                    {form.getFieldValue('fileProductsName')}
                  </span>
                </Tooltip>
              )}
            </Form.Item>
            <div className="flex flex-col items-start">
              <Typography.Text
                italic
                style={{
                  color: '#CE5641',
                }}
              >
                Định dạng .xlsx
              </Typography.Text>
              <Typography.Text
                italic
                style={{
                  textDecoration: 'underline',
                  color: '#2BBB60',
                }}
                onClick={() => {
                  getFileTemplate(false);
                  setIsEsim(false);
                }}
                className="underline text-[#41CE6E] cursor-pointer"
              >
                (*) Tải file SIM mẫu
              </Typography.Text>
              <Typography.Text
                italic
                style={{
                  textDecoration: 'underline',
                  color: '#2BBB60',
                }}
                onClick={() => {
                  getFileTemplate(true);
                  setIsEsim(true);
                }}
                className="underline text-[#41CE6E] cursor-pointer"
              >
                (*) Tải file eSIM mẫu
              </Typography.Text>
            </div>
          </>
        );
      },
    },
  ];
  return (
    <>
      <TitleHeader>Upload tài nguyên SIM</TitleHeader>
      <Form
        form={form}
        disabled={typeModal === ActionType.VIEW}
        colon={false}
        className="mt-4"
        onValuesChange={handleChangeFile}
        onFinish={handleFinish}
      >
        <Form.Item label="" name="fileProductsName" hidden />
        <Form.Item label="" name="saveForm" hidden />
        <Form.Item label="" name="productId" hidden />
        <Form.Item label="" name="uploadSourceNo" hidden />
        <Form.Item label="" name="uploadSourceType" hidden />
        <Card>
          <Row gutter={16} className="mb-5">
            <Col span={8}>
              <Form.Item
                label="Mã đơn upload"
                name="stockProductUploadOrderLineId"
                rules={[
                  {
                    required: true,
                    message: 'Không được để trống trường này',
                  },
                ]}
              >
                <CSelect
                  options={dataSelectors}
                  placeholder="Chọn mã đơn upload"
                  onChange={handleGetProductsList}
                  allowClear={false}
                  onSearch={(value) => {
                    handleSearch(value)
                  }}
                ></CSelect>
              </Form.Item>
            </Col>
            <Col span={8}></Col>
          </Row>
          <Col span={16}>
            <div className="font-bold text-base text-primary mb-2 w-full mt-10">
              Danh sách sản phẩm
            </div>
          </Col>
          <Col span={32}>
            <CTable columns={columns} dataSource={dataTable} />
          </Col>
          <Col span={16}>

          </Col>
          <CTableUploadFile
            formName="files"
            onDownload={handleDownloadFileAttachs}
            disabled={typeModal === ActionType.VIEW}
          />
        </Card>
        <Row className="justify-end">
          <RowButton className="my-6">
            {typeModal !== ActionType.VIEW && (
              <>
                <CButtonSaveAndAdd htmlType="submit" onClick={() => form.setFieldValue('saveForm', true) } />
                <CButtonSave htmlType="submit" onClick={() => form.setFieldValue('saveForm', false) } />
              </>
            )}
            <CButtonClose
              type="default"
              onClick={() => {
                navigate(-1);
              }}
              disabled={false}
            >
              Đóng
            </CButtonClose>
          </RowButton>
        </Row>
      </Form>
    </>
  );
};

export default ModalAddEditView;
