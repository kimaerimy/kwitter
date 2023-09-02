import {
  db,
  doc,
  deleteDoc,
  updateDoc,
  storage,
  ref,
  deleteObject,
} from "fBase";
import { useState } from "react";
import styles from "./Kweet.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const Kweet = ({ kweetObj, isOwner, creatorProfiles }) => {
  const [editing, setEditing] = useState(false);
  const [newKweet, setNewKweet] = useState(kweetObj.text);
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
  return (
    <div className={styles["inner-container"]}>
      <div className={styles["kweet-view"]}>
        <div className={styles["creator-profile"]}>
          <span className={styles["photo"]}>
            <img src={creatorProfiles.userPhoto} alt="userPhoto" />
          </span>
          <div className={styles["info"]}>
            <span className={styles["name"]}>{creatorProfiles.userName}</span>
            <span className={styles["date"]}>
              {new Date(kweetObj.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className={styles["view"]}>
          {editing ? (
            <>
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
            </>
          ) : (
            <>
              <p>{kweetObj.text}</p>
              {kweetObj.attachmentUrl && (
                <img src={kweetObj.attachmentUrl} alt="thumbnail" />
              )}
              {isOwner && (
                <div className={styles["edit-area"]}>
                  <span className={styles["fas"]} onClick={onDelete}>
                    <FontAwesomeIcon icon={faTrashCan} />
                  </span>
                  <span className={styles["fas"]} onClick={toggleEditing}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Kweet;
