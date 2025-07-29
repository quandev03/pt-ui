import { CButtonAdd, CButtonExport } from '@react/commons/Button';
import { CRangePicker } from '@react/commons/DatePicker';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import {
  BtnGroupFooter,
  RowHeader,
  TitleHeader,
} from '@react/commons/Template/style';
import { ParamsOption } from '@react/commons/types';
import { ActionsTypeEnum, DateFormat } from '@react/constants/app';
import { formatDate, formatDateEnglishV2 } from '@react/constants/moment';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import useSearchHandler from '@react/hooks/useSearchHandler';
import {
  prefixCustomerService,
  prefixCustomerServicePublic,
} from '@react/url/app';
import { Form, Row, Tooltip } from 'antd';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';
import { pathRoutes } from 'apps/Partner/src/constants/routes';
import { useExportMutation } from 'apps/Partner/src/hooks/useExportMutation';
import { useRolesByRouter } from 'apps/Partner/src/hooks/useRolesByRouter';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import { useEffect, useLayoutEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Header = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const [form] = Form.useForm();
  const { COMBINE_KIT_SIM_TYPE = [] } = useGetDataFromQueryKey<ParamsOption>([
    REACT_QUERY_KEYS.GET_PARAMS,
  ]);
  const { mutate: downloadFile } = useExportMutation();
  const actionByRole = useRolesByRouter();
  const { handleSearch } = useSearchHandler(
    REACT_QUERY_KEYS.GET_SIM_REPLACEMENT_LIST
  );

  useLayoutEffect(() => {
    if (params.simType) {
      setSearchParams({
        ...params,
        filters: '0,1',
      });
    } else {
      setSearchParams({
        filters: '0,1',
        simType: '1',
        fromDate: dayjs().subtract(29, 'day').format(DateFormat.DATE_ISO),
        toDate: dayjs().format(DateFormat.DATE_ISO),
      });
    }
  }, [params.simType]);

  useEffect(() => {
    if (params) {
      const { fromDate, toDate, simType, ...rest } = params;
      const from = fromDate ? dayjs(fromDate, formatDateEnglishV2) : dayjs();
      const to = toDate ? dayjs(toDate, formatDateEnglishV2) : dayjs();
      form.setFieldsValue({
        ...rest,
        simType: simType,
        rangePicker: [from, to],
      });
    }
  }, [params]);

  const items: ItemFilter[] = [
    {
      label: 'Loại mặt hàng',
      value: (
        <Form.Item className="min-w-32" name={'simType'}>
          <CSelect
            placeholder="Loại mặt hàng"
            showSearch={false}
            options={COMBINE_KIT_SIM_TYPE}
            allowClear={false}
          />
        </Form.Item>
      ),
      showDefault: true,
    },
    {
      label: 'Ngày thực hiện',
      value: (
        <Form.Item name="rangePicker" initialValue={[dayjs(), dayjs()]}>
          <CRangePicker
            placeholder={['Từ ngày', 'Đến ngày']}
            format={formatDate}
          />
        </Form.Item>
      ),
      showDefault: true,
    },
  ];
  const navigate = useNavigate();
  const handleFinish = (values: any) => {
    const [fromDate, toDate] = values.rangePicker || [dayjs(), dayjs()];
    handleSearch({
      ...params,
      filters: '0,1',
      simType: values.simType || '1',
      q: values.q,
      fromDate: fromDate.format(formatDateEnglishV2),
      toDate: toDate.format(formatDateEnglishV2),
    });
  };
  const handleExportExcel = () => {
    const { page, size, ...rest } = params;
    downloadFile({
      uri: `${prefixCustomerServicePublic}/change-sim-bulk/export`,
      params: queryParams(rest),
      filename: `Danh_sach_doi_sim_hang_loat-${dayjs().format(
        'DDMMYYYYHHmmss'
      )}.xlsx`,
    });
  };
  return (
    <>
      <TitleHeader>Danh sách đổi SIM hàng loạt</TitleHeader>
      <RowHeader>
        <Form form={form} onFinish={handleFinish}>
          <Row gutter={[10, 10]} className="!mx-0">
            <CFilter
              items={items}
              searchComponent={
                <Tooltip
                  title="Nhập tên file, mô tả, số thuê bao"
                  placement="right"
                >
                  <Form.Item name="q" label={''}>
                    <CInput
                      placeholder={'Nhập tên file, mô tả, số thuê bao'}
                      maxLength={50}
                    />
                  </Form.Item>
                </Tooltip>
              }
              validQuery={REACT_QUERY_KEYS.GET_SIM_REPLACEMENT_LIST}
            />
            <BtnGroupFooter>
              {includes(actionByRole, ActionsTypeEnum.CREATE) && (
                <CButtonAdd
                  onClick={() => navigate(pathRoutes.simReplacementAdd)}
                >
                  Thêm mới yêu cầu
                </CButtonAdd>
              )}
              <CButtonExport onClick={handleExportExcel}>
                Xuất excel
              </CButtonExport>
            </BtnGroupFooter>
          </Row>
        </Form>
      </RowHeader>
    </>
  );
};
export default Header;
