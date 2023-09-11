import { useContext, useState } from "react";
import { db } from "fbase";
import { doc, updateDoc } from "firebase/firestore";
import styles from "./Follow.module.scss";
import { UserContext } from "components/App/App";

const Follow = ({ user }) => {
  const { user: currentUser } = useContext(UserContext);
  const [following, setFollowing] = useState(
    Boolean(currentUser.follow?.includes(user.userId))
  );
  const onFollow = async () => {
    if (following) {
      currentUser.follow = currentUser.follow?.filter(
        (el) => el !== user.userId
      );
    } else {
      currentUser.follow.push(user.userId);
    }
    await updateDoc(doc(db, "users", currentUser.userId), {
      follow: currentUser.follow,
    });
    setFollowing((prev) => !prev);
  };
  return (
    <div className={styles["inner-container"]}>
      <div className={styles["photo"]}>
        {user?.userPhoto && <img src={user.userPhoto} alt="userPhoto" />}
      </div>
      <div className={styles["info"]}>
        <div>
          <span>{user?.userName}</span>
        </div>
        <div>
          <span>{user?.userEmail?.split("@")[0]}</span>
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
