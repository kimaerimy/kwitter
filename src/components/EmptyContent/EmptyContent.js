import styles from "./EmptyContent.module.scss";
import { FaceFrownIcon } from "components/Svg/Svg";

const EmptyContent = ({ text = "No Contents..." }) => {
  return (
    <div className={styles["inner-container"]}>
      <div className={styles["bg"]}>
        <FaceFrownIcon size="2" />
      </div>
      <div className={styles["comment"]}>
        <span>{text}</span>
      </div>
    </div>
  );
};

export default EmptyContent;
