import styled from 'styled-components';

export const StyledBodyPage = styled('div')`
  background-color: ${({ theme }) => 'white'};
  padding: 20px;
  border-radius: 20px;
  margin-bottom: 20px;
`;

export const StyledWrapperPage = styled('div')`
  background-color: ${({ theme }) => '#F8F8F8'};
  /* padding: 20px; */
`;

export const StyledTitlePage = styled('div')`
  color: ${({ theme }) => '#222222'};
  font-weight: 700;
  font-size: 30px;
  line-height: 45px;
`;
