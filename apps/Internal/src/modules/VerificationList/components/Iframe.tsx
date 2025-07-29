import React from 'react';

type Props = {
  iframeUrl: string;
  changeHeightTable?: () => number;
};
const IframePdf: React.FC<Props> = ({ iframeUrl, changeHeightTable }) => {
  return (
    <iframe
      width="100%"
      src={iframeUrl}
      title="title"
      height={changeHeightTable ? changeHeightTable() : '100%'}
      key={Math.random()}
    />
  );
};
export default React.memo(IframePdf);
