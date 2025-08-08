import { memo } from 'react';
import { ChartColumn } from '../../components/ChartColumn';
import { ChartLine } from '../../components/ChartLine';
import { DashboardStats } from '../../components/DashboardStats';
import { IDataDashboardStats } from '../../type';

export const ListPage = memo(() => {
  const dataDashboardStats: IDataDashboardStats = {
    totalESIM: 1000000,
    totalSTB: 12909320,
    totalPackagesSold: 362136712,
    totalESIMsOrdered: 3173237,
  };
  return (
    <>
      <DashboardStats data={dataDashboardStats} />
      <ChartColumn />
      <ChartLine />
    </>
  );
});
