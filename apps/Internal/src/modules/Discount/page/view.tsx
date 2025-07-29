import ModalAddEditView from '../components/ModalAddEditView';
import { Wrapper } from './style';
import { ActionType } from "@react/constants/app";

const DiscountManagementPage = () => {
    return (
        <Wrapper id="wrapperDiscountManagement">
            <ModalAddEditView typeModal={ActionType.VIEW} />
        </Wrapper>
    );
};

export default DiscountManagementPage;
