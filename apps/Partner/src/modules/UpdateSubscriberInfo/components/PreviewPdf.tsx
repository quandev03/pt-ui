import React, { FC } from 'react';

type Props = {
  fileUrl?: string;
  title: string;
};
const PreviewPdf: FC<Props> = ({ fileUrl, title }) => {
  console.log('fileurl', fileUrl);
  return (
    <div className="border border-dashed rounded-lg border-[#999999] w-full h-[30vh] p-1">
      {fileUrl && (
        <iframe
          src={fileUrl}
          title={title}
          className="w-full h-full rounded-lg"
        />
      )}
    </div>
  );
};
export default React.memo(PreviewPdf);
