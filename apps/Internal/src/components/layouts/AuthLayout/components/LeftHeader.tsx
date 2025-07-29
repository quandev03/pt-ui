import MenuFoldOutlined from 'apps/Internal/src/assets/images/MenuFoldOutlined.svg';
import MenuUnfoldOutlined from 'apps/Internal/src/assets/images/MenuUnfoldOutlined.svg';
import useConfigAppStore from '../../store';
import { IconCollapsed, IconMenu } from '../styled';

const LeftHeader = () => {
  const { collapsedMenu, toggleCollapsedMenu } = useConfigAppStore();
  const handleChange = () => {
    toggleCollapsedMenu();
  };
  return (
    <div>
      <IconMenu>
        <IconCollapsed>
          {collapsedMenu ? (
            <img src={MenuUnfoldOutlined} alt="Logo" onClick={handleChange} />
          ) : (
            <img src={MenuFoldOutlined} alt="Logo" onClick={handleChange} />
          )}
        </IconCollapsed>
      </IconMenu>
    </div>
  );
};

export default LeftHeader;
