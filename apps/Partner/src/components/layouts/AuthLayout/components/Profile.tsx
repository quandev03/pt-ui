import { Popover, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import useConfigAppStore from '../../store';
import { AvatarBox, ContentStyled } from '../styled';
import { pathRoutes } from 'apps/Partner/src/constants/routes';
import ModalConfirm from 'apps/Partner/src/components/modalConfirm';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { IUserInfo } from '../../types';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';

const Profile = () => {
  const history = useNavigate();
  const { logoutStore, setShowChangePassModal } = useConfigAppStore();
  const userLogin = useGetDataFromQueryKey<IUserInfo>([
    REACT_QUERY_KEYS.GET_PROFILE,
  ]);
  const { Text } = Typography;
  const [open, setOpen] = useState(false);
  // const handleShowModalChangPass = () => {
  //   setOpen(false);
  //   setShowChangePassModal(true);
  // };
  const handleLogout = () => {
    ModalConfirm({
      message: 'Bạn có chắc chắn muốn đăng xuất?',
      handleConfirm: () => {
        setOpen(false);
        logoutStore();
        history(pathRoutes.login);
      },
    });
  };
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  const handleProfileBtn = () => {
    setOpen(false);
    history(pathRoutes.profile);
  };
  const handleChangePass = () => {
    setShowChangePassModal(true);
  };
  const content = (
    <ContentStyled>
      <Text
        onClick={handleProfileBtn}
        className="hover:bg-gray-100 p-2 rounded-md"
      >
        <FormattedMessage id="common.updateInfo" />
      </Text>
      <Text
        onClick={handleChangePass}
        className="hover:bg-gray-100 p-2 rounded-md"
      >
        Đổi mật khẩu
      </Text>
      <Text onClick={handleLogout} className="hover:bg-gray-100 p-2 rounded-md">
        <FormattedMessage id="common.logout" />
      </Text>
    </ContentStyled>
  );
  const TextLogo = useMemo(() => {
    if (!userLogin?.fullname) {
      return '';
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

export default Profile;
