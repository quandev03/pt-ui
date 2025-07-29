import React from 'react';
import { TitleHeader } from '@react/commons/Template/style';
import Container from '../components/Container';
import { Wrapper } from './styles';

const PostCheckList: React.FC = () => {
  return (
    <Wrapper>
      <TitleHeader>Danh sách hậu kiểm</TitleHeader>
      <Container />
    </Wrapper>
  );
};

export default PostCheckList;
