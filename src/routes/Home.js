import { useContext, useEffect, useState } from "react";
import { db } from "fbase";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import TweetForm from "components/Tweet/TweetForm/TweetForm";
import Tweet from "components/Tweet/Tweet";
import styles from "./Home.module.scss";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSadTear } from "@fortawesome/free-regular-svg-icons";
import { UserContext } from "components/App/App";
import EmptyContent from "components/EmptyContent/EmptyContent";

const Home = () => {
  const [tweets, setTweets] = useState([]);
  const [followTweets, setFollowTweets] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const {
    user,
    userConnections: { following, followers, users },
    render
  } = useContext(UserContext);
  const onClickTab = (index) => {
    setTabIndex(index);
  };
  useEffect(() => {
    const fetchData = () => {
      const tweetsSnapshot = onSnapshot(
        query(
          collection(db, "tweets"),
          where("userId", "in", [...followers, ...following]),
          orderBy("createdAt", "desc"),
          limit(25)
        ),
        (snapshot) => {
          const docs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          const f1 = docs.filter((doc) => following.includes(doc.userId));
          const f2 = docs.filter((doc) => followers.includes(doc.userId));
          setTweets(f1);
          setFollowTweets(f2);
        }
      );
      return () => {
        tweetsSnapshot();
      };
    };
    const fetchTweets = fetchData();
    return () => {
      fetchTweets();
    };
  }, [followers, following]);
  return (
    <main className={styles["inner-container"]}>
      <div className={styles["content-wrap"]}>
        <div className={styles["content-header"]}>
          <div className={styles["content-header-logo"]}>
            <Link to="/">
              <h3>Home</h3>
            </Link>
          </div>
          <div className={styles["content-header-tab"]}>
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
        <div className={styles["content-main"]}>
          {tabIndex === 0 && (
            <>
              <TweetForm />
              {tweets.map((tweet) => (
                <Tweet key={tweet.id} tweet={tweet} />
              ))}
            </>
          )}
          {tabIndex === 1 && (
            <>
              {followTweets.length > 0 ? (
                <>
                  {followTweets.map((tweet) => (
                    <Tweet key={tweet.id} tweet={tweet} />
                  ))}
                </>
              ) : (
                <EmptyContent text={`No Followers...`} />
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
