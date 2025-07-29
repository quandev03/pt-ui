import { useState } from 'react';
import styles from './dashboardLayout.module.css';
import SiteBar from './components/SiteBar/SiteBar';

interface Props {
  children?: React.ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  const [hideSiteBar, setHideSiteBar] = useState(false);
  return (
    <>
      {hideSiteBar ? (
        <div className={styles.dashboardPage}>
          <div className={styles.siteBarHide}>
            <div className={styles.siteBarBlock}>
              <SiteBar hide={hideSiteBar} />
            </div>
            <div
              onClick={() => setHideSiteBar(!hideSiteBar)}
              className={styles.showHideSite}
            >
              {'>>'}
            </div>
          </div>
          <div className={styles.dashboardHide}>{children}</div>
        </div>
      ) : (
        <div className={styles.dashboardPage}>
          <div className={styles.siteBar}>
            <div className={styles.siteBarBlock}>
              <SiteBar hide={hideSiteBar} />
            </div>
            <div
              onClick={() => setHideSiteBar(!hideSiteBar)}
              className={styles.showHideSite}
            >
              {'<<'}
            </div>
          </div>
          <div className={styles.dashboard}>{children}</div>
        </div>
      )}
    </>
  );
};

export default DashboardLayout;
