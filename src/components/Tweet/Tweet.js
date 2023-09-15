import { useContext, useEffect, useRef, useState } from "react";
import { db, storage } from "fbase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import styles from "./Tweet.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faPenToSquare,
  faRetweet,
} from "@fortawesome/free-solid-svg-icons";
import TweetReply from "components/Tweet/TweetReply/TweetReply";
import { UserContext } from "components/App/App";
import { ChatIcon, EllipsisIcon, ReTweetIcon, XIcon } from "components/Svg/Svg";
import TweetEditForm from "./TweetEditForm/TweetEditForm";

const Tweet = ({ tweet }) => {
  const [toggles, setToggles] = useState({ popup: false, editing: false });
  const [countReplies, setCountReplies] = useState(0);
  const [countReTweet, setCountReTweet] = useState(0);
  const [isReplies, setIsReplies] = useState(false);
  const [isReTweet, setIsReTweet] = useState(false);
  const {
    user,
    userConnections: { users },
  } = useContext(UserContext);
  const didMount = useRef(false);
  const popupEl = useRef();
  const onDelete = async () => {
    if (window.confirm("Are you sure delete this kweet?")) {
      await deleteDoc(doc(db, "tweets", tweet.id));
      if (tweet.photo) {
        await deleteObject(ref(storage, `/tweets/${tweet.userId}/${tweet.id}`));
      }
    }
  };
  const onToggle = (name, event) => {
    setToggles((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const formattedCreatedAt = (createdAt) => {
    const diff = (Date.now() - createdAt) / 3600000;
    if (diff < 1) {
      return `${Math.floor(diff * 60)}m`;
    } else if (diff < 22) {
      return `${Math.floor(diff)}h`;
    } else {
      const date = new Date(createdAt);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  useEffect(() => {
    const tweetRepliesSnapshot = onSnapshot(
      query(
        collection(db, "tweetReplies"),
        where("tweetId", "==", tweet.id),
        orderBy("createdAt", "asc")
      ),
      (snapshot) => {
        setCountReplies(snapshot.docs.length);
      }
    );
    const reTweetsSnapshot = onSnapshot(
      query(collection(db, "reTweets"), where("tweetId", "==", tweet.id)),
      (snapshot) => {
        const reTweetUsers = snapshot.docs.map((doc) => doc.data().userId);
        setCountReTweet(reTweetUsers.length);
        if (reTweetUsers.includes(user.userId)) {
          setIsReTweet(true);
        }
      }
    );
    return () => {
      tweetRepliesSnapshot();
      reTweetsSnapshot();
    };
  }, []);
  useEffect(() => {
    const onReTweet = async () => {
      const querySnapshot = await getDocs(
        query(
          collection(db, "reTweets"),
          where("userId", "==", user.userId),
          where("tweetId", "==", tweet.id)
        )
      );
      const reTweetData = querySnapshot.docs.map((doc) => doc.id);
      if (isReTweet) {
        if (reTweetData.length === 0) {
          await addDoc(collection(db, "reTweets"), {
            tweetId: tweet.id,
            userId: user.userId,
            createdAt: Date.now(),
          });
        }
      } else {
        if (reTweetData.length > 0) {
          reTweetData.forEach(
            async (item) => await deleteDoc(doc(db, "reTweets", item))
          );
        }
      }
    };
    if (didMount.current) {
      onReTweet();
    } else {
      didMount.current = true;
    }
  }, [isReTweet]);
  useEffect(() => {
    const closePopup = (event) => {
      if (popupEl.current && !popupEl.current.contains(event.target)) {
        setToggles((prev) => ({ ...prev, popup: false }));
      }
    };
    window.addEventListener("mousedown", closePopup);
    return () => window.removeEventListener("mousedown", closePopup);
  }, [popupEl]);
  return (
    <div className={styles["inner-container"]}>
      <div className={styles["content-wrap"]}>
        {tweet.reTweet && (
          <div className={styles["content-header"]}>
            <FontAwesomeIcon icon={faRetweet} />
            <span>You reposted</span>
          </div>
        )}
        <div className={styles["content-main"]}>
          <div className={styles["content-main-sidebar"]}>
            <div className={styles["profile-photo"]}>
              {users[tweet.userId].userPhoto && (
                <img src={users[tweet.userId].userPhoto} alt="userPhoto" />
              )}
            </div>
          </div>
          <div className={styles["content-main-view"]}>
            <div className={styles["view-header"]}>
              <div className={styles["view-header-profile"]}>
                <div className={styles["profile-name"]}>
                  <span>{users[tweet.userId]?.userName}</span>
                  <span>@{users[tweet.userId]?.userEmail.split("@")[0]}</span>
                  <span>·</span>
                </div>
                <div className={styles["profile-date"]}>
                  <span>{formattedCreatedAt(tweet.createdAt)}</span>
                </div>
              </div>
              {tweet.userId === user.userId && (
                <div className={styles["view-header-button"]}>
                  {!toggles.popup && !toggles.editing && (
                    <div
                      className={styles["more-button"]}
                      onClick={(event) => onToggle("popup", event)}
                    >
                      <EllipsisIcon size={20} />
                    </div>
                  )}
                  {toggles.popup && (
                    <div className={styles["more-popup"]} ref={popupEl}>
                      <div className={styles["popup-container"]}>
                        <div
                          onClick={onDelete}
                          className={styles["popup-items"]}
                        >
                          <div>
                            <FontAwesomeIcon icon={faTrashCan} />
                          </div>
                          <div>
                            <span>Delete</span>
                          </div>
                        </div>
                        <div
                          onClick={(event) => {
                            onToggle("editing", event);
                            onToggle("popup", event);
                          }}
                          className={styles["popup-items"]}
                        >
                          <div>
                            <FontAwesomeIcon icon={faPenToSquare} />
                          </div>
                          <div>
                            <span>Edit</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            {toggles.editing ? (
              <div className={styles["edit-main"]}>
                <TweetEditForm
                  tweet={tweet}
                  toggles={toggles}
                  setToggles={setToggles}
                />
              </div>
            ) : (
              <>
                <div className={styles["view-main"]}>
                  <div className={styles["view-main-text"]}>
                    <p>{tweet.text}</p>
                    <div className={styles["view-main-photo"]}>
                      {tweet.photo && <img src={tweet.photo} alt="thumbnail" />}
                    </div>
                  </div>
                </div>
                <div className={styles["view-footer"]}>
                  <ul className={styles["view-footer-tab"]}>
                    <li
                      className={styles["tab-item"]}
                      onClick={() => setIsReplies((prev) => !prev)}
                    >
                      <div className={styles["tab-item-icon"]}>
                        <ChatIcon size={20} />
                      </div>
                      <div className={styles["tab-item-text"]}>
                        <span>{countReplies}</span>
                      </div>
                    </li>
                    <li
                      className={`${styles["tab-item"]} ${
                        styles["reTweet-button"]
                      } ${isReTweet && styles["active"]}`}
                      onClick={() => setIsReTweet((prev) => !prev)}
                      title="reTweet"
                    >
                      <div className={styles["tab-item-icon"]}>
                        <ReTweetIcon size={20} />
                      </div>
                      <div className={styles["tab-item-text"]}>
                        <span>{countReTweet}</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
        {isReplies && (
          <div className={styles["content-footer"]}>
            <TweetReply tweetId={tweet.id} tweetUserId={tweet.userId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Tweet;
