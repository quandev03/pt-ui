import { CopyOutlined } from '@ant-design/icons';
import { NotificationSuccess } from '@react/commons/Notification';
import { TitleHeader, Wrapper } from '@react/commons/Template/style';
import { useGetLuckyNumber } from '../queryHook/useGetLuckyNumber';
import { useRolesByRouter } from 'apps/Partner/src/hooks/useRolesByRouter';
import { includes } from 'lodash';
import { ActionsTypeEnum } from '@react/constants/app';

const LuckyNumber = () => {
  const { data: luckyNumber = '' } = useGetLuckyNumber();
  const actionByRole = useRolesByRouter();
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(luckyNumber.toString());
      NotificationSuccess('Copy thành công');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  return (
    <Wrapper>
      <TitleHeader>Số may mắn</TitleHeader>
      {includes(actionByRole, ActionsTypeEnum.READ) && (
        <div className="flex flex-col gap-5 justify-center h-[70vh] items-center">
          <p className="text-base">Số may mắn của bạn là</p>
          <div className="py-3 px-12 relative h-[280px] border items-center flex shadow-md rounded-3xl">
            <CopyOutlined
              className="absolute top-4 right-4 cursor-pointer text-gray-400 transition-colors duration-300 hover:text-sky-600 text-lg"
              onClick={handleCopy}
            />
            <p className="text-[100px] text-sky-600 ">{luckyNumber}</p>
          </div>
        </div>
      )}
    </Wrapper>
  );
};
export default LuckyNumber;
