import React, { FC } from 'react';
import { Props } from 'react-intl/src/components/relative';
import ModalAddEditView from '../components/ModalAddEditView';
import { ActionType } from '@react/constants/app';
import { Wrapper } from './style';

const UploadSimAdd: FC<Props> = () => {
  return (
    <Wrapper id="wrapperUploadSim">
      <ModalAddEditView typeModal={ActionType.ADD} />
    </Wrapper>
  );
};

export default UploadSimAdd;
