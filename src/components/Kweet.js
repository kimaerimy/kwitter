import {
  db,
  doc,
  deleteDoc,
  updateDoc,
  storage,
  ref,
  deleteObject,
  onSnapshot,
  query,
  collection,
  where,
  orderBy,
  addDoc,
  getDoc,
  getDocs,
} from "fBase";
import { useEffect, useRef, useState } from "react";
import styles from "./Kweet.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faPenToSquare,
  faEllipsisVertical,
  faRetweet,
} from "@fortawesome/free-solid-svg-icons";
import { faCommentDots } from "@fortawesome/free-regular-svg-icons";
import KweetReply from "./KweetReply";

const Kweet = ({ kweetObj, uid }) => {
  const [toggles, setToggles] = useState({ popup: false, editing: false });
  const [newKweet, setNewKweet] = useState(kweetObj.text);
  const [countReplies, setCountReplies] = useState(0);
  const [countRekweet, setCountRekweet] = useState(0);
  const [kweetsProfiles, setKweetsProfiles] = useState({});
  const [isReKweet, setIsReKweet] = useState(false);
  const didMount = useRef(false);
  const popupEl = useRef();
  const onDelete = async () => {
    if (window.confirm("Are you sure delete this kweet?")) {
      await deleteDoc(doc(db, "kweets", kweetObj.id));
      if (kweetObj.attachmentUrl) {
        await deleteObject(ref(storage, kweetObj.attachmentUrl));
      }
    }
  };
  const onToggle = (name, event) => {
    setToggles((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const onChange = (event) => {
    setNewKweet(event.target.value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(doc(db, "kweets", kweetObj.id), {
      text: newKweet,
    });
    onToggle("editing");
  };

  useEffect(() => {
    onSnapshot(
      query(
        collection(db, "kweetReplies"),
        where("kweetId", "==", kweetObj.id),
        orderBy("createdAt", "asc")
      ),
      (snapshot) => {
        setCountReplies(snapshot.docs.length);
      }
    );
    onSnapshot(query(collection(db, "users")), (snapshot) => {
      const profilesObject = {};
      snapshot.docs.forEach((doc) => {
        profilesObject[doc.id] = doc.data();
      });
      setKweetsProfiles(profilesObject);
    });
    onSnapshot(
      query(collection(db, "reKweets"), where("kweetId", "==", kweetObj.id)),
      (snapshot) => {
        const reKweetUsers = snapshot.docs.map((doc) => doc.data().creatorId);
        setCountRekweet(reKweetUsers.length);
        if (reKweetUsers.includes(uid)) {
          setIsReKweet(true);
        }
      }
    );
  }, []);
  useEffect(() => {
    const onReKweet = async () => {
      const querySnapshot = await getDocs(
        query(
          collection(db, "reKweets"),
          where("creatorId", "==", uid),
          where("kweetId", "==", kweetObj.id)
        )
      );
      const reKweetData = querySnapshot.docs.map((doc) => doc.id);
      if (isReKweet) {
        if (reKweetData.length === 0) {
          await addDoc(collection(db, "reKweets"), {
            kweetId: kweetObj.id,
            creatorId: uid,
            createdAt: Date.now(),
          });
        }
      } else {
        if (reKweetData.length > 0) {
          reKweetData.forEach(
            async (item) => await deleteDoc(doc(db, "reKweets", item))
          );
        }
      }
    };
    if (didMount.current) {
      onReKweet();
    } else {
      didMount.current = true;
    }
  }, [isReKweet]);
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
        {kweetObj.reKweet && (
          <div className={styles["badge"]}>
            <FontAwesomeIcon icon={faRetweet} />
            <span>You reposted</span>
          </div>
        )}
        {kweetsProfiles[kweetObj.creatorId] && (
          <div className={styles["profile"]}>
            <span className={styles["photo"]}>
              {kweetsProfiles[kweetObj.creatorId].userPhoto && (
                <img
                  src={kweetsProfiles[kweetObj.creatorId].userPhoto}
                  alt="userPhoto"
                />
              )}
            </span>
            <div className={styles["info"]}>
              <span className={styles["name"]}>
                {kweetsProfiles[kweetObj.creatorId].userName}
              </span>
              <span className={styles["date"]}>
                {new Date(kweetObj.createdAt).toLocaleDateString()}
              </span>
            </div>
            {kweetObj.creatorId === uid && (
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
                  value={newKweet}
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
                <p>{kweetObj.text}</p>
                {kweetObj.attachmentUrl && (
                  <img src={kweetObj.attachmentUrl} alt="thumbnail" />
                )}
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
                        isReKweet && styles["active"]
                      }`}
                      onClick={() => setIsReKweet((prev) => !prev)}
                      title="reKweet"
                    >
                      <FontAwesomeIcon icon={faRetweet} />
                    </span>
                    <span>{countRekweet}</span>
                  </li>
                </ul>
                <KweetReply
                  kweetId={kweetObj.id}
                  uid={uid}
                  KweetCreatorId={kweetObj.creatorId}
                  kweetsProfiles={kweetsProfiles}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Kweet;
