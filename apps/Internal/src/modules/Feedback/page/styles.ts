import CModal from '@react/commons/Modal';
import { Col } from 'antd';
import styled from 'styled-components';

export const Wrapper = styled.div`
  height: 100%;

  .iconReload {
    cursor: pointer;
    transition: all 0.25s linear;
    &:hover {
      opacity: 0.7;
    }
  }
`;

export const FilterWrapper = styled.div`
  margin-bottom: 8px;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

export const StyledModal = styled(CModal)`
  .buttonsWrap {
    width: 100%;
    display: flex;
    justify-content: center;

    button {
      margin: 10px;
      min-width: 120px;
    }
  }
  .ant-form-item-label {
    font-weight: 500;
  }
  .ant-divider {
    margin: 20px 0;
  }

  .switchActive {
    margin-top: 12px;

    .ant-row {
      flex-direction: row;
    }

    .ant-form-item-label {
      padding-bottom: 0;

      label {
        padding-bottom: 0;
        line-height: 2.3;
      }
    }

    .spanActive {
      padding-left: 10px;
    }
  }
`;

export const WrapperBtnAction = styled(Col)`
  text-align: right;
  button {
    margin-left: 8px;
  }
`;

export const CommentWrapper = styled.div`
  .box-comment {
    max-height: 300px; /* Set a maximum height */
    overflow-y: auto; /* Enable vertical scrolling */
    padding-right: 10px;
  }
`;

export const FormFeedbackWrapper = styled.div`
  background-color: #fff;
  border-radius: 16px;
  min-height: calc(100vh - 100px);
  padding: 24px;
  & .bold {
    font-weight: 700;
    font-size: 16px;
    color: #333;
    margin-bottom: 5px;
  }
  & .box-comment {
    border: 1px solid #eee;
    padding: 16px;
    .comment-item {
      margin-bottom: 10px;
    }
    .comment-info {
      color: #3f5eae;
    }
  }
  & .input-comment {
    position: relative;
    .send {
      position: absolute;
      right: 10px;
      bottom: 10px;
      z-index: 10;
      cursor: pointer;
      user-select: none;
    }
  }
`;
