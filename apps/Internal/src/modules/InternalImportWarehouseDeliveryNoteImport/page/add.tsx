import { ActionType } from "@react/constants/app";
import ModalAddView from "../components/ModalAddView";
import { Wrapper } from "@react/commons/Template/style";

const InternalWarehouseDeliveryNoteAddPage = ({ typeModal }: { typeModal: ActionType }) => {
  return (
    <Wrapper>
      <ModalAddView typeModal={typeModal} />
    </Wrapper>
  );
};

export default InternalWarehouseDeliveryNoteAddPage;
