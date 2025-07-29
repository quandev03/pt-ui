import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import { CInput, CSelect, CTable } from '@react/commons/index';
import { RangeNumberSerial } from '@react/commons/RangeNumber';
import { RowHeader, TitleHeader } from '@react/commons/Template/style';
import { AnyElement, ParamsOption } from '@react/commons/types';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Form } from 'antd';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { columnsKitCraftList } from '../constants';
import { useGenQr } from '../hooks/useGenQr';
import { useGetProductListNoEnabled } from '../hooks/useGetProductList';
import {
  IKitListItem,
  queryKeyListKitCraft,
  useKitList,
} from '../hooks/useKitList';
import { useGetPackageList } from '../hooks/useGetPackageList';
import { GroupTypePackage, IPackageType } from '../types';

const KitCraftList: React.FC = () => {
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { handleSearch } = useSearchHandler(queryKeyListKitCraft);
  const { data, isFetching: isLoadingList } = useKitList(queryParams(params));
  const { mutate: mutateGenQr } = useGenQr();
  const {
    COMBINE_KIT_PROCESS_TYPE = [],
    COMBINE_KIT_SIM_TYPE = [],
    COMBINE_KIT_KIT_STATUS = [],
    COMBINE_KIT_ISDN_TYPE = [],
    STOCK_PRODUCT_SERIAL_STATUS = [],
  } = useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);
  const handleGenQr = useCallback(
    (id: string, { serial, isdn }: IKitListItem) => {
      mutateGenQr({
        id,
        fileName: `${serial}_${isdn}_File QR eSIM.xlsx`,
      });
    },
    [mutateGenQr]
  );
  const columns = useMemo(() => {
    return columnsKitCraftList(
      params,
      COMBINE_KIT_PROCESS_TYPE,
      COMBINE_KIT_SIM_TYPE,
      COMBINE_KIT_KIT_STATUS,
      COMBINE_KIT_ISDN_TYPE,
      STOCK_PRODUCT_SERIAL_STATUS,
      handleGenQr
    );
  }, [
    params,
    COMBINE_KIT_PROCESS_TYPE,
    COMBINE_KIT_SIM_TYPE,
    COMBINE_KIT_KIT_STATUS,
    COMBINE_KIT_ISDN_TYPE,
    STOCK_PRODUCT_SERIAL_STATUS,
    handleGenQr,
  ]);

  const { data: products } = useGetProductListNoEnabled();
  const productOptions = useMemo(() => {
    if (!products) return [];
    return products.map((item) => ({
      label: item.productName,
      value: item.productId,
    }));
  }, [products]);
  const { data: packages } = useGetPackageList();
  const packagesOptions = useMemo(() => {
    if (!packages) return [];
    return packages?.data
      .filter((item: IPackageType) => item.groupType !== GroupTypePackage.ADDON)
      .map((item: IPackageType) => ({
        label: item.pckName,
        value: item.id,
      }));
  }, [packages]);
  useEffect(() => {
    form.setFieldsValue({
      ...params,
      packageId: params.packageId ? Number(params.packageId) : null,
      productId: params.productId ? Number(params.productId) : null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items: ItemFilter[] = useMemo(() => {
    return [
      {
        label: 'Sản phẩm',
        value: (
          <Form.Item label="" name="productId" className="w-48 mb-0">
            <CSelect options={productOptions} placeholder="Sản phẩm" />
          </Form.Item>
        ),
      },
      {
        label: 'Gói cước',
        value: (
          <Form.Item label="" name="packageId" className="w-48 mb-0">
            <CSelect options={packagesOptions} placeholder="Gói cước" />
          </Form.Item>
        ),
      },
      {
        label: 'Dải serial SIM từ',
        value: (
          <RangeNumberSerial
            name={['fromSerial', 'toSerial']}
            placeholder={['Dải serial SIM từ', 'Dải serial SIM đến']}
          />
        ),
      },
    ];
  }, [productOptions, packagesOptions]);

  return (
    <div>
      <TitleHeader>Danh sách KIT</TitleHeader>
      <RowHeader className="!mb-10">
        <Form
          form={form}
          onFinish={handleSearch}
          validateTrigger={['onSubmit', 'onBlur']}
        >
          <CFilter
            items={items}
            validQuery={queryKeyListKitCraft}
            searchComponent={
              <Form.Item label="" name="isdn" className="!mb-0">
                <CInput
                  placeholder="Nhập số thuê bao"
                  prefix={<FontAwesomeIcon icon={faSearch} />}
                  maxLength={100}
                  onlyNumber
                />
              </Form.Item>
            }
          />
        </Form>
      </RowHeader>
      <div className="mt-8">
        <CTable
          columns={columns}
          dataSource={data?.content ?? []}
          loading={isLoadingList}
          rowKey={'id'}
          pagination={{
            total: data?.totalElements,
          }}
        />
      </div>
    </div>
  );
};

export default memo(KitCraftList);
