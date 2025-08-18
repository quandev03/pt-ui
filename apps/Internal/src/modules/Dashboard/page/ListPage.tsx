import { TitleHeader } from '@vissoft-react/common';
import { DashboardStats } from '../components/DashboardStats';
import { IDataDashboardStats } from '../type';
import { ChartLine } from '../components/ChartLine';
import { ChartColumn } from '../components/ChartColumn';

export const ListPage = () => {
  const dataDashboardStats: IDataDashboardStats = {
    totalESIM: 1273822,
    totalSTB: 3289322,
    totalPackagesSold: 1237821,
    totalESIMsOrdered: 2398121,
  };
  return (
    <>
      <DashboardStats data={dataDashboardStats} />
      <ChartColumn />
      <ChartLine />
    </>
  );
};
