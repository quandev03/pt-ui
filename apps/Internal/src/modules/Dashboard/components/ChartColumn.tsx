import { Button, Card, DatePicker, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { getMockData, getDonutData } from '../queryHook/useGetDataChart';
import { IChartParam, IChartPeriod } from '../type';
import { RotateCcw } from 'lucide-react';

// Extend dayjs with weekOfYear plugin
dayjs.extend(weekOfYear);

const { RangePicker } = DatePicker;

const chartPeriods: IChartPeriod[] = [
  { label: 'Ngày', value: 'day' },
  { label: 'Tuần', value: 'week' },
  { label: 'Tháng', value: 'month' },
  { label: 'Năm', value: 'year' },
];

// Helper function to format date based on period

// Helper function to get date range based on period
const getDateRangeByPeriod = (period: 'week' | 'month' | 'year' | 'day') => {
  const now = dayjs();

  switch (period) {
    case 'day':
      // 24 days from today
      return [now.subtract(23, 'day'), now];
    case 'week':
      // 24 weeks from today
      return [now.subtract(23, 'week'), now];
    case 'month':
      // 24 months from current month
      const startMonth = now.subtract(23, 'month').startOf('month');
      const endMonth = now.endOf('month');
      return [startMonth, endMonth];
    case 'year':
      // 24 years from current year
      return [now.subtract(23, 'year').startOf('year'), now.endOf('year')];
    default:
      return [now.startOf('week'), now.endOf('week')];
  }
};

export const ChartColumn = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<
    'day' | 'week' | 'month' | 'year'
  >('week');
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf('week'),
    dayjs().endOf('week'),
  ]);

  const chartParams: IChartParam = {
    date: dayjs().format('YYYY-MM-DD'),
    period: selectedPeriod,
    startDate: dateRange[0]?.format('YYYY-MM-DD'),
    endDate: dateRange[1]?.format('YYYY-MM-DD'),
  };

  // Use actual API data if available, otherwise use mock data
  const data = getMockData(selectedPeriod);
  const donutData = getDonutData().column;

  const chartOptions = {
    chart: {
      type: 'bar' as const,
      height: 350,
      toolbar: {
        show: false,
      },
      background: 'transparent',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
        colors: {
          ranges: [
            {
              from: 0,
              to: 1000,
              color: '#3B82F6',
            },
          ],
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      type: 'category' as const,
      categories: data.map((item: any) => item.x),
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '13px',
          fontFamily: 'Inter, sans-serif',
        },
        rotate: -45,
        rotateAlways: false,
        maxHeight: 60,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          color: '#6B7280',
          fontSize: '13px',
          fontFamily: 'Inter, sans-serif',
        },
      },
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '13px',
          fontFamily: 'Inter, sans-serif',
        },
        formatter: (value: number) => value.toLocaleString(),
      },
    },
    fill: {
      opacity: 1,
      colors: ['#3B82F6'],
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value.toLocaleString()} eSIM`,
      },
      style: {
        fontSize: '13px',
        fontFamily: 'Inter, sans-serif',
      },
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 4,
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '70%',
            },
          },
        },
      },
    ],
  };

  const chartSeries = [
    {
      name: 'Số lượng eSIM đã bán',
      data: data.map((item: any) => item.y),
    },
  ];

  // Donut chart options
  const donutOptions = {
    chart: {
      type: 'donut' as const,
      height: 400,
      toolbar: {
        show: false,
      },
      background: 'transparent',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              color: '#6B7280',
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: '16px',
              fontFamily: 'Inter, sans-serif',
              color: '#1F2937',
              fontWeight: 600,
              offsetY: 16,
              formatter: (val: string) => `${val}%`,
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 3,
      colors: ['#FFFFFF'],
    },
    colors: donutData.map((item: any) => item.color),
    labels: donutData.map((item: any) => item.name),
    legend: {
      position: 'right' as const,
      fontSize: '14px',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 400,
      labels: {
        colors: '#1F2937',
        formatter: (seriesName: string, opts: any) => {
          const item = donutData[opts.seriesIndex];
          return item ? `${item.name} ${item.value}%` : seriesName;
        },
      },

      markers: {
        size: 8,
        strokeWidth: 0,
        fillColors: donutData.map((item: any) => item.color),
        radius: 4,
        offsetX: -10,
        offsetY: 2,
      },
      itemMargin: {
        horizontal: 20,
        vertical: 8,
      },
      onItemClick: {
        toggleDataSeries: false,
      },
      onItemHover: {
        highlightDataSeries: false,
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value}%`,
      },
    },
  };

  const donutSeries = donutData.map((item: any) => item.value);

  const handlePeriodChange = (value: 'day' | 'week' | 'month' | 'year') => {
    setSelectedPeriod(value);
    const [startDate, endDate] = getDateRangeByPeriod(value);
    setDateRange([startDate, endDate]);
  };

  const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange([dates[0], dates[1]]);
    }
  };

  const handleRefresh = () => {
    // refetch();
  };

  useEffect(() => {
    handlePeriodChange(selectedPeriod);
  }, []);

  return (
    <Card className="mt-6 px-6 rounded-[10px] shadow-[10.7px_14.94px_37.35px_0px_#6c7e9314]">
      <div className="flex flex-col space-y-1">
        {/* Header with controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row justify-center items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-center text-gray-800">
                Số lượng eSIM đã bán
              </span>
              <div className="ml-10 flex gap-4 items-center">
                <span className="text-sm font-medium text-gray-600">
                  Chu kỳ:
                </span>
                <Select
                  value={selectedPeriod}
                  onChange={handlePeriodChange}
                  style={{ width: 120 }}
                  options={chartPeriods.map((period) => ({
                    label: period.label,
                    value: period.value,
                  }))}
                />
              </div>
              <div className="flex items-center gap-2">
                <RangePicker
                  value={dateRange}
                  onChange={handleDateRangeChange}
                  format="DD/MM/YYYY"
                  style={{ width: 240 }}
                  placeholder={['Từ ngày', 'Đến ngày']}
                />
              </div>

              <Button
                icon={<RotateCcw size={20} />}
                onClick={handleRefresh}
                // loading={isLoading}
                type="text"
                className="flex items-center justify-center mt-1.5"
              />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="w-full mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Line Chart */}
            <div className="lg:col-span-2 min-h-[400px] overflow-hidden">
              <ReactApexChart
                options={chartOptions}
                series={chartSeries}
                type="bar"
                height={400}
              />
            </div>

            {/* Donut Chart */}
            <div className="lg:col-span-1 flex justify-center mb-6 items-end">
              <div className="text-center">
                <div className="mb-4">
                  <span className="text-lg mr-36 font-semibold text-gray-800">
                    Đại lý
                  </span>
                </div>
                <div>
                  <ReactApexChart
                    options={donutOptions}
                    series={donutSeries}
                    type="donut"
                    height={300}
                    width={380}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
