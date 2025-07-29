import { StyledWrapperPage } from '@react/commons/Page';
import { TitleHeader } from '@react/commons/Template/style';
import { Tabs, TabsProps } from 'antd';
import { useSearchParams } from 'react-router-dom';
import FeedbackTypeReport from '../components/FeedbackTypeReport';
import OverdueFeedbackReport from '../components/OverdueFeedbackReport';
import FeedbackChannelsReport from '../components/FeedbackChannelsReport';
import FeedbackDetail from '../components/FeedbackDetailReport';

const ReportFeedbackPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeKey = searchParams.get('tab') ?? 'feedbackType';
  const items: TabsProps['items'] = [
    {
      key: 'feedbackType',
      label: 'Báo cáo loại phản ánh',
      children: <FeedbackTypeReport />,
    },
    {
      key: 'feedbackChannel',
      label: 'Báo cáo kênh phản ánh',
      children: <FeedbackChannelsReport />,
    },
    {
      key: 'overdueFeedback',
      label: 'Báo cáo quá hạn',
      children: <OverdueFeedbackReport />,
    },
    {
      key: 'feedbackDetail',
      label: 'Báo cáo chi tiết',
      children: <FeedbackDetail />,
    },
  ];
  return (
    <StyledWrapperPage>
      <TitleHeader>Báo cáo phản ánh</TitleHeader>
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
export default ReportFeedbackPage;
