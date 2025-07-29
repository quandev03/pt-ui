import { Image, Spin } from 'antd';
import { useGetImage } from 'apps/Internal/src/components/layouts/queryHooks';
import { Text } from '@react/commons/Template/style';

interface CUploadProps {
  label: string;
  url: string;
}

const UploadImage: React.FC<CUploadProps> = ({ label, url }) => {
  const { data: imageBlobUrl, isLoading } = useGetImage(url);

  return (
    <div className="w-full">
      <Spin spinning={isLoading}>
        <Text className="text-center mb-1">{label}</Text>
        {imageBlobUrl ? (
          <Image
            title={label}
            alt={label}
            src={imageBlobUrl}
            className="rounded-2xl object-cover aspect-[4/3]"
          />
        ) : (
          <div className="border-2 rounded-2xl object-cover aspect-[4/3]" />
        )}
      </Spin>
    </div>
  );
};

export default UploadImage;
