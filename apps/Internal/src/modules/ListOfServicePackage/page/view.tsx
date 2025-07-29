import ModalAddEditView from '../components/ModalAddEditView';
import { Wrapper } from './style';
import { ActionType } from '@react/constants/app';

const ListOfServicePackagePage = () => {
  return (
    <Wrapper id="wrapperServicePackageList">
      <ModalAddEditView typeModal={ActionType.VIEW} />
    </Wrapper>
  );
};
export default ListOfServicePackagePage;
