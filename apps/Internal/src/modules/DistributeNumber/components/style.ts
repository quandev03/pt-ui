import styled from 'styled-components';

export const WrapperButton = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const RowHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;

  .ant-form {
    flex: 1;
    &-item {
      margin-bottom: 0;
    }
  }
`;