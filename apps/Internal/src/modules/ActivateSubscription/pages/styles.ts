import styled from 'styled-components';

export const ElementsSign = styled.div<{
  type: number; //1 là biểu mẫu, 2 là hợp đồng
}>`
  width: 12%;
  height: 10%;
  position: absolute;
  top: ${({ type }) => (type === 2 ? '72%' : '56%')};
  left: ${({ type }) => (type === 2 ? '18%' : '10%')};
`;

export const Layers = styled.div`
  position: relative;
  overflow: hidden;
  height: 100%;
  z-index: 2;
`;

export const BackgroundsLayers = styled.div`
  img {
    width: 100%;
  }
`;

export const StyledWrapperPage = styled.div`
  background-color: '#F8F8F8';
  .ant-collapse-header {
    padding: 0 !important;
  }
`;
