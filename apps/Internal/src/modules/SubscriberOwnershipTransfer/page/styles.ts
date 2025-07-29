import { Collapse } from 'antd';
import styled from 'styled-components';

const getTop = (type: number, code: string, customerType: string | null) => {
  switch (code) {
    case 'XAC_NHAN':
      return type === 2 ? '72.5%' : '55.7%';
    case 'YEU_CAU':
      return customerType === 'old' ? '86.5%' : '86.5%';
    case 'CAM_KET':
      return '80.5%';
  }
};

const getLeft = (type: number, code: string, customerType: string | null) => {
  switch (code) {
    case 'XAC_NHAN':
      return type === 2 ? '21%' : '13.5%';
    case 'YEU_CAU':
      return customerType === 'old' ? '42%' : '14%';
    case 'CAM_KET':
      return '70.5%';
  }
};
export const ElementsSign = styled.div<{
  type: number; //1 là biên bản XN, 2 là hợp đồng
  code: string;
  customerType: string | null;
}>`
  width: 12%;
  height: 10%;
  position: absolute;
  top: ${({ type, code, customerType }) => getTop(type, code, customerType)};
  left: ${({ type, code, customerType }) => getLeft(type, code, customerType)};
  img {
    margin: auto;
  }
`;

export const PanelStyled = styled(Collapse.Panel)`
  & > .ant-collapse-header {
    width: fit-content;
    align-items: center !important;
    svg {
      font-size: 1rem !important;
    }
    .ant-collapse-header-text {
      font-size: 1rem;
      color: #2c3d94;
      font-weight: 600;
    }
  }
  .ant-collapse-content-box {
    padding: 4px 0 0 !important;
  }
`;
