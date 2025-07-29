import CModal from '@react/commons/Modal';
import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  .iconReload {
    cursor: pointer;
    transition: all 0.25s linear;
    &:hover {
      opacity: 0.7;
    }
  }
`;

export const WrapperActionTable = styled.div`
  .ant-btn {
    margin: 0 2.5px;
  }

  display: flex;
  align-items: center;
  justify-content: center;

  .iconMore {
    cursor: pointer;
  }
`;

export const StyledModalAddEdit = styled(CModal)`
  .ant-divider {
    margin: 20px 0;
  }

  .titleTree {
    margin: 0px 0 8px;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
  }

  .treeWrap {
    padding: 10px;
    border: 1px solid ${({ theme }) => theme.strokeLineLight};
    border-radius: 8px;
    max-height: 350px;
    overflow: scroll;

    .ant-tree-title {
      color: ${({ theme }) => theme.contentTable};
      line-height: 30px;
    }

    .ant-tree-switcher-icon {
      margin-top: 10px;
    }
  }

  .ant-tree-node-content-wrapper {
    color: ${({ theme }) => theme.buttonInput};
  }

  .clr-validate {
    color: ${({ theme }) => theme.statusRed};
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

  .ant-form-item-label label {
    font-weight: 500;
    font-size: 14px;
    line-height: 22px;
    color: ${({ theme }) => theme.contentTable} !important;
  }

  .ant-tree-checkbox-disabled {
    .ant-tree-checkbox-inner::after {
      border-color: #2d394b !important;
    }
  }
`;

export const StyledTitleModal = styled.section`
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
  color: ${({ theme }) => theme.titleDefault};
  margin: 0 0 12px;

  span {
    color: ${({ theme }) => theme.primary};
  }
`;

interface TagProps {
  active: boolean;
}

export const TagActive = styled.div<TagProps>`
  width: max-content;
  border-radius: 6px;
  padding: 4px 12px 4px 12px;
  font-weight: 400;
  line-height: 30px;
  color: ${(props: TagProps) => (props.active ? '#00B75F' : '#f50')};
  background-color: ${(props: TagProps) =>
    props.active ? '#00BE131A' : '#ffccc7'};
`;
