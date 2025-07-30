import { Popover, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModalConfirm } from '../../Modal';
import { AvatarBox, ContentStyled } from '../styled';
import { IPathRoutes, IUserInfo } from '../../../types';

interface IProfileProps {
  pathRoutes: IPathRoutes;
  logoutStore: () => void;
  userLogin: IUserInfo | null;
  setShowChangePassModal: (value: boolean) => void;
}

export const Profile = ({
  pathRoutes,
  logoutStore,
  userLogin,
  setShowChangePassModal,
}: IProfileProps) => {
  const history = useNavigate();
  const { Text } = Typography;
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    ModalConfirm({
      message: 'Bạn có chắc chắn muốn đăng xuất?',
      handleConfirm: () => {
        setOpen(false);
        logoutStore();
      },
    });
  };
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  const handleProfileBtn = () => {
    setOpen(false);
    history(pathRoutes.profile as string);
  };
  const handleChangePass = () => {
    setShowChangePassModal(true);
  };
  const content = (
    <ContentStyled>
      <Text
        onClick={handleProfileBtn}
        className="rounded-md p-2 hover:bg-gray-100"
      >
        Cập nhật thông tin
      </Text>
      <Text
        onClick={handleChangePass}
        className="rounded-md p-2 hover:bg-gray-100"
      >
        Đổi mật khẩu
      </Text>
      <Text onClick={handleLogout} className="rounded-md p-2 hover:bg-gray-100">
        Đăng xuất
      </Text>
    </ContentStyled>
  );
  const TextLogo = useMemo(() => {
    if (!userLogin?.fullname) {
      return 'U';
    }
    const splitText = userLogin?.fullname?.split(' ');
    return splitText[splitText.length - 1][0];
  }, [userLogin?.fullname]);

  return (
    <Popover
      placement="bottomLeft"
      content={content}
      open={open}
      onOpenChange={handleOpenChange}
      trigger="click"
    >
      <AvatarBox>{TextLogo.toUpperCase()}</AvatarBox>
    </Popover>
  );
};
