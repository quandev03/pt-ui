import { X } from 'lucide-react';
import { FC } from 'react';
type Props = {
  imageUrl: string;
  desc: string;
};
const CaptureNote: FC<Props> = ({ imageUrl, desc }) => {
  return (
    <div className="flex-1 flex flex-col items-center">
      <div className="relative border border-gray-200 rounded-lg w-fit">
        <div>
          <img src={imageUrl} alt="Lưu ý khi chụp ảnh" />
        </div>
        <X color="#FB1D1D" className="absolute -top-3 -right-3" />
      </div>
      <p className="mt-2 text-center">{desc}</p>
    </div>
  );
};
export default CaptureNote;
