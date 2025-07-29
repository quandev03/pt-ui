import { Image, Spin } from 'antd';
import { useGetImage } from 'apps/Internal/src/components/layouts/queryHooks';
import { Text } from '@react/commons/Template/style';
import { useMemo, useState } from 'react';
import CModal from '@react/commons/Modal';

interface CUploadProps {
  label: string;
  url: string;
  isProfilePicture?: boolean;
}

const PreviewImageUpload: React.FC<CUploadProps> = ({
  label,
  url,
  isProfilePicture,
}) => {
  const [isOpenPdf, setIsOpenPdf] = useState<boolean>(false);
  const { data: imageBlobUrl, isLoading } = useGetImage(url, isProfilePicture);
  const isContractPdf = useMemo(() => {
    if (imageBlobUrl && typeof imageBlobUrl === 'object') {
      return imageBlobUrl.isPdf;
    }
    return false;
  }, [imageBlobUrl]);
  const pdfUrl = useMemo(() => {
    if (imageBlobUrl && typeof imageBlobUrl === 'object') {
      return (imageBlobUrl as any).url;
    }
    return imageBlobUrl;
  }, [imageBlobUrl]);
  const handlePreview = () => {
    setIsOpenPdf(true);
  };
  const renderImage = useMemo(() => {
    if (imageBlobUrl) {
      if (isContractPdf) {
        return (
          <div
            className="rounded-2xl overflow-hidden relative aspect-[4/3]"
            onClick={handlePreview}
          >
            <iframe
              width="100%"
              height="100%"
              src={pdfUrl + '#toolbar=0'}
              title={label}
              key={Math.random()}
            />
            <div className="absolute top-0 bottom-0 right-0 left-0 cursor-pointer" />
          </div>
        );
      }

      return (
        <Image
          width="100%"
          title={label}
          alt={label}
          src={imageBlobUrl}
          className="rounded-2xl object-cover aspect-[4/3]"
        />
      );
    }

    return <div className="border-2 rounded-2xl object-cover aspect-[4/3]" />;
  }, [imageBlobUrl, label, url]);

  const changeHeightTable = () => {
    const top =
      document?.querySelector('#report-embed')?.getBoundingClientRect().top ||
      0;

    return window.innerHeight - top - 80;
  };

  return (
    <div className="w-full">
      <Spin spinning={isLoading}>
        <Text className="text-left mb-1">{label}</Text>
        {renderImage}
      </Spin>
      <CModal
        title={label ?? 'Biên bản xác nhận/ Hợp đồng'}
        open={isOpenPdf}
        width={840}
        onCancel={() => setIsOpenPdf(false)}
        footer={null}
      >
        <iframe
          id="report-embed"
          width="100%"
          src={pdfUrl ? pdfUrl : (imageBlobUrl as string)}
          height={changeHeightTable()}
          title={label}
          key={Math.random()}
        />
      </CModal>
    </div>
  );
};

export default PreviewImageUpload;
