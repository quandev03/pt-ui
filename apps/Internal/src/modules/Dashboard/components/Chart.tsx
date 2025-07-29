import Chart from 'react-apexcharts';
import { IChartItem } from '../type';
type ColumnChartProps = {
  dataChart: IChartItem[];
  month: string;
};
const ColumnChart = ({ dataChart, month }: ColumnChartProps) => {
  return (
    <Chart
      options={{
        chart: {
          height: 600,
          type: 'bar',
          fontFamily: 'Inter, sans-serif',
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            borderRadiusApplication: 'end',
            borderRadius: 5,
            dataLabels: {
              position: 'top',
            },
          },
        },
        dataLabels: {
          enabled: true,
          offsetY: -20,
          style: {
            fontSize: '12px',
            colors: ['#304758'],
          },
        },

        xaxis: {
          categories: dataChart.map((item) => item.x),
          position: 'bottom',
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          tooltip: {
            enabled: true,
          },
          title: {
            text: 'Ngày',
            style: {
              fontSize: '16px',
              fontWeight: 600,
            },
          },
        },
        yaxis: {
          title: {
            text: 'Số lượng thuê bao',
            style: {
              fontSize: '16px',
              fontWeight: 600,
            },
          },
        },
        title: {
          text: `Thuê bao phát triển mới tháng ${month}`,
          style: {
            fontSize: '22px',
            fontWeight: 600,
          },
        },
      }}
      series={[
        {
          name: 'Số thuê bao',
          data: dataChart.map((item) => item.y),
        },
      ]}
      type="bar"
      height={600}
    />
  );
};

export default ColumnChart;
