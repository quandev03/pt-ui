import { useEffect, useState } from 'react';
import styles from './itemSiteBar.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { NavLink, useLocation } from 'react-router-dom';

interface Props {
  hide: boolean;
  type: boolean;
  path?: string;
  iconClass: string;
  textLabel: string;
  iconClassChild?: string[];
  textLabelChild?: string[];
  pathChild?: string[];
}

const ItemSiteBar = ({
  type,
  path,
  iconClass,
  textLabel,
  iconClassChild,
  textLabelChild,
  pathChild,
  hide,
}: Props) => {
  const [menuChild, setMenuChild] = useState(false);
  const [activeParent, setActiveParent] = useState(false);

  textLabelChild = textLabelChild ? textLabelChild : [];
  iconClassChild = iconClassChild ? iconClassChild : [];
  pathChild = pathChild ? pathChild : [];

  const location = useLocation();
  useEffect(() => {
    if (pathChild.find((item) => location.pathname == item)) {
      setMenuChild(true);
      setActiveParent(true);
    } else {
      setMenuChild(false);
      setActiveParent(false);
    }
  }, [location, pathChild]);

  return (
    <div className={styles.blockItem}>
      {type === true ? (
        <span
          className={`${styles.labelArrow} ${activeParent && styles.active}`}
          onClick={() => setMenuChild((prevState) => !prevState)}
        >
          <div className={styles.label}>
            <i className={iconClass}></i>
            <p>{textLabel}</p>
          </div>
          <i className="fa-solid fa-caret-down"></i>
        </span>
      ) : (
        <NavLink
          to={path ? path : ''}
          className={({ isActive }) => {
            return `${styles.labelArrow} ${isActive ? styles.active : ''}`;
          }}
          onClick={() => setMenuChild((prevState) => !prevState)}
        >
          <div className={styles.label}>
            <i className={iconClass}></i>
            <p>{textLabel}</p>
          </div>
        </NavLink>
      )}

      {type && (
        <ul
          className={`${hide ? styles.itemChildHide : styles.itemChild} ${
            menuChild && styles.takeOpen
          }`}
        >
          {textLabelChild.map((item, index) => (
            <li key={index}>
              <NavLink
                to={pathChild[index]}
                className={({ isActive }) => {
                  return isActive ? styles.itemActive : '';
                }}
              >
                <i className={iconClassChild[index]}></i>
                <p>{item}</p>
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ItemSiteBar;
