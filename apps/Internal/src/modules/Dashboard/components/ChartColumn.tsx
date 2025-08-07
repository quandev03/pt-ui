import { Button, Card, DatePicker, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { getMockData, getDonutData } from '../queryHook/useGetDataChart';
import { IChartParam, IChartPeriod } from '../type';
import { RotateCcw } from 'lucide-react';

const { RangePicker } = DatePicker;

const chartPeriods: IChartPeriod[] = [
  { label: 'Tuần', value: 'week' },
  { label: 'Tháng', value: 'month' },
  { label: 'Năm', value: 'year' },
];

export const ChartColumn = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<
    'week' | 'month' | 'year'
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
  const donutData = getDonutData();

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
      categories: data.map((item: any) => item.x),
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
        },
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
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
        },
      },
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px',
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
        fontSize: '12px',
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
      height: 350,
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
    legend: {
      position: 'bottom' as const,
      fontSize: '14px',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 400,
      labels: {
        colors: '#1F2937',
      },
      markers: {
        size: 8,
        strokeWidth: 0,
        fillColors: donutData.map((item: any) => item.color),
        radius: 4,
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
      formatter: (seriesName: string, opts: any) => {
        const item = donutData.find((d: any) => d.name === seriesName);
        return item ? `${seriesName} ${item.value}%` : seriesName;
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value}%`,
      },
    },
  };

  const donutSeries = donutData.map((item: any) => item.value);

  const handlePeriodChange = (value: 'week' | 'month' | 'year') => {
    setSelectedPeriod(value);
    let startDate: Dayjs;
    let endDate: Dayjs;

    switch (value) {
      case 'week':
        startDate = dayjs().startOf('week');
        endDate = dayjs().endOf('week');
        break;
      case 'month':
        startDate = dayjs().startOf('month');
        endDate = dayjs().endOf('month');
        break;
      case 'year':
        startDate = dayjs().startOf('year');
        endDate = dayjs().endOf('year');
        break;
      default:
        startDate = dayjs().startOf('week');
        endDate = dayjs().endOf('week');
    }

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
      <div className="flex flex-col space-y-6">
        {/* Header with controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row justify-center items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Chu kỳ:</span>
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

        {/* Charts */}
        <div className="w-full">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-center text-gray-800">
              Số lượng eSIM đã bán
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bar Chart */}
            <div className="lg:col-span-2">
              <ReactApexChart
                options={chartOptions}
                series={chartSeries}
                type="bar"
                height={350}
              />
            </div>

            {/* Donut Chart */}
            <div className="lg:col-span-1">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-center text-gray-800">
                  Đại lý
                </h3>
              </div>
              <ReactApexChart
                options={donutOptions}
                series={donutSeries}
                type="donut"
                height={350}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
