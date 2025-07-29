import React, { FC } from "react";
import { SwitchProps } from "antd";
import { StyledSwitch } from "./styles";

interface Props extends SwitchProps {}

const CSwitch: FC<Props> = React.memo(({ ...rest }) => {
  return <StyledSwitch {...rest} />;
});

export default CSwitch;
