import { lazy } from 'react';
import { pathRoutes } from '../../constants/routes';
import { RouterConfig } from '../../routers/ProtectedRoute';
import { FeedbackAddViewEditCSKH } from './page/FeedbackAddViewEditCSKH';
import { FeedbackAddViewEditBO } from './page/FeedbackAddViewEditBO';
import { FeedbackAddViewEditAssign } from './page/FeedbackAddViewEditAssign';
import { v4 } from 'uuid';

const FeedbackCSKH = lazy(() => import('./page/FeedbackCSKH'));
const FeedbackBO = lazy(() => import('./page/FeedbackBO'));
const FeedbackAssigned = lazy(() => import('./page/FeedbackAssigned'));

const feedbackRoutes: RouterConfig[] = [
  {
    path: pathRoutes.feedbackCSKH,
    page: <FeedbackCSKH />,
  },
  {
    path: pathRoutes.feedbackBO,
    page: <FeedbackBO />,
  },
  {
    path: pathRoutes.feedbackAssigned,
    page: <FeedbackAssigned />,
  },
  {
    path: pathRoutes.feedbackRouteAdd(pathRoutes.feedbackCSKH),
    page: <FeedbackAddViewEditCSKH title='Thêm mới yêu cầu phản ánh' key={v4()} />,
  },
  {
    path: pathRoutes.feedbackRouteAdd(pathRoutes.feedbackBO),
    page: <FeedbackAddViewEditBO title='Thêm mới yêu cầu phản ánh' key={v4()} />,
  },
  {
    path: pathRoutes.feedbackRouteEdit(pathRoutes.feedbackCSKH),
    page: <FeedbackAddViewEditCSKH title='Sửa yêu cầu phản ánh' key={v4()} />,
  },
  {
    path: pathRoutes.feedbackRouteEdit(pathRoutes.feedbackBO),
    page: <FeedbackAddViewEditBO title='Sửa yêu cầu phản ánh' key={v4()} />,
  },
  {
    path: pathRoutes.feedbackRouteView(pathRoutes.feedbackCSKH),
    page: <FeedbackAddViewEditCSKH title='Chi tiết yêu cầu phản ánh' key={v4()} />,
  },
  {
    path: pathRoutes.feedbackRouteView(pathRoutes.feedbackBO),
    page: <FeedbackAddViewEditBO title='Chi tiết yêu cầu phản ánh' key={v4()} />,
  },
  {
    path: pathRoutes.feedbackRouteView(pathRoutes.feedbackAssigned),
    page: <FeedbackAddViewEditAssign title='Chi tiết yêu cầu phản ánh' key={v4()} />,
  },
];

export default feedbackRoutes;
