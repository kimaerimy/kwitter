import { useContext, useEffect, useState } from "react";
import { db } from "fbase";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import styles from "./TweetReply.module.scss";
import { UserContext } from "components/App/App";

const TweetReply = ({ tweetId, tweetUserId }) => {
  const [reply, setReply] = useState("");
  const [replies, setReplies] = useState([]);
  const {
    user,
    userConnections: { users },
  } = useContext(UserContext);
  const onReplyChange = (event) => {
    setReply(event.target.value);
  };
  const onReplySubmit = async (event) => {
    event.preventDefault();
    await addDoc(collection(db, "tweetReplies"), {
      createdAt: Date.now(),
      userId: user.userId,
      text: reply,
      tweetId: tweetId,
    });
    setReply("");
  };
  useEffect(() => {
    const tweetRepliesSnapshot = onSnapshot(
      query(
        collection(db, "tweetReplies"),
        where("tweetId", "==", tweetId),
        orderBy("createdAt", "asc")
      ),
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReplies(docs);
      }
    );
    return () => {
      tweetRepliesSnapshot();
    };
  }, []);
  return (
    <div className={styles["inner-container"]}>
      <div className={styles["content"]}>
        {tweetUserId !== user.userId && (
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
            <span>{users[reply.userId]?.userName}</span>
            <span>{reply.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TweetReply;
