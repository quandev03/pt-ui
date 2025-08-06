export interface IChartParam {
  date: string;
  period?: 'week' | 'month' | 'year';
  startDate?: string;
  endDate?: string;
}

export interface IChartItem {
  x: string;
  y: number;
}

export interface IDataDashboardStats {
  totalESIM: number;
  totalSTB: number;
  totalPackagesSold: number;
  totalESIMsOrdered: number;
}

export interface IChartPeriod {
  label: string;
  value: 'week' | 'month' | 'year';
}
