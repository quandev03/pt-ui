import { memo } from 'react';
import { ChartColumn } from '../../components/ChartColumn';
import { ChartLine } from '../../components/ChartLine';
import { DashboardStats } from '../../components/DashboardStats';
import { IDataDashboardStats } from '../../type';

export const ListPage = memo(() => {
  const dataDashboardStats: IDataDashboardStats = {
    totalESIM: 3123331,
    totalSTB: 2231263,
    totalPackagesSold: 32137622,
    totalESIMsOrdered: 1232321,
  };
  return (
    <>
      <DashboardStats data={dataDashboardStats} />
      <ChartColumn />
      <ChartLine />
    </>
  );
});
