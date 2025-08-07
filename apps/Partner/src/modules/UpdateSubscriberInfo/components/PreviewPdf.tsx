import { FC } from 'react';

type Props = {
  fileUrl: string;
  title: string;
};
const PreviewPdf: FC<Props> = ({ fileUrl, title }) => {
  return (
    <div className="border border-dashed rounded-lg border-[#999999]">
      <iframe
        src={fileUrl}
        title={title}
        className="w-full h-[30vh] rounded-lg"
      />
    </div>
  );
};
export default PreviewPdf;
