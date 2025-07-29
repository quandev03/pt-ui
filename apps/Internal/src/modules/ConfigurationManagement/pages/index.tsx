import { TitleHeader, Wrapper } from '@react/commons/Template/style';
import CriteriaConfig from '../components/CriteriaConfig';
import ActicationConfig from '../components/ActivationConfig';
import TransferOfOwnershipConfig from '../components/TransferOfOwnershipConfig';

const ConfigurationManagement = () => {
  return (
    <Wrapper>
      <TitleHeader>Quản lý cấu hình</TitleHeader>
      <CriteriaConfig />
      <ActicationConfig />
      <TransferOfOwnershipConfig />
    </Wrapper>
  );
};
export default ConfigurationManagement;
