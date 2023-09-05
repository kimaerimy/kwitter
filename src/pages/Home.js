import { useEffect, useState } from "react";
import { db, collection, onSnapshot, query, orderBy, where } from "fBase";
import KweetWrite from "components/KweetWrite";
import Kweet from "components/Kweet";
import styles from "./Home.module.scss";
import { Link } from "react-router-dom";

const Home = ({ userObj }) => {
  const [kweets, setKweets] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const onClickTab = (index) => {
    setTabIndex(index);
  };

  useEffect(() => {
    onSnapshot(
      query(collection(db, "kweets"), orderBy("createdAt", "desc")),
      (snapshot) => {
        const kweetArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setKweets(kweetArray);
      }
    );
  }, []);
  return (
    <div className={styles["inner-container"]}>
      {/* <div className={styles["nav-area"]}> */}
      {/* <Navigation userObj={userObj} /> */}
      {/* </div> */}
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
              <span>Following</span>
              <div></div>
            </div>
          </div>
        </div>
        <div className={styles["kweet-main"]}>
          <KweetWrite userObj={userObj} />
          {kweets.map((kweet) => (
            <Kweet key={kweet.id} kweetObj={kweet} uid={userObj.uid} />
          ))}
          <hr />
        </div>
      </div>
    </div>
  );
};

export default Home;
