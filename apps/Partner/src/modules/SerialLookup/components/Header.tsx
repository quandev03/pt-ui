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
import { Form } from 'antd';
import { ParamsOption } from 'apps/Partner/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { RowHeader } from '../page/style';
import { useExportFile } from '../queryHook/useExportFile';
import { useInfinityScrollProducts } from '../queryHook/useInfinityScrollProducts';
import { useGetListOrg } from '../queryHook/useList';
import { IProduct } from '../types';

const Header: React.FC = () => {
  const [form] = Form.useForm();
  const { pathname } = useLocation();
  const { data: listOrg } = useGetListOrg();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const {
    data: listProducts,
    fetchNextPage: productFetchNextPage,
    hasNextPage: productHasNextPage,
  } = useInfinityScrollProducts({
    page: 0,
    size: 20,
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
    return listProducts.map((product: IProduct) => ({
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
      kitStatus: paramsUrl.kitStatus === 'undefined' ? '' : paramsUrl.kitStatus,
    });
    return () => {
      form.resetFields();
    };
  }, [pathname]);
  const { STOCK_PRODUCT_SERIAL_PARTNER_KIT_STATUS = [] } =
    useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS_OPTION]);
  const items: ItemFilter[] = useMemo(() => {
    return [
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
        label: 'Trạng thái',
        value: (
          <Form.Item name="kitStatus" className={'!max-w-60 !w-60'}>
            <CSelect
              placeholder="Chọn trạng thái"
              options={STOCK_PRODUCT_SERIAL_PARTNER_KIT_STATUS}
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
              maxRow={3}
              mode="multiple"
              style={{ width: '100%', minWidth: '150px' }}
              placeholder="Chọn sản phẩm"
            />
          </Form.Item>
        ),
      },
      {
        showDefault: true,
        label: 'Dải serial',
        value: (
          <RangeNumberSerial
            name={['fromSerial', 'toSerial']}
            placeholder={['Dải serial SIM từ', 'Dải serial SIM đến']}
          />
        ),
      },
    ];
  }, [
    STOCK_PRODUCT_SERIAL_PARTNER_KIT_STATUS,
    handleScrollProducts,
    optionOrg,
    optionProducts,
  ]);

  const onFinish = (val: any) => {
    const { orgIds, productIds, ...reset } = val;
    setSearchParams({
      ...params,
      ...reset,
      orgIds: orgIds ? orgIds.join(',') : undefined,
      productIds: productIds ? productIds.join(',') : undefined,
      page: 0,
    });
    handleSearch(searchParams);
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
              <Form.Item name="isDn" className={'!max-w-60'}>
                <CInput
                  placeholder="Nhập số thuê bao"
                  maxLength={100}
                  onPaste={(e) => handlePasteRemoveTextKeepNumber(e, 100)}
                  onlyNumber
                  prefix={<FontAwesomeIcon icon={faSearch} />}
                />
              </Form.Item>
            }
          />
        </Form>
        <CButton
          icon={<DownloadOutlined />}
          onClick={() => exportFile(params)}
          loading={loadingExportFile}
        >
          Xuất serial
        </CButton>
      </RowHeader>
    </>
  );
};

export default Header;
