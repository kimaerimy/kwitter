import { useContext, useState } from "react";
import { db } from "fbase";
import { doc, updateDoc } from "firebase/firestore";
import styles from "./Follow.module.scss";
import { UserContext } from "components/App/App";
import TextHighlights from "components/TextHighlights/TextHighlights";

const Follow = ({ user, searchText = "" }) => {
  const { user: currentUser, setRender } = useContext(UserContext);
  const [following, setFollowing] = useState(
    Boolean(currentUser.follow?.includes(user.userId))
  );
  const onFollow = async () => {
    let followList;
    if (following) {
      followList = currentUser.follow?.filter((el) => el !== user.userId);
    } else {
      followList = currentUser.follow;
      followList.push(user.userId);
    }
    await updateDoc(doc(db, "users", currentUser.userId), {
      follow: followList,
    });
    setFollowing((prev) => !prev);
    // setRender((prev) => prev + 1);
  };
  return (
    <div className={styles["inner-container"]}>
      <div className={styles["photo"]}>
        {user?.userPhoto && <img src={user.userPhoto} alt="userPhoto" />}
      </div>
      <div className={styles["info"]}>
        <div className={styles["search-text"]}>
          <TextHighlights text={user.userName} searchText={searchText} />
        </div>
        <div className={styles["text"]}>
          <span>@{user?.userEmail?.split("@")[0]}</span>
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
