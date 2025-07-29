import Body from '../components/Body';
import Header from '../components/Header';
import { TitleHeader, Wrapper } from '@react/commons/Template/style';

const StockOutForDistributor = () => {
    return (
        <Wrapper id="wrapperPostCheckList">
            <TitleHeader>Danh sách phiếu xuất kho cho Đối tác</TitleHeader>
            <Header />
            <Body />
        </Wrapper>
    );
};
export default StockOutForDistributor;
