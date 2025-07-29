import { StyledSpan } from "./style";
import React, {FC} from "react";

const CSpan: FC<React.HTMLAttributes<HTMLSpanElement>> = React.memo(({ ...rest }) => {
  return (<StyledSpan {...rest}></StyledSpan>);
});

export default CSpan;
