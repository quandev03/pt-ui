import React, { FC } from 'react';
import { ActionType } from '@react/constants/app';
import ModalAddEditView from '../components/ModalAddEditView';
import { Wrapper } from './style';
import { Props } from 'react-intl/src/components/relative';

const UploadSimView: FC<Props> = () => {
  return (
    <Wrapper id="wrapperUploadSim">
      <ModalAddEditView typeModal={ActionType.VIEW} />
    </Wrapper>
  );
};

export default UploadSimView;
