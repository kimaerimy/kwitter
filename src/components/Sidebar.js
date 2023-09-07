import styles from "./Sidebar.module.scss";
import FollowRecom from "components/FollowRecom";

const Sidebar = ({ userObj }) => {
  return (
    <div className={styles["inner-container"]}>
      <FollowRecom userObj={userObj} />
    </div>
  );
};

export default Sidebar;
