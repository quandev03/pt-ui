import React, { FC } from 'react';
import { Props } from 'react-intl/src/components/relative';
import { ActionType } from '@react/constants/app';
import { Wrapper } from './style';
import ModalAddEditView from '../components/ModalAddEditView';

const EximDistributorAdd: FC<Props> = () => {
  return (
    <Wrapper id="">
      <ModalAddEditView typeModal={ActionType.ADD} />
    </Wrapper>
  );
};

export default EximDistributorAdd;
