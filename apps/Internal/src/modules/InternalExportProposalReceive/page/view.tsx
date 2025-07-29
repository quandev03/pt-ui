import { Wrapper } from "@react/commons/Template/style";
import ModalAddView from "../../InternalExportProposalSend/components/ModalAddView";
import { ActionType } from "@react/constants/app";

const InternalExportProposalReceiveViewPage = ({ typeModal, isEnabledApproval }: { typeModal: ActionType, isEnabledApproval: boolean }) => {
    return (
        <Wrapper>
            <ModalAddView isReceive={true} actionType={typeModal} isEnabledApproval={isEnabledApproval} />
        </Wrapper>
    );
};
export default InternalExportProposalReceiveViewPage;
