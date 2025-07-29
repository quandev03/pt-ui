import styled from 'styled-components';

export const ElementsSign = styled.div<{
  type: number; //1 là biểu mẫu, 2 là hợp đồng
}>`
  width: 12%;
  height: 10%;
  position: absolute;
  top: 76%;
  left: 14%;
`;

export const ElementsSignChangeSim = styled.div`
  width: 12%;
  height: 10%;
  position: absolute;
  top: 69%;
  left: 20%;
`;

export const ElementsSignChangeInfo = styled.div`
  width: 12%;
  height: 10%;
  position: absolute;
  top: 72%;
  left: 22%;
`;

export const ElementsSignChangeInfo2 = styled.div`
  width: 12%;
  height: 10%;
  position: absolute;
  top: 79%;
  right: 18%;
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
