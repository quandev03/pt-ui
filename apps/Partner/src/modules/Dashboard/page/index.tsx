import { FormattedMessage } from 'react-intl';
import { TitleHeader } from '../../../../../../commons/src/lib/commons/Template/style';
// import Info from "../components/Info";

const ProfilePage = () => {
  return (
    <div>
      <TitleHeader>
        <FormattedMessage id="common.updateInfo" />
        {/* <Info /> */}
      </TitleHeader>
    </div>
  );
};

export default ProfilePage;
