import { useEffect, useState } from "react";
import {
  db,
  collection,
  onSnapshot,
  query,
  orderBy,
  getDoc,
  doc,
  where,
  getDocs,
} from "fBase";
import KweetWrite from "components/KweetWrite";
import Kweet from "components/Kweet";
import Navigation from "components/Navigation";
import styles from "./Home.module.scss";
import { Link } from "react-router-dom";
import { QuerySnapshot } from "firebase/firestore";

const Home = ({ userObj }) => {
  const [kweets, setKweets] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [kweetsProfiles, setKweetsProfiles] = useState({});
  const onClickTab = (index) => {
    setTabIndex(index);
  };
  useEffect(() => {
    onSnapshot(
      query(collection(db, "kweets"), orderBy("createdAt", "desc")),
      async (snapshot) => {
        const kweetArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setKweets(kweetArray);
      }
    );
    onSnapshot(query(collection(db, "users")), (snapshot) => {
      const profilesObject = {};
      snapshot.docs.forEach((doc) => {
        profilesObject[doc.id] = doc.data();
      });
      setKweetsProfiles(profilesObject);
    });
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
              <span>For You</span>
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
            <Kweet
              key={kweet.id}
              kweetObj={kweet}
              isOwner={kweet.creatorId === userObj.uid}
              creatorProfiles={kweetsProfiles[kweet.creatorId]}
            />
          ))}
          <hr />
        </div>
      </div>
    </div>
  );
};

export default Home;
