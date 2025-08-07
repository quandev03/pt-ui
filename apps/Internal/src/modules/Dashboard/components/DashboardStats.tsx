import { Card, Col, Row } from 'antd';
import styled from 'styled-components';
import {
  svgTotalESIM,
  svgTotalESIMsOrdered,
  svgTotalPackagesSold,
  svgTotalSTB,
} from '../utils';
import { IDataDashboardStats } from '../type';

const CardStyle = styled(Card)`
  width: 100%;
  background: #ffffff;
  box-shadow: 10.7px 14.94px 37.35px 0px #6c7e9314;
  border-radius: 8.96484px;

  .ant-card-body {
    padding: 10px;
    height: 100%;
    display: flex;
    align-items: center;
    min-height: 120px;
  }
`;

export const DashboardStats = ({ data }: { data: IDataDashboardStats }) => {
  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US');
  };
  const dataTest = [
    { label: 'Tổng eSIM đã bán', value: data.totalESIM, icon: svgTotalESIM() },
    { label: 'Tổng STB đã gọi 900', value: data.totalSTB, icon: svgTotalSTB() },
    {
      label: 'Tổng gói cước đã bán',
      value: data.totalPackagesSold,
      icon: svgTotalPackagesSold(),
    },
    {
      label: 'Tổng gói cước đã bán',
      value: data.totalESIMsOrdered,
      icon: svgTotalESIMsOrdered(),
    },
  ];

  return (
    <Row gutter={16}>
      {dataTest.map((item, idx) => (
        <Col span={6} key={idx}>
          <CardStyle>
            <div className="flex flex-col justify-between h-full items-center">
              <div className="flex items-center gap-4 px-6">
                {item.icon}
                <div>
                  <div className="font-medium text-lg">{item.label}</div>
                </div>
              </div>
              <div className="text-3xl font-bold text-primary tracking-[2px]">
                {formatNumber(item.value)}
              </div>
            </div>
          </CardStyle>
        </Col>
      ))}
    </Row>
  );
};
