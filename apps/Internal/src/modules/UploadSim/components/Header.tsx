import { CButtonAdd } from '@react/commons/Button';
import { ItemFilter } from '@react/commons/Filter';
import {
  BtnGroupFooter,
  RowHeader,
  TitleHeader,
} from '@react/commons/Template/style';
import {Form, Row} from 'antd';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CFilter from '@react/commons/Filter';
import { decodeSearchParams } from '@react/helpers/utils';
import dayjs from 'dayjs';
import { formatDate, formatDateEnglishV2 } from '@react/constants/moment';
import { CRangePicker } from '@react/commons/DatePicker';
import { useIntl } from 'react-intl';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const form = Form.useFormInstance();
  const intl = useIntl();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);

  useEffect(() => {
    form.submit();
  }, [params.type]);

  useEffect(() => {
    if (params) {
      const { startDate, endDate, ...rest } = params;
      const from = startDate
        ? dayjs(startDate, formatDateEnglishV2)
        : dayjs().subtract(29, 'day');
      const to = endDate ? dayjs(endDate, formatDateEnglishV2) : dayjs();
      form.setFieldsValue({
        ...rest,
        rangePicker: [from, to],
      });
    }
  }, [params]);

  const items: ItemFilter[] = [
    {
      label: 'Thời gian',
      value: (
        <Form.Item
          name={'rangePicker'}
        >
          <CRangePicker
            placeholder={['Từ ngày', 'Đến ngày']}
            format={formatDate}
            allowClear={false}
          />
        </Form.Item>
      ),
      showDefault: true,
    },
  ];

  const handleAdd = () => {
    navigate(pathRoutes.simUploadAdd);
  };

  return (
    <>
      <TitleHeader>Danh sách upload tài nguyên SIM</TitleHeader>
      <RowHeader>
        <Row gutter={[8, 16]}>
          <CFilter items={items} />
        </Row>
        <BtnGroupFooter className="items-end">
          <CButtonAdd onClick={handleAdd}>
            {intl.formatMessage({ id: 'Tạo yêu cầu' })}
          </CButtonAdd>
        </BtnGroupFooter>
      </RowHeader>
    </>
  );
};

export default Header;
