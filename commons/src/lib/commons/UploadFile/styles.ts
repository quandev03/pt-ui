import { Upload, UploadProps } from 'antd';
import styled, { css } from 'styled-components';

const isSmallSize = (maxCount: number | undefined) => maxCount === 1;

export const StyledWrapUpload = styled(Upload)`
  ${({
    maxCount,
    disabled,
    fileList,
    isError,
  }: { isError?: boolean } & UploadProps) => css``}
`;
