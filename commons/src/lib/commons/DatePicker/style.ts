import { Dayjs } from 'dayjs';
import { DatePicker } from 'antd';
import styled from 'styled-components';
import momentGenerateConfig from 'rc-picker/lib/generate/moment';

// const MyDatePicker = DatePicker.generatePicker<Dayjs>(momentGenerateConfig);
export const StyledDatePicker = styled(DatePicker)`
  width: 100%;
`;
