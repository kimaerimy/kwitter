import { useEffect, useState } from "react";
import {
  db,
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  getDocs,
} from "fBase";
import KweetWrite from "components/KweetWrite";
import Kweet from "components/Kweet";
import styles from "./Home.module.scss";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSadTear } from "@fortawesome/free-regular-svg-icons";

const Home = ({ userObj, refreshUser }) => {
  const [kweets, setKweets] = useState([]);
  const [followKweets, setFollowKweets] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const onClickTab = (index) => {
    setTabIndex(index);
    refreshUser();
  };
  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(
        query(
          collection(db, "users"),
          where("follow", "array-contains", userObj.uid)
        )
      );
      const followers = snapshot.docs.map((doc) => doc.id);
      onSnapshot(
        query(
          collection(db, "kweets"),
          where("creatorId", "in", [userObj.uid, ...userObj.follow]),
          orderBy("createdAt", "desc")
        ),
        (snapshot) => {
          const docsArr = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setKweets(docsArr);
        }
      );
      onSnapshot(
        query(
          collection(db, "kweets"),
          where("creatorId", "in", followers.length > 0 ? [...followers] : [1]),
          orderBy("createdAt", "desc")
        ),
        (snapshot) => {
          const docsArr = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setFollowKweets(docsArr);
        }
      );
    };
    fetchData();
  }, [userObj]);
  return (
    <div className={styles["inner-container"]}>
      <div className={styles["kweet-area"]}>
        <div className={styles["kweet-header"]}>
          <div className={styles["kweet-home"]}>
            <Link to="/">
              <h3>Home</h3>
            </Link>
          </div>
          <div className={styles["kweet-tab"]}>
            <div
              className={`${styles["tab-items"]} ${
                tabIndex === 0 && styles["active"]
              }`}
              onClick={() => onClickTab(0)}
            >
              <span>For you</span>
              <div></div>
            </div>
            <div
              className={`${styles["tab-items"]} ${
                tabIndex === 1 && styles["active"]
              }`}
              onClick={() => onClickTab(1)}
            >
              <span>Followers</span>
              <div></div>
            </div>
          </div>
        </div>
        <div className={styles["kweet-main"]}>
          {tabIndex === 0 && (
            <>
              <KweetWrite userObj={userObj} />
              {kweets.map((kweet) => (
                <Kweet key={kweet.id} kweetObj={kweet} uid={userObj.uid} />
              ))}
            </>
          )}
          {tabIndex === 1 && (
            <>
              {followKweets.length > 0 ? (
                <>
                  {followKweets.map((kweet) => (
                    <Kweet key={kweet.id} kweetObj={kweet} uid={userObj.uid} />
                  ))}
                </>
              ) : (
                <>
                  <div className={styles["null-container"]}>
                    <div className={styles["bg"]}>
                      <FontAwesomeIcon icon={faFaceSadTear} size="2xl" />
                    </div>
                    <div className={styles["comment"]}>
                      <span>No Followers...</span>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
