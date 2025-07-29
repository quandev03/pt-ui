import { ActionType } from "@react/constants/app";
import ModalAddView from "../components/ModalAddView";
import { Wrapper } from "@react/commons/Template/style";

const InternalWarehouseDeliveryNoteAddPage = ({ typeModal, isImport }: { typeModal: ActionType, isImport: boolean }) => {
  return (
    <Wrapper>
      <ModalAddView typeModal={typeModal} isImport={isImport} />
    </Wrapper>
  );
};

export default InternalWarehouseDeliveryNoteAddPage;
