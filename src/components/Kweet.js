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
} from "fBase";
import { useEffect, useState } from "react";
import styles from "./Kweet.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faPenToSquare,
  faEllipsisVertical,
  faReply,
} from "@fortawesome/free-solid-svg-icons";
import { faCommentDots } from "@fortawesome/free-regular-svg-icons";
import KweetReply from "./KweetReply";

const Kweet = ({ kweetObj, uid }) => {
  const [editing, setEditing] = useState(false);
  const [newKweet, setNewKweet] = useState(kweetObj.text);
  const [countReplies, setCountReplies] = useState(0);
  const [kweetsProfiles, setKweetsProfiles] = useState({});
  const creatorProfiles = kweetsProfiles[kweetObj.creatorId];
  const onDelete = async () => {
    if (window.confirm("Are you sure delete this kweet?")) {
      await deleteDoc(doc(db, "kweets", kweetObj.id));
      if (kweetObj.attachmentUrl) {
        await deleteObject(ref(storage, kweetObj.attachmentUrl));
      }
    }
  };
  const toggleEditing = () => {
    setEditing((prev) => {
      if (prev) {
      }
      return !prev;
    });
  };
  const onChange = (event) => {
    setNewKweet(event.target.value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(doc(db, "kweets", kweetObj.id), {
      text: newKweet,
    });
    setEditing(false);
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
  }, []);
  return (
    <div className={styles["inner-container"]}>
      <div className={styles["items"]}>
        {creatorProfiles && (
          <div className={styles["kweet-profile"]}>
            <span className={styles["photo"]}>
              {creatorProfiles.userPhoto && (
                <img src={creatorProfiles.userPhoto} alt="userPhoto" />
              )}
            </span>
            <div className={styles["info"]}>
              <span className={styles["name"]}>{creatorProfiles.userName}</span>
              <span className={styles["date"]}>
                {new Date(kweetObj.createdAt).toLocaleDateString()}
              </span>
            </div>
            {kweetObj.creatorId === uid && (
              <div className={styles["more"]}>
                <div>
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </div>
                <div className={styles["more-popup"]}>
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
                      onClick={toggleEditing}
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
              </div>
            )}
          </div>
        )}
        <div className={styles["kweet-content"]}>
          {editing ? (
            <div className={styles["kweet-edit"]}>
              <form onSubmit={onSubmit}>
                <textarea
                  rows="2"
                  value={newKweet}
                  onChange={onChange}
                  autoFocus
                ></textarea>
                <input type="submit" value="Update" />
              </form>
              <button onClick={toggleEditing}>Cancel</button>
            </div>
          ) : (
            <div className={styles["kweet-view"]}>
              <div className={styles["kweet-view-content"]}>
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
                    <FontAwesomeIcon icon={faReply} />
                    <span>0</span>
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
