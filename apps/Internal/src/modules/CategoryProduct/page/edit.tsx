
import ModalAddEditView from '../components/ModalAddEditView';
import { Wrapper } from './style';
import { ActionType } from "@react/constants/app";

const CategoryProductPage = () => {
    return (
        <Wrapper id="wrapperCategoryProduct">
            <ModalAddEditView typeModal={ActionType.EDIT} />
        </Wrapper>
    );
};

export default CategoryProductPage;
