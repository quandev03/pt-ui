import styled from 'styled-components';
import CButton from '@react/commons/Button';
import { themeConfig } from 'apps/Internal/src/configs/ThemeConfig';
import CModal from '@react/commons/Modal';

interface ButtonProps {
  disableStyle?: boolean;
}

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const ElementsSign = styled.div`
  width: 180px;
  height: 180px;
  position: absolute;
  bottom: 770px;
  left: 100px;
`;

export const Layers = styled.div`
  position: absolute;
  overflow: hidden;
  width: 528px;
  height: 2244px;
  z-index: 2;
`;

export const BackgroundsLayers = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  img {
    height: 100%;
  }
`;

export const StyledModal = styled(CModal)`
  .ant-modal-body {
    padding-bottom: 8px !important;
  }
`;

export const StyledButton = styled(CButton)<ButtonProps>`
  background-color: ${(props) =>
    props.disableStyle ? '#DCDCDC' : themeConfig.primary};
`;