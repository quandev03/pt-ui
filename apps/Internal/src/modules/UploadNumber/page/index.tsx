import React from 'react';
import { FormattedMessage } from 'react-intl';
import { TitleHeader, Wrapper } from '@react/commons/Template/style';
import Container from '../components/container';
const UploadDigitalResources: React.FC = () => {
    return (
        <Wrapper id="wrapperPostCheckList">
            <TitleHeader id="filterPostCheckLIst">
                <FormattedMessage id="Danh sách upload tài nguyên số" />
            </TitleHeader>
            <Container />
        </Wrapper>
    );
};
export default UploadDigitalResources;