import { DateFormat } from '@react/constants/app';
import {
  Card,
  Col,
  DatePicker,
  Form,
  FormProps,
  Radio,
  Row,
  Typography,
} from 'antd';

import { RowButton } from '@react/commons/Template/style';
import { useCallback, useEffect, useState } from 'react';

import CButton, { CButtonSave } from '@react/commons/Button';
import CRadio from '@react/commons/Radio';
import CSelect from '@react/commons/Select';
import CTextArea from '@react/commons/TextArea';
import { useNavigate } from 'react-router-dom';
import { IFieldsExcel, IItemProduct } from '../type';

import CUpload from '@react/commons/Upload';
import { MODE_METHOD, MODE_TYPE } from '@react/constants/eximTransaction';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import {
  CSV_TYPE,
  DEFAULT_SEARCH_PARAMS,
  ELEMENT_MODE,
  FIELD_NAMES,
  FIELDS_TO_CHECK,
  MAX_FILE_SIZE,
  TITLE_KEY_FILE_EXCEL,
} from '../constant';
import { useCreateExportTransaction } from '../hooks/useCreateExportTransaction';
import { useGetListProducts } from '../hooks/useGetListProduct';
import { useGetOrdId } from '../hooks/useGetOrdId';
import { useGetUploadFile } from '../hooks/useGetUploadFile';
import { useGetReasonCatalog } from '../hooks/useReasonCatalog';
import { API_PATHS } from '../services/url';
import useGetDataProduct from '../store/useGetDataProduct';
import ListOfNumber from './ModalListOfNumber';
import ModalSelectInventory from './ModalSelectedInventory';

const Body: React.FC = () => {
  const [form] = Form.useForm();
  const { mutate: fetcher, isPending: isLoadingSubmit } =
    useCreateExportTransaction();
  const { listProducts, setListProducts } = useGetDataProduct();
  const { data: dataProducts } = useGetListProducts(DEFAULT_SEARCH_PARAMS);
  const { data: reasonName } = useGetReasonCatalog();
  const { data: orgId } = useGetOrdId();
  const [selectMode, setSelectMode] = useState<string>(ELEMENT_MODE.SINGLE);
  const [fileError, setFileError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [showUploadButton, setShowUploadButton] = useState<boolean>(true);
  const [refesh, setRefesh] = useState<boolean>(false);
  const { mutate } = useGetUploadFile();
  const handleExport = () => {
    mutate({
      uri: API_PATHS.GET_UPLOAD_FILE,
      filename: 'Upload_Sim',
    });
  };

  const navigate = useNavigate();

  const handleChangeMode = (e: any) => {
    setListProducts([]);
    setFileError('');
    setShowUploadButton(true);
    setSelectMode(e.target.value);
  };

  const handleUpLoad = (file: File) => {
    if (!isValidFile(file)) return false;

    const reader = new FileReader();
    reader.onload = handleFileLoad;
    reader.readAsBinaryString(file);
  };

  const isValidFile = (file: File): boolean => {
    const { type: fileType, name: fileName, size: fileSize } = file;

    setShowUploadButton(false);

    if (fileType !== CSV_TYPE && fileName.endsWith('.csv')) {
      setFileError('File tải không đúng định dạng');
      return false;
    }

    if (fileSize > MAX_FILE_SIZE) {
      setFileError('File tải lên vượt quá 5MB');
      return false;
    }

    return true;
  };

  const checkForEmptyFields = (jsonData: IFieldsExcel[]): string[] => {
    const emptyFieldsMessages: string[] = [];
    jsonData.forEach((item: IFieldsExcel) => {
      FIELDS_TO_CHECK.forEach(({ field, message }) => {
        if (String(item[field]) === 'undefined' || item[field].length < 0) {
          emptyFieldsMessages.push(message);
        }
      });
    });
    return emptyFieldsMessages;
  };

  const checkDuplicateSerialAndCode = (data: IFieldsExcel[]): boolean => {
    const productCodeFrequency: { [key: string]: number } = {};
    const fromSerialFrequency: { [key: string]: number } = {};
    const toSerialFrequency: { [key: string]: number } = {};

    data.forEach((item) => {
      productCodeFrequency[item.productCode] =
        (productCodeFrequency[item.productCode] || 0) + 1;
      fromSerialFrequency[item.fromSerial] =
        (fromSerialFrequency[item.fromSerial] || 0) + 1;
      toSerialFrequency[item.toSerial] =
        (toSerialFrequency[item.toSerial] || 0) + 1;
    });

    const hasDuplicateProductCode = Object.values(productCodeFrequency).some(
      (count) => count > 1
    );
    const hasDuplicateFromSerial = Object.values(fromSerialFrequency).some(
      (count) => count > 1
    );
    const hasDuplicateToSerial = Object.values(toSerialFrequency).some(
      (count) => count > 1
    );

    return (
      hasDuplicateProductCode || hasDuplicateFromSerial || hasDuplicateToSerial
    );
  };

  const isValidCode = (jsonData: IFieldsExcel[]): boolean => {
    const frequencyCounter: { [key: string]: number } = {};
    jsonData.forEach((item) => {
      const code = item.productCode;
      frequencyCounter[code] = (frequencyCounter[code] || 0) + 1;
    });
    for (const code in frequencyCounter) {
      if (!dataProducts.includes(code)) {
        return false;
      }
    }
    return true;
  };

  const isValidDataFile = (jsonData: IFieldsExcel[]) => {
    const maxLengthSerial = jsonData.every(
      (item: IFieldsExcel) =>
        item?.fromSerial.length === 16 &&
        item?.toSerial.length === 16 &&
        item?.fromSerial.startsWith('84') &&
        item?.toSerial.startsWith('84')
    );

    if (jsonData.length === 0) {
      setFileError('File tải lên không có dữ liệu');
      setListProducts([]);
      return true;
    }
    if (checkForEmptyFields(jsonData).length > 0) {
      setFileError(checkForEmptyFields(jsonData)[0]);
      return true;
    }
    if (isValidCode(jsonData)) {
      setFileError('Mã sản phẩm không tồn tại');
      return true;
    }

    if (!maxLengthSerial) {
      setFileError('Nhập sai định dạng serial');
      setListProducts([]);
      return true;
    }

    if (checkDuplicateSerialAndCode(jsonData)) {
      setFileError('Nhập trùng serial , mã sản phẩm');
      setListProducts([]);
      return true;
    }

    return false;
  };

  const isValidCheckKey = (jsonData: any) => {
    const isValid = jsonData.some((obj: any) => {
      const commonValues = Object.keys(obj).filter((key: string) =>
        TITLE_KEY_FILE_EXCEL.includes(key)
      );
      return commonValues.length > 0;
    });
    if (!isValid) {
      return true;
    }
    return false;
  };

  const handleFileLoad = (e: ProgressEvent<FileReader>) => {
    const fileContent = e.target?.result;
    if (typeof fileContent === 'string' && fileContent.includes('<html')) {
      setFileError('File không đúng định dạng');
      return false;
    }

    if (fileContent) {
      const workbook = XLSX.read(fileContent, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as IItemProduct[];

      if (isValidCheckKey(jsonData)) {
        setFileError('File không đúng định dạng');
        return false;
      }

      const rows = jsonData.map((row: any) => {
        return {
          productCode: String(row[FIELD_NAMES['productCode']]),
          fromSerial: String(row[FIELD_NAMES['fromSerial']]),
          toSerial: String(row[FIELD_NAMES['toSerial']]),
          productUom: String(row[FIELD_NAMES['productUom']]),
          productName: String(row[FIELD_NAMES['productName']]),
        };
      });

      if (isValidDataFile(rows)) {
        return false;
      }

      setFileError('');
      setListProducts(rows);
    }
  };

  const resetForm = useCallback(() => {
    setListProducts([]);
    form.resetFields();
  }, [form]);

  const handleResetForm = () => {
    navigate(pathRoutes.eximDistributorTransactionList);
    setListProducts([]);
    form.resetFields();
  };

  const handleRemoveNotifi = () => {
    setFileError('');
    setListProducts([]);
    setShowUploadButton(true);
  };

  const handleCustomRequest = (options: any) => {
    const { file, onSuccess } = options;
    const reader = new FileReader();
    reader.onload = () => {
      handleUpLoad(file);
      onSuccess('ok');
    };
    reader.readAsText(file);
  };

  const isValidNumber = (data: IItemProduct[]): boolean => {
    if (data.length === 0) {
      return false;
    }
    const isValid = data.every(
      (item) => item.fromSerial && item.toSerial && item.productUom
    );
    if (isValid) setFileError('');
    return isValid;
  };

  const onFinish: FormProps<any>['onFinish'] = useCallback(
    (values: any) => {
      const { files, chooseProduct, description, ...value } = values;
      if (!isValidNumber(listProducts)) {
        setListError('Không được để trống trường này');
        return false;
      }
      if (listProducts?.length && !fileError) {
        const updatedListProduct = listProducts.map((product) => {
          return {
            orgId: orgId && orgId[0].value,
            productCode: product.productCode,
            fromSerial: product.fromSerial,
            toSerial: product.toSerial,
            quantity: product.productUom,
          };
        });
        const payload = {
          ...value,
          ...(description && { description }),
          ieOrgId: orgId && orgId[0].value,
          moveType: MODE_TYPE.ORTHER,
          moveMethod: MODE_METHOD.EXPORT,
          stockMoveLineDTOS: updatedListProduct,
        };

        fetcher(payload);
      }
      setShowUploadButton(true);
      setListProducts([]);
      setRefesh(true);
      resetForm();
    },
    [fileError, listProducts]
  );

  const onFinishFailed: FormProps<any>['onFinishFailed'] = (errorInfo) => {
    if (listProducts.length === 0) {
      setFileError('Không được để trống trường này');
    }
    if (!isValidNumber(listProducts)) {
      setListError('Không được để trống trường này');
      return false;
    }
  };

  useEffect(() => {
    if (!isValidNumber(listProducts)) {
      setListError('');
    }
  }, [listProducts, setListError]);

  return (
    <>
      <Card>
        <Form
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          colon={false}
        >
          <Row gutter={[24, 24]}>
            <Col span={12}>
              <Form.Item
                labelAlign="left"
                label="Ngày xuất"
                name="moveDate"
                className="w-70"
                initialValue={dayjs()}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <DatePicker
                  placeholder="Chọn ngày"
                  format={DateFormat.DEFAULT}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelAlign="left"
                label="Kho xuất"
                name="orgId"
                initialValue={1}
                rules={[
                  {
                    required: true,
                    message: 'Không được để trống trường này',
                  },
                ]}
              >
                <CSelect options={orgId} placeholder="Chọn kho xuất" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelAlign="left"
                label="Lý do xuất kho"
                name="reasonId"
                rules={[
                  { required: true, message: 'Không được để trống trường này' },
                ]}
              >
                <CSelect options={reasonName} placeholder="Lý do" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                labelAlign="left"
                label="Ghi chú"
                name="description"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
              >
                <CTextArea placeholder="Ghi chú" maxLength={200} rows={3} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col className="mt-4" span={12}>
              <Form.Item
                name="chooseProduct"
                labelAlign="left"
                label="Thêm sản phẩm"
                rules={[{ required: true }]}
                initialValue={selectMode}
              >
                <Radio.Group
                  onChange={(e) => handleChangeMode(e)}
                  value={selectMode}
                  defaultValue={selectMode}
                >
                  <CRadio value={ELEMENT_MODE.SINGLE}>Đơn lẻ</CRadio>
                  <CRadio value={ELEMENT_MODE.FILE}>Theo file</CRadio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          {selectMode === ELEMENT_MODE.FILE && (
            <Row>
              <Col span={12}>
                <Form.Item
                  name="files"
                  label="File"
                  rules={[
                    {
                      validator(rule, value, callback) {
                        if (!value || value.length === 0) {
                          return Promise.reject(
                            'Không được để trống trường này'
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                  validateStatus={fileError ? 'error' : 'success'}
                  help={fileError}
                >
                  <Row>
                    <Col>
                      <CUpload
                        accept=".xlsx"
                        maxCount={1}
                        onRemove={() => handleRemoveNotifi()}
                        customRequest={handleCustomRequest}
                      >
                        {showUploadButton && <CButton>Chọn file</CButton>}
                      </CUpload>
                    </Col>
                    <Col className="flex ml-7 items-center flex-col italic">
                      <Typography.Text className="text-[#2BBB60]">
                        Định dạng .xlsx
                      </Typography.Text>
                      <Typography.Text className="underline text-[#2BBB60]">
                        <a
                          onClick={handleExport}
                          className="underline text-[#2BBB60]"
                        >
                          (*) Tải file SIM mẫu
                        </a>
                      </Typography.Text>
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
            </Row>
          )}
          <ListOfNumber
            validator={isValidNumber}
            fileError={listError}
            selectMode={selectMode}
            setFileError={setFileError}
            setRefesh={setRefesh}
            refesh={refesh}
          />
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <RowButton className="my-6">
              <CButtonSave htmlType="submit" />
              <CButton onClick={handleResetForm} type="default">
                Hủy
              </CButton>
            </RowButton>
          </Form.Item>
        </Form>
      </Card>
      <ModalSelectInventory />
    </>
  );
};
export default Body;
