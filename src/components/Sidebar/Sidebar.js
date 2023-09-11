import styles from "./Sidebar.module.scss";
import FollowRecom from "components/Follow/FollowRecom/FollowRecom";

const Sidebar = () => {
  return (
    <div className={styles["inner-container"]}>
      <FollowRecom />
    </div>
  );
};

export default Sidebar;
