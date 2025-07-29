import React from 'react';
import { TitleHeader } from '@react/commons/Template/style';
import Container from '../components/Container';
import { Wrapper } from './styles';
import { Header } from '../components/Header';

const PostCheckList: React.FC = () => {
  return (
    <Wrapper>
      <TitleHeader>Danh sách yêu cầu đổi SIM đơn lẻ</TitleHeader>
      <Header />
      <Container />
    </Wrapper>
  );
};

export default PostCheckList;
