import { Wrapper } from '@react/commons/Template/style';
import Body from '../components/Body';
import useCensorshipStore from '../store';
import { useEffect } from 'react';

const VerificationList = () => {
  const { setIsAdmin } = useCensorshipStore();
  useEffect(() => {
    setIsAdmin(true);
  }, []);
  return (
    <Wrapper>
      <Body />
    </Wrapper>
  );
};
export default VerificationList;
