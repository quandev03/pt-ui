import {
  faMagnifyingGlass,
  faRotateLeft,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton, { CButtonExport } from '@react/commons/Button';
import { CRangePicker } from '@react/commons/DatePicker';
import CTable from '@react/commons/Table';
import { formatDate, formatDateBe } from '@react/constants/moment';
import { useQueryClient } from '@tanstack/react-query';
import { Form } from 'antd';
import { useGetFileDownloadSaleService } from 'apps/Internal/src/components/layouts/queryHooks';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import dayjs from 'dayjs';
import { isEqual } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { geColumnsTableListDebtHistory } from '../constants';
import { useGetListPartnerLimitsDebtHistory } from '../hooks';
import { IAttachment, IPartnerLimitsHistoryParams } from '../type';
import { useExport } from '../hooks/useExport';

type Props = {
  isSearchMode?: boolean;
  title?: string;
  onReload?: () => void;
  orgId?: string;
};

const HistoryChangeDebtLimits = ({
  isSearchMode,
  title = 'Lịch sử công nợ',
  onReload,
  orgId,
}: Props) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const { id } = useParams();
  const [params, setParams] = useState<IPartnerLimitsHistoryParams>({
    page: 0,
    size: 20,
    id: id,
    'start-date': dayjs()
      .subtract(29, 'day')
      .startOf('day')
      .format(formatDateBe),
    'end-date': dayjs().endOf('day').format(formatDateBe),
  });
  const { data: listPartnerDebtLimitsHistory, isLoading: loadingTable } =
    useGetListPartnerLimitsDebtHistory(params);
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
      id: id,
      'start-date': dayjs()
        .subtract(29, 'day')
        .startOf('day')
        .format(formatDateBe),
      'end-date': dayjs().endOf('day').format(formatDateBe),
    });

    if (isSame) {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GetListPartnerLimitsHistory],
      });
      form.setFieldValue('time', [
        dayjs(currentParams['start-date']).startOf('day'),
        dayjs(currentParams['end-date']).endOf('day'),
      ]);
    } else {
      setParams({
        page: 0,
        size: 20,
        id: id,
        'start-date': dayjs()
          .subtract(29, 'day')
          .startOf('day')
          .format(formatDateBe),
        'end-date': dayjs().endOf('day').format(formatDateBe),
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
      'start-date': dayjs(startDate).startOf('day').format(formatDateBe),
      'end-date': dayjs(toDate).endOf('day').format(formatDateBe),
    };

    const isSame = isEqual(params, newParams);

    if (isSame) {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GetListPartnerLimitsHistory],
      });
    } else {
      setParams({
        ...params,
        'start-date': dayjs(startDate).startOf('day').format(formatDateBe),
        'end-date': dayjs(toDate).endOf('day').format(formatDateBe),
      });
    }
  };
  const { mutate: mutateExport, isPending: isLoadingExport } = useExport();
  const handleExport = useCallback(() => {
    const start = params['start-date'];
    const end = params['end-date'];
    const startDate = start
      ? dayjs(start).startOf('day').format(formatDateBe)
      : dayjs().subtract(29, 'day').startOf('day').format(formatDateBe);
    const endDate = end
      ? dayjs(end).endOf('day').format(formatDateBe)
      : dayjs().endOf('day').format(formatDateBe);

    mutateExport({
      id: orgId ?? '',
      startDate,
      endDate,
    });
  }, [mutateExport, form, orgId, params]);

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
              className="flex items-start justify-between gap-4"
              initialValues={
                {
                  time: [dayjs().subtract(29, 'day'), dayjs()],
                }
              }
            >
              <div className="flex items-start justify-start gap-4">
                <Form.Item name="time" noStyle>
                  <CRangePicker
                    className="!w-[400px]"
                    allowClear={false}
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
              <CButtonExport
                onClick={handleExport}
                loading={isLoadingExport}
              />
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
