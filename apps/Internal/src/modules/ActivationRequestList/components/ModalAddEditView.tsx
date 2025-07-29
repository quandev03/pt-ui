import {
  BodyPage,
  WrapperPage,
} from '@react/commons/index';
import { FC} from 'react';
import '../index.scss';
import { ActionType } from '@react/constants/app';
import ActivateSubscriptionPage from '../../ActivateSubscription/pages';
type Props = {
  typeModal: ActionType;
};

const ActivateRequestListPage: FC<Props> = ({ typeModal }) => {

  return (
    <WrapperPage>
      <BodyPage>
        <ActivateSubscriptionPage />
      </BodyPage>
    </WrapperPage>
  );
};

export default ActivateRequestListPage;
