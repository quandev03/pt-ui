import { TitleHeader } from '@vissoft-react/common';
import { DashboardStats } from '../components/DashboardStats';
import { IDataDashboardStats } from '../type';
import { ChartLine } from '../components/ChartLine';
import { ChartColumn } from '../components/ChartColumn';

export const ListPage = () => {
  const dataDashboardStats: IDataDashboardStats = {
    totalESIM: 1000000,
    totalSTB: 3200000,
    totalPackagesSold: 2030000,
    totalESIMsOrdered: 1203000,
  };
  return (
    <>
      <DashboardStats data={dataDashboardStats} />
      <ChartColumn />
      <ChartLine />
    </>
  );
};
