import ItemSiteBar from "../ItemSiteBar/ItemSiteBar";
import styles from "./siteBar.module.css";

type Props = {
  hide: boolean;
};

const SiteBar = ({ hide }: Props) => {
  return (
    <div className={hide ? styles.blockSiteBarHide : styles.blockSiteBar}>
      <div className={styles.blockLogo}>
        {hide ? (
          <img style={{ width: 30 }} src="/logo_icon.png" alt="" />
        ) : (
          <img src="/logoback.png" alt="" />
        )}
      </div>
      <div className={styles.menu}>
        <ItemSiteBar
          hide={hide}
          type={false}
          path="/"
          iconClass="fa-solid fa-bars"
          textLabel="Tổng quan"
        />
        <ItemSiteBar
          hide={hide}
          type={false}
          path="/report"
          iconClass="fa-solid fa-note-sticky"
          textLabel="Báo cáo"
        />

        <ItemSiteBar
          hide={hide}
          type={false}
          iconClass="fa-solid fa-chart-simple"
          textLabel="Quản lý và truy xuất dữ liệu"
          path="/exploration"
        />

        <ItemSiteBar
          hide={hide}
          type={false}
          iconClass="fa-solid fa-chart-simple"
          textLabel="Gene đáp ứng thuốc"
          path="/gene"
        />

        <ItemSiteBar
          hide={hide}
          type={false}
          iconClass="fa-solid fa-chart-simple"
          textLabel="Nguy cơ bệnh phổ biến"
          path="/risk"
        />
      </div>
    </div>
  );
};

export default SiteBar;
