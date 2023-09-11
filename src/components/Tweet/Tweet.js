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
  updateDoc,
  where,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import styles from "./Tweet.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faPenToSquare,
  faEllipsisVertical,
  faRetweet,
} from "@fortawesome/free-solid-svg-icons";
import { faCommentDots } from "@fortawesome/free-regular-svg-icons";
import TweetReply from "components/Tweet/TweetReply/TweetReply";
import { UserContext } from "components/App/App";

const Tweet = ({ tweet }) => {
  const [toggles, setToggles] = useState({ popup: false, editing: false });
  const [newTweet, setNewTweet] = useState(tweet.text);
  const [countReplies, setCountReplies] = useState(0);
  const [countReTweet, setCountReTweet] = useState(0);
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
  const onChange = (event) => {
    setNewTweet(event.target.value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(doc(db, "tweets", tweet.id), {
      text: newTweet,
    });
    onToggle("editing");
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
      <div className={styles["items"]}>
        {tweet.reTweet && (
          <div className={styles["badge"]}>
            <FontAwesomeIcon icon={faRetweet} />
            <span>You reposted</span>
          </div>
        )}
        {users[tweet.userId] && (
          <div className={styles["profile"]}>
            <span className={styles["photo"]}>
              {users[tweet.userId].userPhoto && (
                <img src={users[tweet.userId].userPhoto} alt="userPhoto" />
              )}
            </span>
            <div className={styles["info"]}>
              <span className={styles["name"]}>
                {users[tweet.userId].userName}
              </span>
              <span className={styles["date"]}>
                {new Date(tweet.createdAt).toLocaleDateString()}
              </span>
            </div>
            {tweet.userId === user.userId && (
              <div className={styles["more"]}>
                {!toggles.popup && (
                  <div onClick={(event) => onToggle("popup", event)}>
                    <FontAwesomeIcon icon={faEllipsisVertical} />
                  </div>
                )}
                {toggles.popup && (
                  <div className={styles["more-popup"]} ref={popupEl}>
                    <div className={styles["popup-container"]}>
                      <div onClick={onDelete} className={styles["popup-items"]}>
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
        )}
        <div className={styles["content"]}>
          {toggles.editing ? (
            <div className={styles["edit"]}>
              <form onSubmit={onSubmit}>
                <textarea
                  rows="2"
                  value={newTweet}
                  onChange={onChange}
                  autoFocus
                ></textarea>
                <input type="submit" value="Update" />
              </form>
              <button onClick={() => onToggle("editing")}>Cancel</button>
            </div>
          ) : (
            <div className={styles["view"]}>
              <div className={styles["view-content"]}>
                <p>{tweet.text}</p>
                {tweet.photo && <img src={tweet.photo} alt="thumbnail" />}
              </div>
              <div className={styles["reply-container"]}>
                <ul className={styles["reply-tab"]}>
                  <li>
                    <FontAwesomeIcon icon={faCommentDots} />
                    <span>{countReplies}</span>
                  </li>
                  <li>
                    <span
                      className={`${styles["rekweet-btn"]} ${
                        isReTweet && styles["active"]
                      }`}
                      onClick={() => setIsReTweet((prev) => !prev)}
                      title="reTweet"
                    >
                      <FontAwesomeIcon icon={faRetweet} />
                    </span>
                    <span>{countReTweet}</span>
                  </li>
                </ul>
                <TweetReply tweetId={tweet.id} tweetUserId={tweet.userId} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tweet;
