import ModalAddEditView from '../components/ModalAddEditView';
import { Wrapper } from './style';
import { ActionType } from "@react/constants/app";

const UserGroupManagerPage = () => {
  return (
    <Wrapper id="wrapperUserGroup">
      <ModalAddEditView typeModal={ActionType.EDIT} />
    </Wrapper>
  );
};

export default UserGroupManagerPage;
