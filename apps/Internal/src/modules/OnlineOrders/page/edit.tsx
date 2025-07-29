
import ModalAddEditView from '../components/ModalAddEditView';
import { Wrapper } from './style';
import { ActionType } from "@react/constants/app";

const OnlineOrdersManagementPage = () => {
    return (
        <Wrapper id="wrapperOnlineOrdersManagement">
            <ModalAddEditView typeModal={ActionType.EDIT} />
        </Wrapper>
    );
};

export default OnlineOrdersManagementPage;
