import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CButtonExport } from '@react/commons/Button';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import { CInput, CTable, CTooltip, SelectDebounce } from '@react/commons/index';
import { RangeNumberSerial } from '@react/commons/RangeNumber';
import { RowHeader, TitleHeader } from '@react/commons/Template/style';
import { ActionsTypeEnum } from '@react/constants/app';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Form } from 'antd';
import { ParamsOption } from 'apps/Internal/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import { includes } from 'lodash';
import { memo, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useSearchParams } from 'react-router-dom';
import { columnsKitCraftList } from '../constants';
import { useExportList } from '../hooks/useExportList';
import { getPackageList } from '../hooks/useGetPackageList';
import { getProductList } from '../hooks/useGetProductList';
import { queryKeyListKitCraft, useKitList } from '../hooks/useKitList';

const KitCraftList: React.FC = () => {
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { handleSearch } = useSearchHandler(queryKeyListKitCraft);
  const { data, isFetching: isLoadingList } = useKitList(queryParams(params));
  const {
    COMBINE_KIT_PROCESS_TYPE = [],
    COMBINE_KIT_SIM_TYPE = [],
    COMBINE_KIT_KIT_STATUS = [],
    COMBINE_KIT_ISDN_TYPE = [],
    STOCK_PRODUCT_SERIAL_STATUS = [],
  } = useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);
  const columns = useMemo(() => {
    return columnsKitCraftList(
      params,
      COMBINE_KIT_PROCESS_TYPE,
      COMBINE_KIT_SIM_TYPE,
      COMBINE_KIT_KIT_STATUS,
      COMBINE_KIT_ISDN_TYPE,
      STOCK_PRODUCT_SERIAL_STATUS
    );
  }, [
    params,
    COMBINE_KIT_PROCESS_TYPE,
    COMBINE_KIT_SIM_TYPE,
    COMBINE_KIT_KIT_STATUS,
    COMBINE_KIT_ISDN_TYPE,
    STOCK_PRODUCT_SERIAL_STATUS,
  ]);
  const listRoleByRouter = useRolesByRouter();
  const intl = useIntl();

  const items: ItemFilter[] = useMemo(() => {
    return [
      {
        label: 'Sản phẩm',
        value: (
          <>
            <Form.Item name="productId" className="w-48 mb-0">
              <SelectDebounce
                placeholder="Sản phẩm"
                fetchOptions={getProductList}
                debounceTimeout={500}
                allowClear
                defaultSearch={params.productName}
                onChange={(_, option: any) => {
                  if (option) {
                    form.setFieldsValue({
                      productName: option.label,
                    });
                  }
                }}
              />
            </Form.Item>
            <Form.Item name="productName" hidden>
              <CInput />
            </Form.Item>
          </>
        ),
      },
      {
        label: 'Gói cước',
        value: (
          <>
            <Form.Item label="" name="packageId" className="w-48 mb-0">
              <SelectDebounce
                placeholder="Gói cước"
                fetchOptions={getPackageList}
                debounceTimeout={500}
                allowClear
                defaultSearch={params.packageName}
                onChange={(_, option: any) => {
                  if (option) {
                    form.setFieldsValue({
                      packageName: option.label,
                    });
                  }
                }}
              />
            </Form.Item>
            <Form.Item name="packageName" hidden>
              <CInput />
            </Form.Item>
          </>
        ),
      },
      {
        label: 'Dải serial',
        value: (
          <RangeNumberSerial
            name={['fromSerial', 'toSerial']}
            placeholder={['Dải serial SIM từ', 'Dải serial SIM đến']}
          />
        ),
      },
    ];
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      ...params,
      packageId: params.packageId ? Number(params.packageId) : null,
      productId: params.productId ? Number(params.productId) : null,
    });
  }, []);
  const { mutateAsync: mutateExport } = useExportList();
  const onDownload = () => {
    mutateExport(params);
  };

  return (
    <div>
      <TitleHeader> Danh sách KIT</TitleHeader>
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
              <CTooltip title="Nhập số thuê bao">
                <Form.Item label="" name="isdn" className="!mb-0">
                  <CInput
                    placeholder="Nhập số thuê bao"
                    prefix={<FontAwesomeIcon icon={faSearch} />}
                    maxLength={100}
                    onlyNumber
                  />
                </Form.Item>
              </CTooltip>
            }
          />
        </Form>
        {includes(listRoleByRouter, ActionsTypeEnum.EXPORT_EXCEL) && (
          <CButtonExport onClick={onDownload}>
            {intl.formatMessage({ id: 'Xuất file excel' })}
          </CButtonExport>
        )}
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
