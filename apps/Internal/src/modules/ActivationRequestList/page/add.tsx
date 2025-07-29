
import { ActionType } from '@react/constants/app';
import ModalAddEditView from '../components/ModalAddEditView';
import { Wrapper } from './style';

const UserGroupManagerPage = () => {
  return (
    <Wrapper id="wrapperUserGroup">
      <ModalAddEditView typeModal={ActionType.ADD} />
    </Wrapper>
  );
};

export default UserGroupManagerPage;
