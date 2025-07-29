import { DownloadOutlined } from '@ant-design/icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton from '@react/commons/Button';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import { RangeNumberSerial } from '@react/commons/RangeNumber';
import CSelect from '@react/commons/Select';
import { TitleHeader } from '@react/commons/Template/style';
import {
  decodeSearchParams,
  handlePasteRemoveTextKeepNumber,
} from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Form, Tooltip } from 'antd';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { RowHeader } from '../page/style';
import { useExportFile } from '../queryHook/useExportFile';
import { useInfinityScrollProducts } from '../queryHook/useInfinityScrollProducts';
import { useGetListOrg } from '../queryHook/useList';
import { ParamsSerialLookup } from '../types';

const Header: React.FC = () => {
  const [form] = Form.useForm();
  const { pathname } = useLocation();
  const { data: listOrg } = useGetListOrg();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const [searchValueProduct, setSearchValueProduct] = useState<string>('');
  const {
    data: listProducts,
    fetchNextPage: productFetchNextPage,
    hasNextPage: productHasNextPage,
  } = useInfinityScrollProducts({
    page: 0,
    size: 20,
    valueSearch: searchValueProduct,
  });
  const handleScrollProducts = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.target as HTMLDivElement;
      if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
        if (productHasNextPage) {
          productFetchNextPage();
        }
      }
    },
    [productHasNextPage, productFetchNextPage]
  );

  const { handleSearch } = useSearchHandler(
    REACT_QUERY_KEYS.GET_LIST_SERIAL_LIST
  );

  const {
    STOCK_PRODUCT_SERIAL_STATUS = [],
    STOCK_PRODUCT_SERIAL_KIT_STATUS = [],
  } = useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);

  const optionOrg = useMemo(() => {
    if (!listOrg) {
      return [];
    }
    return listOrg.map((org) => ({
      label: org.orgName,
      value: org.orgId,
    }));
  }, [listOrg]);

  const optionProducts = useMemo(() => {
    if (!listProducts) {
      return [];
    }
    return listProducts.map((product) => ({
      label: product.productName,
      value: product.id,
    }));
  }, [listProducts]);

  useEffect(() => {
    const paramsUrl = Object.fromEntries(searchParams.entries());
    form.setFieldsValue({
      isDn: paramsUrl.isDn === 'undefined' ? '' : paramsUrl.isDn,
      fromSerial:
        paramsUrl.fromSerial === 'undefined' ? '' : paramsUrl.fromSerial,
      toSerial: paramsUrl.toSerial === 'undefined' ? '' : paramsUrl.toSerial,
      productIds: paramsUrl.productIds
        ? paramsUrl.productIds.split(',').map((item) => Number(item))
        : [],
      orgIds: paramsUrl.orgIds
        ? paramsUrl.orgIds.split(',').map((item) => Number(item))
        : [],
      kitStatus:
        paramsUrl.kitStatus && paramsUrl.kitStatus !== 'undefined'
          ? paramsUrl.kitStatus
          : undefined,
      status:
        paramsUrl.status && paramsUrl.status !== 'undefined'
          ? paramsUrl.status
          : undefined,
    });
    return () => {
      form.resetFields();
    };
  }, [pathname]);

  const items: ItemFilter[] = useMemo(() => {
    return [
      {
        label: 'Trạng thái',
        value: (
          <Form.Item name="kitStatus" className={'!max-w-60 !w-60'}>
            <CSelect
              options={STOCK_PRODUCT_SERIAL_KIT_STATUS}
              maxRow={3}
              style={{ width: '100%', minWidth: '150px' }}
              placeholder="Chọn trạng thái"
            />
          </Form.Item>
        ),
      },
      {
        label: 'Trạng thái phân phối',
        value: (
          <Form.Item name="status" className={'!max-w-60 !w-60'}>
            <CSelect
              options={STOCK_PRODUCT_SERIAL_STATUS}
              maxRow={3}
              style={{ width: '100%', minWidth: '150px' }}
              placeholder="Chọn trạng thái phân phối"
            />
          </Form.Item>
        ),
      },
      {
        label: 'Kho',
        value: (
          <Form.Item name="orgIds" className={'!max-w-60 !w-60'}>
            <CSelect
              options={optionOrg}
              maxRow={3}
              mode="multiple"
              style={{ width: '100%', minWidth: '150px' }}
              placeholder="Chọn kho"
            />
          </Form.Item>
        ),
      },
      {
        label: 'Sản phẩm',
        value: (
          <Form.Item name="productIds" className={'!max-w-60 !w-60'}>
            <CSelect
              options={optionProducts}
              onPopupScroll={handleScrollProducts}
              onSearch={(value) => {
                setSearchValueProduct(value);
              }}
              searchValue={searchValueProduct}
              filterOption={false}
              maxRow={3}
              mode="multiple"
              style={{ width: '100%', minWidth: '150px' }}
              placeholder="Chọn sản phẩm"
            />
          </Form.Item>
        ),
      },
      {
        label: 'Dải serial',
        showDefault: true,
        value: (
          <RangeNumberSerial
            name={['fromSerial', 'toSerial']}
            placeholder={['Dải serial SIM từ', 'Dải serial SIM đến']}
            maxLength={16}
          />
        ),
      },
    ];
  }, [
    optionOrg,
    optionProducts,
    STOCK_PRODUCT_SERIAL_KIT_STATUS,
    STOCK_PRODUCT_SERIAL_STATUS,
    searchValueProduct,
    setSearchValueProduct,
    handleScrollProducts,
  ]);

  const onFinish = (val: any) => {
    const { orgIds, productIds, ...reset } = val;
    const data: ParamsSerialLookup = {
      ...params,
      ...reset,
      orgIds: orgIds ? orgIds.join(',') : undefined,
      productIds: productIds ? productIds.join(',') : undefined,
      page: 0,
    };
    handleSearch(data);
  };

  const { mutate: exportFile, isPending: loadingExportFile } = useExportFile();

  return (
    <>
      <TitleHeader>Tra cứu Serial</TitleHeader>
      <RowHeader className="!mb-10">
        <Form form={form} onFinish={onFinish} validateTrigger={['onSubmit']}>
          <CFilter
            items={items}
            validQuery={REACT_QUERY_KEYS.GET_LIST_SERIAL_LIST}
            searchComponent={
              <Tooltip title="Nhập số thuê bao" placement="right">
                <Form.Item name="isDn" className={'!max-w-60'}>
                  <CInput
                    placeholder="Nhập số thuê bao"
                    maxLength={100}
                    onPaste={(e) => handlePasteRemoveTextKeepNumber(e, 100)}
                    onlyNumber
                    prefix={<FontAwesomeIcon icon={faSearch} />}
                  />
                </Form.Item>
              </Tooltip>
            }
          />
        </Form>
        <CButton
          icon={<DownloadOutlined />}
          onClick={() => exportFile({ ...params, filters: undefined })}
          loading={loadingExportFile}
        >
          Xuất serial
        </CButton>
      </RowHeader>
    </>
  );
};

export default Header;
