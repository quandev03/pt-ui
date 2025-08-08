import { useQuery } from '@tanstack/react-query';
import { IChartItem, IChartParam } from '../type';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { prefixSaleService } from 'apps/Partner/src/constants';
import { safeApiClient } from 'apps/Partner/src/services';

// Extend dayjs with weekOfYear plugin
dayjs.extend(weekOfYear);

// Helper function to format date based on period
const formatDateByPeriod = (
  date: dayjs.Dayjs,
  period: 'week' | 'month' | 'year' | 'day'
) => {
  switch (period) {
    case 'day':
      return date.format('DD/MM/YYYY');
    case 'month':
      return `${date.month() + 1}/${date.year()}`;
    case 'week':
      // Calculate week number within the month (1-5)
      const startOfMonth = date.startOf('month');
      const dayOfMonth = date.date();
      const weekOfMonth = Math.ceil(dayOfMonth / 7);
      const month = date.month() + 1;
      return `${weekOfMonth.toString().padStart(2, '0')}/T${month
        .toString()
        .padStart(2, '0')}`;
    case 'year':
      return date.year().toString();
    default:
      return date.format('DD/MM/YYYY');
  }
};

const fetcher = async (params: IChartParam) => {
  console.log('Fetching chart data with params:', params);
  console.log('API URL:', `${prefixSaleService}/dashboard/active-sub`);

  try {
    // Build query parameters
    const queryParams: any = {
      date: params.date,
    };

    if (params.period) {
      queryParams.period = params.period;
    }

    if (params.startDate) {
      queryParams.startDate = params.startDate;
    }

    if (params.endDate) {
      queryParams.endDate = params.endDate;
    }

    const response = await safeApiClient.get<IChartItem[]>(
      `${prefixSaleService}/dashboard/active-sub`,
      { params: queryParams }
    );
    console.log('Chart data response:', response);
    return response;
  } catch (error) {
    console.error('Error fetching chart data:', error);
    throw error;
  }
};

export const useGetDataChart = (params: IChartParam) => {
  return useQuery({
    queryKey: ['GET_DATA_CHART', params],
    queryFn: () => fetcher(params),
    retry: 1,
    retryDelay: 1000,
  });
};

// Mock data for different periods
export const dataMock = {
  week: [
    { x: '01/07', y: 520 },
    { x: '02/07', y: 630 },
    { x: '03/07', y: 490 },
    { x: '04/07', y: 700 },
    { x: '05/07', y: 380 },
    { x: '06/07', y: 920 },
    { x: '07/07', y: 140 },
  ],
  month: [
    { x: '01/07', y: 520 },
    { x: '02/07', y: 630 },
    { x: '03/07', y: 490 },
    { x: '04/07', y: 450 },
    { x: '05/07', y: 700 },
    { x: '06/07', y: 380 },
    { x: '07/07', y: 920 },
    { x: '08/07', y: 140 },
    { x: '09/07', y: 310 },
    { x: '10/07', y: 280 },
    { x: '11/07', y: 420 },
    { x: '12/07', y: 350 },
    { x: '13/07', y: 580 },
    { x: '14/07', y: 670 },
    { x: '15/07', y: 440 },
    { x: '16/07', y: 390 },
    { x: '17/07', y: 510 },
    { x: '18/07', y: 620 },
    { x: '19/07', y: 480 },
    { x: '20/07', y: 550 },
    { x: '21/07', y: 720 },
    { x: '22/07', y: 680 },
    { x: '23/07', y: 590 },
    { x: '24/07', y: 410 },
    { x: '25/07', y: 530 },
    { x: '26/07', y: 460 },
    { x: '27/07', y: 640 },
    { x: '28/07', y: 570 },
    { x: '29/07', y: 490 },
    { x: '30/07', y: 380 },
    { x: '31/07', y: 420 },
  ],
  year: [
    { x: 'T1', y: 15200 },
    { x: 'T2', y: 16800 },
    { x: 'T3', y: 14200 },
    { x: 'T4', y: 18900 },
    { x: 'T5', y: 20100 },
    { x: 'T6', y: 17800 },
    { x: 'T7', y: 16500 },
    { x: 'T8', y: 19200 },
    { x: 'T9', y: 17400 },
    { x: 'T10', y: 18600 },
    { x: 'T11', y: 20300 },
    { x: 'T12', y: 21800 },
  ],
};

// Mock data for donut chart (agent/dealer distribution)
export const donutDataMockLine = [
  { name: 'Đại lý 1', value: 60, color: '#3B82F6' },
  { name: 'Đại lý 2', value: 30, color: '#F59E0B' },
  { name: 'Đại lý 3', value: 10, color: '#EF4444' },
];
export const donutDataMockColumn = [
  { name: 'Đại lý 1', value: 20, color: '#3B82F6' },
  { name: 'Đại lý 2', value: 20, color: '#F59E0B' },
  { name: 'Đại lý 3', value: 60, color: '#EF4444' },
];
// Helper function to get mock data based on period
export const getMockData = (
  period: 'day' | 'week' | 'month' | 'year' = 'week'
): IChartItem[] => {
  const today = dayjs();

  if (period === 'day') {
    // Generate day data for exactly 24 days
    const dayData = [];
    const startDate = today.subtract(23, 'day');

    for (let i = 0; i < 24; i++) {
      const date = startDate.add(i, 'day');
      const dateStr = formatDateByPeriod(date, 'day');
      dayData.push({
        x: dateStr,
        y: dataMock.month[i]?.y || Math.floor(Math.random() * 1000) + 100,
      });
    }

    return dayData;
  }

  if (period === 'week') {
    // Generate week data for exactly 24 weeks
    const weekData = [];
    const startDate = today.subtract(23, 'week');

    for (let i = 0; i < 24; i++) {
      const date = startDate.add(i, 'week');
      const dateStr = formatDateByPeriod(date, 'week');
      weekData.push({
        x: dateStr,
        y: dataMock.week[i]?.y || Math.floor(Math.random() * 1000) + 100,
      });
    }

    return weekData;
  }

  if (period === 'month') {
    // Generate month data for exactly 24 months (1/2025, 2/2025, etc.)
    const monthData = [];
    const startMonth = today.subtract(23, 'month').startOf('month');

    for (let i = 0; i < 24; i++) {
      const date = startMonth.add(i, 'month');
      const dateStr = formatDateByPeriod(date, 'month');
      monthData.push({
        x: dateStr,
        y: dataMock.year[i]?.y || Math.floor(Math.random() * 20000) + 10000,
      });
    }

    return monthData;
  }

  if (period === 'year') {
    // Generate year data for exactly 24 years
    const yearData = [];
    const currentYear = today.year();

    for (let i = 0; i < 24; i++) {
      const year = currentYear - 23 + i;
      const dateStr = formatDateByPeriod(dayjs().year(year), 'year');
      yearData.push({
        x: dateStr,
        y: dataMock.year[i]?.y || Math.floor(Math.random() * 20000) + 10000,
      });
    }

    return yearData;
  }

  return dataMock[period] || dataMock.week;
};

// Helper function to get donut chart data
export const getDonutData = () => {
  return {
    line: donutDataMockLine,
    column: donutDataMockColumn,
  };
};
