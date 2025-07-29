import {
  faMagnifyingGlass,
  faRotateLeft,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton from '@react/commons/Button';
import { CRangePicker } from '@react/commons/DatePicker';
import CTable from '@react/commons/Table';
import { formatDateEnglishV2 } from '@react/constants/moment';
import { Form } from 'antd';
import { useGetFileDownloadSaleService } from 'apps/Internal/src/components/layouts/queryHooks';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { geColumnsTableListHistory } from '../constants';
import { useGetListPartnerLimitsHistory } from '../hooks';
import { IAttachment, IPartnerLimitsHistoryParams } from '../type';

type Props = {
  isSearchMode?: boolean;
  title?: string;
};

const HistoryChangeLimits = ({
  isSearchMode,
  title = 'Lịch sử thay đổi hạn mức',
}: Props) => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [params, setParams] = useState<IPartnerLimitsHistoryParams>({
    page: 0,
    size: 20,
    id: id,
  });
  const { data: listPartnerLimitsHistory } =
    useGetListPartnerLimitsHistory(params);

  const dataTable = useMemo(() => {
    if (listPartnerLimitsHistory) {
      return listPartnerLimitsHistory.content;
    }
    return [];
  }, [listPartnerLimitsHistory]);

  const { mutate: getFileDownloadSaleService } =
    useGetFileDownloadSaleService();

  const handleDownload = (data: IAttachment) => {
    getFileDownloadSaleService({
      id: data.id,
      fileName: data.fileName,
    });
  };

  const columns = useMemo(() => {
    return geColumnsTableListHistory(params, handleDownload);
  }, [params]);

  const handleRefresh = () => {
    form.resetFields();
    setParams({
      page: 0,
      size: 20,
      id: id,
    });
  };

  const handleSearch = (values: any) => {
    const startDate = values.time[0];
    const toDate = values.time[1];
    setParams({
      ...params,
      'end-date': dayjs(toDate).format(formatDateEnglishV2),
      'start-date': dayjs(startDate).format(formatDateEnglishV2),
    });
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
            >
              <div className="flex items-start justify-start gap-4">
                <Form.Item name="time" noStyle>
                  <CRangePicker className="!w-[400px]" />
                </Form.Item>
                <CButton
                  icon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
                  htmlType="submit"
                  onClick={() => {
                    console.log('click');
                    form.submit();
                  }}
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
          pagination={{
            total: listPartnerLimitsHistory?.totalElements,
          }}
        />
      </div>
    </div>
  );
};

export default HistoryChangeLimits;
