import { memo } from 'react';
import { IconCollapsed, IconMenu } from '../styled';
import MenuFoldOutlined from '../../../assets/images/MenuFoldOutlined.svg';
import MenuUnfoldOutlined from '../../../assets/images/MenuUnfoldOutlined.svg';

interface ILeftHeaderProps {
  collapsedMenu: boolean;
  toggleCollapsedMenu: () => void;
}

export const LeftHeader: React.FC<ILeftHeaderProps> = memo(
  ({ collapsedMenu, toggleCollapsedMenu }) => {
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
  }
);
