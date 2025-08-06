import { useQuery } from '@tanstack/react-query';
import { IChartItem, IChartParam } from '../type';
import { safeApiClient } from 'apps/Internal/src/services';
import { prefixSaleService } from 'apps/Internal/src/constants';
import dayjs from 'dayjs';

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
export const donutDataMock = [
  { name: 'SUN', value: 70, color: '#3B82F6' },
  { name: 'SUN 1', value: 10, color: '#F59E0B' },
  { name: 'SUN 2', value: 20, color: '#EF4444' },
];

// Helper function to get mock data based on period
export const getMockData = (
  period: 'week' | 'month' | 'year' = 'week'
): IChartItem[] => {
  if (period === 'week') {
    // Generate dynamic week data based on current week
    const today = dayjs();
    const startOfWeek = today.startOf('week');
    const weekData = [];

    for (let i = 0; i < 7; i++) {
      const date = startOfWeek.add(i, 'day');
      const dateStr = date.format('DD/MM');
      weekData.push({
        x: dateStr,
        y: dataMock.week[i]?.y || Math.floor(Math.random() * 1000) + 100,
      });
    }

    return weekData;
  }

  return dataMock[period] || dataMock.week;
};

// Helper function to get donut chart data
export const getDonutData = () => {
  return donutDataMock;
};
