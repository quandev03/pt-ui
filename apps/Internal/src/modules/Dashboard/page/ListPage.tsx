import { TitleHeader } from '@vissoft-react/common';
import { DashboardStats } from '../components/DashboardStats';
import { IDataDashboardStats } from '../type';
import { ChartLine } from '../components/ChartLine';
import { ChartColumn } from '../components/ChartColumn';

export const ListPage = () => {
  const dataDashboardStats: IDataDashboardStats = {
    totalESIM: 1000000,
    totalSTB: 12909320,
    totalPackagesSold: 362136712,
    totalESIMsOrdered: 3173237,
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
