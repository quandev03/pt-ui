import ModalAddEditView from '../components/ModalAddEditView';
import { Wrapper } from './style';
import { ActionType } from '@react/constants/app';

const SupplierPage = () => {
  return (
    <Wrapper>
      <ModalAddEditView typeModal={ActionType.ADD} />
    </Wrapper>
  );
};

export default SupplierPage;
