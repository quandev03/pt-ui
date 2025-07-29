import React from 'react';

type Props = {
  iframeUrl: string;
};
const IframePdf: React.FC<Props> = ({ iframeUrl }) => {
  return (
    <iframe
      width="100%"
      src={iframeUrl}
      title="title"
      height={'100%'}
      key={Math.random()}
    />
  );
};
export default React.memo(IframePdf);
