import { TimePicker, TimePickerProps } from "antd";
import React, { FC } from "react";
import { StyledTimePicker } from "./style";
import { AnyElement } from "@/types";

const CTimePicker: FC<TimePickerProps> = React.memo(({ ...rest }) => {
  return <StyledTimePicker {...(rest as AnyElement)} />;
});

export const CRangeTimePicker: FC<AnyElement> = React.memo(({ ...rest }) => {
  return <TimePicker.RangePicker style={{ minHeight: 36 }} {...rest} />;
});

export default CTimePicker;
