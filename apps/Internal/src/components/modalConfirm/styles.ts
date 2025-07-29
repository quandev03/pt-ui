import { CloseCircleOutlined } from "@ant-design/icons";
import styled from "styled-components";

export const StyledContentConfirm = styled.div`
  text-align: center;
  width: calc(100% - 24px);
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  padding: 0 12px 12px;
  color: ${({ theme }) => theme.contentTable};
  p {
    margin: 0 0 24px;
    font-style: italic;
  }
`;
export const StyledTitle = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 22px;
  color: black;
  margin: 24px 20px 8px;
`;

export const StyledCloseIcon = styled(CloseCircleOutlined)`
  font-size: 20px;
`;
