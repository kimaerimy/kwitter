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

const Home = ({ userObj }) => {
  const [kweets, setKweets] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);

  const onClickTab = (index) => {
    setTabIndex(index);
  };
  useEffect(() => {
    onSnapshot(
      tabIndex === 1
        ? query(collection(db, "kweets"), orderBy("createdAt", "desc"))
        : query(
            collection(db, "kweets"),
            where("creatorId", "==", userObj.uid),
            orderBy("createdAt", "desc")
          ),
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
    <div className={styles["main"]}>
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
            <ul>
              <li
                onClick={() => onClickTab(0)}
                className={`${tabIndex === 0 && styles["active"]}`}
              >
                For you
              </li>
              <li
                onClick={() => onClickTab(1)}
                className={`${tabIndex === 1 && styles["active"]}`}
              >
                Following
              </li>
            </ul>
          </div>
        </div>
        <div className={styles["kweet-main"]}>
          <KweetWrite userObj={userObj} />
          {kweets.map((kweet) => (
            <Kweet
              key={kweet.id}
              kweetObj={kweet}
              isOwner={kweet.creatorId === userObj.uid}
            />
          ))}
          <hr />
        </div>
      </div>
    </div>
  );
};

export default Home;
