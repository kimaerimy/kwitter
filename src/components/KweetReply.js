import styles from "./KweetReply.module.scss";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  db,
  onSnapshot,
  orderBy,
  query,
  where,
} from "fBase.js";

const KweetReply = ({ kweetId, uid, KweetCreatorId, kweetsProfiles }) => {
  const [reply, setReply] = useState("");
  const [replies, setReplies] = useState([]);
  const onReplyChange = (event) => {
    setReply(event.target.value);
  };
  const onReplySubmit = async (event) => {
    event.preventDefault();
    await addDoc(collection(db, "kweetReplies"), {
      createdAt: Date.now(),
      creatorId: uid,
      text: reply,
      kweetId: kweetId,
    });
    setReply("");
  };
  useEffect(() => {
    onSnapshot(
      query(
        collection(db, "kweetReplies"),
        where("kweetId", "==", kweetId),
        orderBy("createdAt", "asc")
      ),
      (snapshot) => {
        const repliesArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReplies(repliesArray);
      }
    );
  }, []);
  return (
    <div className={styles["container"]}>
      <div className={styles["content"]}>
        {KweetCreatorId !== uid && (
          <div className={styles["reply-submit"]}>
            <form onSubmit={onReplySubmit}>
              <input
                type="text"
                value={reply}
                onChange={onReplyChange}
                placeholder="댓글 달기..."
              />
              <input type="submit" value="Reply" />
            </form>
          </div>
        )}
        {replies?.map((reply, idx) => (
          <div className={styles["items"]} key={idx}>
            <span>
              {kweetsProfiles[reply.creatorId]?.userName}
            </span>
            <span>{reply.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KweetReply;
