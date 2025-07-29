// import Info from "../components/Info";

import CDatePicker from '@react/commons/DatePicker';
import { Form } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import ColumnChart from '../components/Chart';
import { useGetDataChart } from '../queryHook/useGetDataChart';
import { IChartParam } from '../type';

const MonthFormatBE = 'YYYY-MM';
const MonthFormat = 'MM-YYYY';
const ProfilePage = () => {
  const [param, setParam] = useState<IChartParam>({
    date: dayjs().format(MonthFormatBE),
  });
  const { data } = useGetDataChart(param);
  const [form] = Form.useForm();
  const handleFinish = (values: Dayjs) => {
    setParam({ date: dayjs(values).format(MonthFormatBE) });
  };
  return (
    <div>
      <div className="text-center mt-8">
        <span className="text-[#00509f] text-3xl font-semibold drop-shadow-md">
          Hệ thống Kinh doanh và Dịch vụ khách hàng
        </span>
        <span className="text-3xl font-semibold drop-shadow-md">{' - '}</span>
        <span className="text-[#e50013] text-3xl font-semibold drop-shadow-md">
          BCSS
        </span>
      </div>
      <div className="mt-10">
        <Form form={form} className="flex justify-start ml-3">
          <Form.Item
            name="date"
            initialValue={dayjs()}
            label="Tháng"
            colon={false}
          >
            <CDatePicker
              picker="month"
              format={MonthFormat}
              className="!w-[160px]"
              onChange={handleFinish}
              allowClear={false}
              monthCellRenderVN
            />
          </Form.Item>
        </Form>
        <ColumnChart
          dataChart={data || []}
          month={dayjs(param.date, 'YYYY-MM').format(MonthFormat)}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
