import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .ant-form {
  }
`;

export const RowHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;

  .ant-form {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: flex-start;
    flex: 1;

    &-item {
      margin-bottom: 0;
      width: auto;
      min-width: 120px;
      max-width: 170px;
    }
  }
`;

export const WrapperButton = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
`;

export const FooterDiv = styled.div`
  margin-top: 20px;
`;
