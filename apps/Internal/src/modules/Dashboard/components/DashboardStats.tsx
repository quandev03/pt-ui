import { Card, Col, Row } from 'antd';
import styled from 'styled-components';
import { IDataDashboardStats } from '../type';
import { svgTotalESIM, svgTotalPackagesSold, svgTotalSTB } from '../utils';
import { CountUp } from './CountUp';
const CardStyle = styled(Card)`
  width: 100%;
  background: #ffffff;
  box-shadow: 10.7px 14.94px 37.35px 0px #6c7e9314;
  border-radius: 8.96484px;

  .ant-card-body {
    padding: 10px;
    padding-top: 0px;
    height: 100%;
    display: flex;
    align-items: center;
    min-height: 150px;
    margin-top: -10px;
  }
`;

export const DashboardStats = ({ data }: { data: IDataDashboardStats }) => {
  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US');
  };
  const dataTest = [
    // { label: 'Tổng eSIM đã đặt', value: data.totalESIM, icon: svgTotalESIM() },
    { label: 'Tổng eSIM đã bán', value: data.totalSTB, icon: svgTotalESIM() },
    {
      label: 'Tổng STB đã gọi 900',
      value: data.totalPackagesSold,
      icon: svgTotalSTB(),
    },
    {
      label: 'Tổng gói cước đã bán',
      value: data.totalESIMsOrdered,
      icon: svgTotalPackagesSold(),
    },
  ];

  return (
    <Row gutter={16}>
      {dataTest.map((item, idx) => (
        <Col span={6} key={idx}>
          <CardStyle>
            <div className="flex flex-col w-full justify-between h-full items-center">
              <div className="flex self-start items-center gap-4 px-6">
                {item.icon}
                <div>
                  <div className="font-medium text-sm">{item.label}</div>
                </div>
              </div>
              <div className="text-3xl w-full ml-10 mr-16 mt-4 text-center font-bold text-primary tracking-[2px]">
                <span className="mr-12">{formatNumber(item.value)}</span>
                {/* <CountUp
                  from={0}
                  to={item.value}
                  separator=","
                  direction="up"
                  duration={1}
                  className="count-up-text mr-12"
                  delay={0}
                  startWhen={true}
                  onStart={() => {}}
                  onEnd={() => {}}
                  step={100000}
                /> */}
              </div>
            </div>
          </CardStyle>
        </Col>
      ))}
    </Row>
  );
};
