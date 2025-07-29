import {
  CCol,
  CInput,
  CInputNumber,
  CSelect,
  CUploadFileTemplate,
  DebounceSelect,
  NotificationError,
} from '@react/commons/index';
import { FieldErrorsType } from '@react/commons/types';
import { ActionType, FILE_TYPE } from '@react/constants/app';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import formInstance from '@react/utils/form';
import validateForm, { serialSimReg } from '@react/utils/validator';
import { Card, Col, Form, Row } from 'antd';
import { Rule } from 'antd/lib/form';
import { ParamsOption } from 'apps/Partner/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';
import { useGetOrgByUser } from 'apps/Partner/src/hooks/useGetOrgByUser';
import { max } from 'lodash';
import { useParams } from 'react-router-dom';
import { useDownloadFile } from '../hooks/useDownloadFile';
import { useMutateProductList } from '../hooks/useGetProductList';
import { useListStockSim } from '../hooks/useListStockSim';
import { SerialRes, useSuggestSerial } from '../hooks/useSuggestSerial';
import { useViewKit } from '../hooks/useViewKit';
import '../index.scss';
import { ProductType } from '../types';
import { useState } from 'react';

interface ProductProps {
  actionType: ActionType;
  idx: number;
}

const CardProduct: React.FC<ProductProps> = ({ actionType, idx }) => {
  const form = Form.useFormInstance();
  const { id } = useParams();
  const isViewType = actionType === ActionType.VIEW;
  const { isUsingFile, products = [] } = Form.useWatch((e) => e, form) ?? {};
  const {
    fromSerial,
    orgId = undefined,
    amount = 0,
    simType,
  } = products[idx] ?? {};
  const toSerialField = ['products', idx, 'toSerial'];
  const fromSerialField = ['products', idx, 'fromSerial'];
  let lastSerialChecked: number | undefined = undefined;
  const { PRODUCT_CATEGORY_CATEGORY_TYPE = [] } =
    useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);
  const { data: listStockSim, isFetching: isLoadingStockSim } =
    useListStockSim('');
  const { data: dataOrg, isFetching: isLoadingOrg } = useGetOrgByUser();
  const { mutateAsync: mutateProductList } = useMutateProductList(true);

  const { mutate: mutateDownload } = useDownloadFile();
  const { mutateAsync: mutateSuggestSerial, data: dataSuggestSerial } =
    useSuggestSerial();
  const { data } = useViewKit(id);

  const isCheckRepeatSerial = () => {
    return products?.some((e: ProductType, index: number) => {
      if (e.fromSerial && fromSerial && e.toSerial && index !== idx)
        return e.fromSerial <= fromSerial && fromSerial <= e.toSerial;
      return false;
    });
  };
  const validateRepeatSerial = (): Rule => ({
    validator: (_, value) => {
      if (isCheckRepeatSerial()) {
        return Promise.reject('Serial bị trùng');
      }
      return Promise.resolve();
    },
  });
  const checkSuggestSerial = async (
    value: any,
    isSerial = true,
    isOrg = false,
    isCurrentIdx = false,
    index: number,
    productsChecked = []
  ) => {
    try {
      formInstance.resetFormError(
        form,
        productsChecked?.map((_: any, index: number) => [
          'products',
          index,
          'fromSerial',
        ])
      );
      const currentOrgId = !isOrg ? orgId : value;
      const toSerialList: (number | undefined)[] = productsChecked?.map(
        (e: ProductType, index: number) =>
          index !== idx ? e?.toSerial : undefined
      );
      const maxSerialChecked = max(toSerialList)
        ? //@ts-ignore
          max(toSerialList) + 1
        : undefined;
      const { firstSerial, lastSerial }: SerialRes = await mutateSuggestSerial({
        serialFirst: isCurrentIdx
          ? isSerial
            ? fromSerial
            : maxSerialChecked
          : lastSerialChecked,
        orgId: isCurrentIdx ? currentOrgId : products[index].orgId,
        simType: simType,
        amount: isCurrentIdx ? amount : products[index].amount,
      });
      form.setFieldValue(['products', index, 'toSerial'], lastSerial);
      form.setFieldValue(['products', index, 'fromSerial'], firstSerial);
      if (isCheckRepeatSerial()) {
        setTimeout(() =>
          form.setFields([
            {
              name: ['products', index, 'fromSerial'],
              errors: ['Serial bị trùng'],
            },
          ])
        );
      }
      lastSerialChecked = lastSerial + 1;
      return lastSerialChecked;
    } catch ({ errors }: any) {
      if (errors?.length > 0) {
        form.setFields(
          errors.map((item: FieldErrorsType) => ({
            name: fromSerialField,
            errors: [item.detail],
          }))
        );
      }
    }
  };

  const handleRequestSerial = async (
    value: any,
    isSerial = true,
    isOrg = false
  ) => {
    form.setFields([
      {
        name: ['products', idx, 'fromSerial'],
        errors: [],
      },
    ]);
    if (!isSerial) form.resetFields([fromSerialField, toSerialField]);
    if (!value || (isSerial && !fromSerial) || (!isOrg && !orgId)) return;
    if (isSerial && !serialSimReg.test(fromSerial)) return;
    if (isSerial && isCheckRepeatSerial()) return;
    if (!simType) {
      NotificationError('Vui lòng chọn sản phẩm');
      return;
    }
    if (!amount) {
      NotificationError('Vui lòng nhập số lượng');
      return;
    }
    const currentOrgId = !isOrg ? orgId : value;
    const productsChecked = products.map((c: ProductType) =>
      c.orgId === currentOrgId && c.simType === simType ? c : undefined
    );
    await checkSuggestSerial(
      value,
      isSerial,
      isOrg,
      true,
      idx,
      productsChecked
    );
    if (lastSerialChecked && isSerial) {
      productsChecked.forEach((e: ProductType, index: number) => {
        if (index === idx || !e) return;
        setTimeout(() => {
          checkSuggestSerial(
            value,
            isSerial,
            isOrg,
            false,
            index,
            productsChecked
          );
        }, 100 * index);
      });
    }
  };

  const handleClearSerial = () => {
    form.setFieldsValue({ toSerialField: undefined });
  };

  const handleDownload = () => {
    mutateDownload({
      fileType: 'FILENAME',
      id: id ? +id : undefined,
      fileName: data.products[idx]?.file?.name,
      detailId: data.products[idx].id,
    });
  };

  const handleDownloadTemplate = () => {
    mutateDownload({
      fileType: 'TEMPLATE',
      fileName: 'Danh_sach_so.xlsx',
    });
  };
  const handleSelectProduct = (option: ProductType) => {
    const { value, label, ...rest } = option as any;
    form.setFieldValue('products', [rest]);
  };
  const handleClearProduct = () => {
    form.resetFields(
      [
        'packageProfileCode',
        'bufferPackageCode',
        'profileType',
        'productType',
        'simType',
        'amount',
      ].map((e) => ['products', idx, e])
    );
  };
  return (
    <Card className={idx ? 'mt-4' : ''}>
      <Row gutter={16}>
        <CCol xxl={{ flex: 20 }} span={8}>
          <Form.Item
            label="Sản phẩm"
            name={[idx, 'productName']}
            rules={[validateForm.required]}
          >
            <DebounceSelect
              placeholder="Chọn sản phẩm"
              //@ts-ignore
              fetchOptions={mutateProductList}
              disabled={isViewType}
              onSelect={(value, option) =>
                handleSelectProduct(option as ProductType)
              }
              onClear={handleClearProduct}
            />
          </Form.Item>
        </CCol>
        <CCol xxl={{ flex: 20 }} span={8}>
          <Form.Item
            name={[idx, 'amount']}
            label="Số lượng"
            rules={[
              amount
                ? validateForm.minNumber(1, 'Số lượng phải lớn hơn 0')
                : validateForm.required,
            ]}
          >
            <CInput
              onlyNumber
              preventNumber0
              disabled={isViewType}
              placeholder="Số lượng"
              maxLength={10}
              type="number"
              preventSpace
              //@ts-ignore
              onBlur={(value: number) => handleRequestSerial(value, false)}
            />
          </Form.Item>
        </CCol>
        <CCol xxl={{ flex: 20 }} span={8}>
          <Form.Item
            label="Loại SIM"
            name={[idx, 'simType']}
            rules={[validateForm.required]}
          >
            <CSelect
              placeholder="Loại SIM"
              options={PRODUCT_CATEGORY_CATEGORY_TYPE}
              disabled
            />
          </Form.Item>
        </CCol>
        <CCol xxl={{ flex: 20 }} span={8}>
          <Form.Item name={[idx, 'packageProfileCode']} label="Gói cước chính">
            <CSelect
              labelInValue
              placeholder="Gói cước chính"
              options={[]}
              disabled
            />
          </Form.Item>
        </CCol>
        <CCol xxl={{ flex: 20 }} span={8}>
          <Form.Item name={[idx, 'bufferPackageCode']} label="Gói cước đệm">
            <CSelect
              labelInValue
              placeholder="Gói cước đệm"
              options={[]}
              disabled
            />
          </Form.Item>
        </CCol>
        <CCol xxl={{ flex: 20 }} span={8}>
          <Form.Item
            label="Loại profile"
            name={[idx, 'profileType']}
            rules={[validateForm.required]}
          >
            <CSelect
              placeholder="Loại profile"
              //@ts-ignore
              options={products[idx]?.profileTypeList ?? []}
              disabled={isViewType}
            />
          </Form.Item>
        </CCol>
        <CCol xxl={{ flex: 20 }} span={8}>
          <Form.Item
            name={[idx, 'stockId']}
            label="Kho số"
            rules={[validateForm.required]}
          >
            <CSelect
              placeholder="Chọn kho số"
              options={listStockSim}
              isLoading={isLoadingStockSim}
              disabled={isViewType}
            />
          </Form.Item>
        </CCol>
        <CCol xxl={{ flex: 20 }} span={8}>
          <Form.Item
            name={[idx, 'orgId']}
            label="Kho SIM"
            rules={[validateForm.required]}
          >
            <CSelect
              placeholder="Chọn kho SIM"
              options={dataOrg}
              isLoading={isLoadingOrg}
              disabled={isViewType}
              onSelect={(value: number) =>
                handleRequestSerial(value, false, true)
              }
              onClear={handleClearSerial}
            />
          </Form.Item>
        </CCol>
        <CCol xxl={{ flex: 20 }} span={8}>
          <Form.Item
            label="Serial đầu"
            name={[idx, 'fromSerial']}
            validateFirst="parallel"
            rules={[
              validateForm.required,
              fromSerial
                ? validateForm.serialSim
                : validateForm.equal(
                    dataSuggestSerial?.firstSerial,
                    'Serial không thuộc kho SIM'
                  ),
              validateRepeatSerial(),
            ]}
          >
            <CInput
              onlyNumber
              onBlur={handleRequestSerial}
              maxLength={16}
              disabled={isViewType}
              onClear={handleClearSerial}
              type="number"
              placeholder="Serial đầu"
            />
          </Form.Item>
        </CCol>
        <CCol xxl={{ flex: 20 }} span={8}>
          <Form.Item label="Serial cuối" name={[idx, 'toSerial']}>
            <CInputNumber disabled placeholder="Serial cuối" />
          </Form.Item>
        </CCol>
        {isUsingFile && (
          <Col span={24}>
            <CUploadFileTemplate
              required
              onDownloadTemplate={handleDownloadTemplate}
              onDownloadFile={isViewType ? handleDownload : undefined}
              accept={[FILE_TYPE.xlsx, 'application/vnd.ms-excel'] as any}
              label="Upload file"
              name={[idx, 'file']}
            />
          </Col>
        )}
      </Row>
    </Card>
  );
};

export default CardProduct;
