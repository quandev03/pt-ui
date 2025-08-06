import { TitleHeader } from '@vissoft-react/common';
import { DashboardStats } from '../components/DashboardStats';
import { IDataDashboardStats } from '../type';
import { ChartColumn } from '../components/ChartColumn';
import { ChartLine } from '../components/ChartLine';

export const ListPage = () => {
  const dataDashboardStats: IDataDashboardStats = {
    totalESIM: 1,
    totalSTB: 2,
    totalPackagesSold: 3,
    totalESIMsOrdered: 4,
  };
  return (
    <>
      <TitleHeader>Tổng quan</TitleHeader>
      <DashboardStats data={dataDashboardStats} />
      <ChartColumn />
      <ChartLine />
    </>
  );
};
