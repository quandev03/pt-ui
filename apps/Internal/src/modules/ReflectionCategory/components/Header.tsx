import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CButtonAdd } from '@react/commons/Button';
import CFilter, { ItemFilter } from '@react/commons/Filter';
import { CInput, CRangePicker, CSelect } from '@react/commons/index';
import { TitleHeader } from '@react/commons/Template/style';
import { ActionsTypeEnum } from '@react/constants/app';
import { formatDate } from '@react/constants/moment';
import { decodeSearchParams } from '@react/helpers/utils';
import useSearchHandler from '@react/hooks/useSearchHandler';
import { Form, Tooltip } from 'antd';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import dayjs from 'dayjs';
import { includes } from 'lodash';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { REFLECTION_CATEGORY_QUERY_KEY } from '../hooks';

type Props = {
  provinces: any[];
};

const Header: React.FC<Props> = ({ provinces }) => {
  const navigate = useNavigate();
  const actionByRole = useRolesByRouter();
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { page, size, ...rest } = params;
  const { handleSearch: handleSearchList } = useSearchHandler(
    REFLECTION_CATEGORY_QUERY_KEY.LIST
  );

  const optionStatus = [
    { label: 'Không hoạt động', value: 0 },
    { label: 'Hoạt động', value: 1 },
  ];

  const validateDateRange = (_: any, value: string | any[]) => {
    if (!value || value.length < 2) {
      return Promise.resolve();
    }
    const [fromDate, toDate] = value;
    const diff = dayjs(toDate).diff(dayjs(fromDate), 'day');
    if (diff > 29) {
      return Promise.reject(
        new Error('Thời gian tìm kiếm không được vượt quá 30 ngày')
      );
    }
    return Promise.resolve();
  };

  const handleSearch = (values: any) => {
    handleSearchList({
      ...rest,
      ...values,
      status:
        values.status !== undefined
          ? values.status === 1
            ? '1'
            : '0'
          : undefined,
      fromDate:
        values.time && values.time[0]
          ? dayjs(values.time[0]).format(formatDate)
          : undefined,
      toDate:
        values.time && values.time[1]
          ? dayjs(values.time[1]).format(formatDate)
          : undefined,
      time: undefined,
      queryTime: undefined,
    });
  };

  const handleAdd = () => {
    navigate(pathRoutes.reflectionCategoryAdd);
  };

  const items: ItemFilter[] = [
    {
      label: 'Ngày tạo',
      value: (
        <Form.Item
          name="time"
          className={'!w-72'}
          rules={[{ validator: validateDateRange }]}
        >
          <CRangePicker format={formatDate} />
        </Form.Item>
      ),
    },
    {
      label: 'Trạng thái',
      showDefault: true,
      value: (
        <Form.Item name="status" className={'!w-40'}>
          <CSelect
            options={optionStatus}
            filterOption={(input: any, option: any) =>
              (option?.label?.toLowerCase() ?? '').includes(
                input?.toLowerCase()
              )
            }
            filterSort={(optionA: any, optionB: any) =>
              (optionA?.label ?? '')
                .toLowerCase()
                .localeCompare((optionB?.label ?? '').toLowerCase())
            }
            placeholder="Tất cả"
            defaultValue={undefined}
          />
        </Form.Item>
      ),
    },
  ];
  useEffect(() => {
    const { fromDate, toDate, ...res } = params;
    form.setFieldsValue({ ...res });
    if (fromDate && toDate) {
      form.setFieldsValue({
        time: [dayjs(fromDate, formatDate), dayjs(toDate, formatDate)],
      });
    }
  }, []);

  return (
    <>
      <TitleHeader>Danh mục loại phản ánh</TitleHeader>
      <div className={'flex justify-between flex-wrap mb-4 gap-4'}>
        <Form
          form={form}
          onFinish={handleSearch}
          className={'flex-1'}
          initialValues={{
            time: [dayjs().subtract(29, 'days').startOf('day'), dayjs()],
          }}
        >
          <CFilter
            items={items}
            searchComponent={
              <Tooltip
                title="Nhập tên loại phản ánh hoặc Nhập người tạo hoặc Người cập nhật"
                placement="right"
              >
                <Form.Item name="param" label="">
                  <CInput
                    maxLength={100}
                    placeholder="Nhập tên loại phản ánh hoặc Nhập người tạo hoặc Người cập nhật"
                    prefix={<FontAwesomeIcon icon={faSearch} />}
                  />
                </Form.Item>
              </Tooltip>
            }
          />
        </Form>
        {includes(actionByRole, ActionsTypeEnum.CREATE) && (
          <CButtonAdd onClick={handleAdd} />
        )}
      </div>
    </>
  );
};

export default Header;
