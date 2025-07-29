import { Flex, Form, Image } from 'antd';
import { useGetImage } from 'apps/Internal/src/components/layouts/queryHooks';
import { InformationChangeImageProps } from '../types';
import dayjs from 'dayjs';
import { DateFormat } from '@react/constants/app';

const InformationChangeImage: React.FC<InformationChangeImageProps> = ({
  label,
  src,
  date,
  status,
}) => {
  const { data } = useGetImage(src, true);

  return (
    <Form.Item label={label}>
      <Flex
        vertical
        align="center"
        justify="center"
        gap="small"
        className={`p-3 bg-[#0000000a] rounded-md border ${
          status ? 'border-[#ff4d4f]' : 'border-[#d9d9d9]'
        }`}
      >
        <Image src={data} height={120} className="rounded-md" />
        {date && dayjs(date).format(DateFormat.DATE_TIME)}
      </Flex>
    </Form.Item>
  );
};

export default InformationChangeImage;
