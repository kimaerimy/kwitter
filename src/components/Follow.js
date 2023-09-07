import { useState } from "react";
import styles from "./Follow.module.scss";
import { db, doc, updateDoc } from "fBase";

const Follow = ({ user, userObj: currentUser }) => {
  const [following, setFollowing] = useState(
    Boolean(currentUser.follow?.includes(user.id))
  );
  const onFollow = async () => {
    if (following) {
      currentUser.follow = currentUser.follow?.filter((el) => el !== user.id);
    } else {
      currentUser.follow.push(user.id);
    }
    await updateDoc(doc(db, "users", currentUser.uid), {
      follow: currentUser.follow,
    });
    setFollowing((prev) => !prev);
  };
  return (
    <div className={styles["inner-container"]}>
      <div className={styles["photo"]}>
        {user.userPhoto && <img src={user.userPhoto} alt="userPhoto" />}
      </div>
      <div className={styles["info"]}>
        <div>
          <span>{user.userName}</span>
        </div>
        <div>
          <span>{user.userEmail.split("@")[0]}</span>
        </div>
      </div>
      <div className={styles["button"]}>
        <button
          onClick={onFollow}
          className={`${following && styles["active"]}`}
        >
          {following ? "Following" : "Follow"}
        </button>
      </div>
    </div>
  );
};

export default Follow;
