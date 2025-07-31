import styled from 'styled-components';
import { COLORS } from '../../constants';

export const StyledTextSuccess = styled.div`
  font-size: 1rem;
  display: flex;
  justify-content: center;
  margin: 1.5rem;
`;

export const StyledTitleSuccess = styled.div`
  border-radius: 8px 8px 0 0;
  font-size: 1rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #01bb00;
  color: white;
`;

export const StyledTitleError = styled(StyledTitleSuccess)`
  background-color: #ff6364;
`;
export const StyledIconX = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  cursor: pointer;
`;

export const StyledTitleWarning = styled.div`
  border-radius: 8px 8px 0 0;
  font-size: 1rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #faad14;
  color: white;
`;

export const StyledModalErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 4px 24px rgba(229, 22, 22, 0.08);
  min-width: 320px;
  max-width: 90vw;
  position: relative;
  @media (max-width: 640px) {
    padding: 1.25rem 0.75rem 1rem 0.75rem;
    min-width: 220px;
  }
`;

export const StyledModalErrorIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${COLORS.ERROR};
  border-radius: 50%;
  width: 56px;
  height: 56px;
  margin-bottom: 1rem;
  svg {
    color: #fff;
    width: 32px;
    height: 32px;
  }
`;

export const StyledModalErrorTitle = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${COLORS.ERROR};
  text-align: center;
  margin-bottom: 0.5rem;
  @media (max-width: 640px) {
    font-size: 1.1rem;
  }
`;

export const StyledModalErrorContent = styled.div`
  font-size: 1rem;
  color: #333;
  text-align: center;
  margin-bottom: 0.5rem;
  word-break: break-word;
  @media (max-width: 640px) {
    font-size: 0.95rem;
  }
`;

export const StyledModalSuccessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 4px 24px rgba(1, 187, 0, 0.08);
  min-width: 320px;
  max-width: 90vw;
  position: relative;
  @media (max-width: 640px) {
    padding: 1.25rem 0.75rem 1rem 0.75rem;
    min-width: 220px;
  }
`;

export const StyledModalSuccessIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${COLORS.SUCCESS};
  border-radius: 50%;
  width: 56px;
  height: 56px;
  margin-bottom: 1rem;
  svg {
    color: #fff;
    width: 32px;
    height: 32px;
  }
`;

export const StyledModalSuccessTitle = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${COLORS.SUCCESS};
  text-align: center;
  margin-bottom: 0.5rem;
  @media (max-width: 640px) {
    font-size: 1.1rem;
  }
`;

export const StyledModalSuccessContent = styled.div`
  font-size: 1rem;
  color: #333;
  text-align: center;
  margin-bottom: 0.5rem;
  word-break: break-word;
  @media (max-width: 640px) {
    font-size: 0.95rem;
  }
`;

export const StyledModalWarningWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 4px 24px rgba(250, 173, 20, 0.08);
  min-width: 320px;
  max-width: 90vw;
  position: relative;
  @media (max-width: 640px) {
    padding: 1.25rem 0.75rem 1rem 0.75rem;
    min-width: 220px;
  }
`;

export const StyledModalWarningIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${COLORS.WARNING};
  border-radius: 50%;
  width: 56px;
  height: 56px;
  margin-bottom: 1rem;
  svg {
    color: #fff;
    width: 32px;
    height: 32px;
  }
`;

export const StyledModalWarningTitle = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${COLORS.WARNING};
  text-align: center;
  margin-bottom: 0.5rem;
  @media (max-width: 640px) {
    font-size: 1.1rem;
  }
`;

export const StyledModalWarningContent = styled.div`
  font-size: 1rem;
  color: #333;
  text-align: center;
  margin-bottom: 0.5rem;
  word-break: break-word;
  @media (max-width: 640px) {
    font-size: 0.95rem;
  }
`;
