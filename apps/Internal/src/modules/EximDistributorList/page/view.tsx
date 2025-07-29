import React, { FC } from 'react';
import { ActionType } from '@react/constants/app';
import { Wrapper } from './style';
import { Props } from 'react-intl/src/components/relative';
import ModalAddEditView from '../components/ModalAddEditView';

const EximDistributorView: FC<Props> = () => {
  return (
    <Wrapper id="">
      <ModalAddEditView typeModal={ActionType.VIEW} />
    </Wrapper>
  );
};

export default EximDistributorView;
