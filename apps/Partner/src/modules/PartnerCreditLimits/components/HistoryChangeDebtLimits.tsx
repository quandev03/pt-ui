import {
  faMagnifyingGlass,
  faRotateLeft,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton from '@react/commons/Button';
import CRangPickerInMonth from '@react/commons/CRangPickerInMonth';
import CTable from '@react/commons/Table';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { geColumnsTableListDebtHistory } from '../constants';
import { useGetListPartnerLimitsDebtHistory, useSupportGetPartnerLimitsId } from '../hooks';
import { IAttachment, IPartnerLimitsHistoryParams } from '../type';
import { useGetFileDownloadSaleService } from 'apps/Partner/src/components/layouts/queryHooks';
import { isEqual } from 'lodash';
import { useQueryClient } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';
import { formatDate, formatDateEnglishV2 } from '@react/constants/moment';
import { CRangePicker } from '@react/commons/DatePicker';

type Props = {
  isSearchMode?: boolean;
  title?: string;
  onReload?: () => void;
};

const HistoryChangeDebtLimits = ({
  isSearchMode,
  title = 'Lịch sử công nợ',
  onReload,
}: Props) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [params, setParams] = useState<IPartnerLimitsHistoryParams>({
    page: 0,
    size: 20,
    startDate: dayjs()
      .subtract(29, 'day')
      .startOf('day')
      .format(formatDateEnglishV2),
    endDate: dayjs().endOf('day').format(formatDateEnglishV2),
  });
  const { data: listPartnerDebtLimitsHistory, isLoading: loadingTable } =
    useGetListPartnerLimitsDebtHistory(params);
  const { mutate: getPartnerLimitsId, isPending: loadingPartnerLimitsId } =
    useSupportGetPartnerLimitsId((data) => {
      form.setFieldsValue({
        ...data,
        remainingLimit: data.limitAmount - data.debtTotalAmount,
      });
    });
  const dataTable = useMemo(() => {
    if (listPartnerDebtLimitsHistory) {
      return listPartnerDebtLimitsHistory.content;
    }
    return [];
  }, [listPartnerDebtLimitsHistory]);
  const { mutate: getFileDownloadSaleService } =
    useGetFileDownloadSaleService();

  const handleDownload = (data: IAttachment) => {
    getFileDownloadSaleService({
      id: data.id,
      fileName: data.fileName,
    });
  };
  const columns = useMemo(() => {
    return geColumnsTableListDebtHistory(params, handleDownload);
  }, [params]);

  const handleRefresh = () => {
    form.resetFields();
    onReload && onReload();
    const currentParams = params;
    const isSame = isEqual(currentParams, {
      page: 0,
      size: 20,
      startDate: dayjs()
        .subtract(29, 'day')
        .startOf('day')
        .format(formatDateEnglishV2),
      endDate: dayjs().endOf('day').format(formatDateEnglishV2),
    });
    if (isSame) {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_PARTNER_LIMITS_DEBT_HISTORY],
      });
      form.setFieldValue('time', [
        dayjs(currentParams['startDate']).startOf('day'),
        dayjs(currentParams['endDate']).endOf('day'),
      ]);
    } else {
      setParams({
        page: 0,
        size: 20,
        startDate: dayjs()
          .subtract(29, 'day')
          .startOf('day')
          .format(formatDateEnglishV2),
        endDate: dayjs().endOf('day').format(formatDateEnglishV2),
      });
      form.setFieldValue('time', [
        dayjs().subtract(29, 'day').startOf('day'),
        dayjs().endOf('day'),
      ]);
    }
  };

  const handleSearch = (values: Record<string, string>) => {
    const startDate = values.time[0];
    const toDate = values.time[1];
    const newParams = {
      ...params,
      startDate: dayjs(startDate).startOf('day').format(formatDateEnglishV2),
      endDate: dayjs(toDate).endOf('day').format(formatDateEnglishV2),
    };

    const isSame = isEqual(params, newParams);

    if (isSame) {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_PARTNER_LIMITS_DEBT_HISTORY],
      });
      getPartnerLimitsId();
    } else {
      setParams({
        ...params,
        startDate: dayjs(startDate).startOf('day').format(formatDateEnglishV2),
        endDate: dayjs(toDate).endOf('day').format(formatDateEnglishV2),
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex  justify-between">
        <div className="text-[#005AAA] font-bold text-xl">{title}</div>
      </div>
      <div className="flex flex-col gap-4">
        {isSearchMode ? (
          <div className="w-2/2">
            <Form
              form={form}
              onFinish={handleSearch}
              validateTrigger={['onSubmit', 'onBlur']}
              wrapperCol={{ span: 6 }}
              initialValues={{
                time: [
                  dayjs().subtract(29, 'day').startOf('day'),
                  dayjs().endOf('day'),
                ],
              }}
            >
              <div className="flex items-start justify-start gap-4">
                <Form.Item name="time" noStyle>
                  <CRangePicker
                    className="!w-[400px]"
                    allowClear={false}
                    defaultValue={[dayjs().subtract(30, 'day'), dayjs()]}
                    format={formatDate}
                  />
                </Form.Item>
                <CButton
                  icon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
                  onClick={() => form.submit()}
                >
                  Tìm kiếm
                </CButton>
                <FontAwesomeIcon
                  icon={faRotateLeft}
                  size="lg"
                  className="cursor-pointer self-center"
                  onClick={handleRefresh}
                  title="Làm mới"
                />
              </div>
            </Form>
          </div>
        ) : null}
        <CTable
          columns={columns}
          dataSource={dataTable}
          scroll={{ y: 450 }}
          loading={loadingTable}
          pagination={{
            total: listPartnerDebtLimitsHistory?.totalElements,
            pageSize: params.size,
            current: params.page + 1,
            pageSizeOptions: [20, 50, 100],
            defaultPageSize: 20,
            onChange(page, pageSize) {
              setParams({
                ...params,
                page: page - 1,
                size: pageSize,
              });
            },
          }}
        />
      </div>
    </div>
  );
};

export default HistoryChangeDebtLimits;
