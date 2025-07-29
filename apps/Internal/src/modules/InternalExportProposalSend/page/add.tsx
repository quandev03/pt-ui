import { ActionType } from "@react/constants/app";
import ModalAddView from "../components/ModalAddView";
import { Wrapper } from "@react/commons/Template/style";

const InternalExportProposalAddPage = ({ actionType, isEnabledApproval }: { actionType: ActionType, isEnabledApproval?: boolean }) => {
  return (
    <Wrapper>
      <ModalAddView actionType={actionType} isEnabledApproval={isEnabledApproval} />
    </Wrapper>
  );
};

export default InternalExportProposalAddPage;
