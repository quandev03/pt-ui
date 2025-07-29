import Tabs from '@react/commons/Tabs';
import { TitleHeader } from '@react/commons/Template/style';
import { TabsProps } from 'antd';
import { StyledWrapperPage } from 'apps/Internal/src/modules/ActivateSubscription/pages/styles';
import RepresentativeList from './EnterpriseRepresentatives/component/RepresentativeList';
import { useSearchParams } from 'react-router-dom';
import SubscriberPage from './Subscriber/pages';
import CancelSubscriberHistoryPage from './CancelSubscriberHistory/pages';
import BlockOpenSubscriberHistoryPage from './BlockOpenSubscriberHistory/pages';
import DetailBusiness from './DetailBusiness';

const ViewPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeKey = searchParams.get('tab') ?? 'information';

  const items: TabsProps['items'] = [
    {
      key: 'information',
      label: 'Thông tin DN',
      children: <DetailBusiness />,
    },
    {
      key: 'nuq',
      label: 'Danh sách NUQ',
      children: <RepresentativeList />,
    },
    {
      key: 'subscriber',
      label: 'Danh sách thuê bao',
      children: <SubscriberPage />,
    },
    {
      key: 'cancelSubHistory',
      label: 'Lịch sử cắt hủy TB',
      children: <CancelSubscriberHistoryPage />,
    },
    {
      key: 'blockOpenSubHistory',
      label: 'Lịch sử chặn mở TB',
      children: <BlockOpenSubscriberHistoryPage />,
    },
  ];

  return (
    <StyledWrapperPage>
      <TitleHeader>Xem chi tiết doanh nghiệp</TitleHeader>
      <Tabs
        size="small"
        centered
        activeKey={activeKey}
        items={items}
        destroyInactiveTabPane
        onChange={(activeKey) =>
          setSearchParams({ tab: activeKey }, { replace: true })
        }
      />
    </StyledWrapperPage>
  );
};
export default ViewPage;
