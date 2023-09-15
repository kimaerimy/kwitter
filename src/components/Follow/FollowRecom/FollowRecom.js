import { useContext, useEffect, useState } from "react";
import { db } from "fbase";
import {
  collection,
  documentId,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import styles from "./FollowRecom.module.scss";
import Follow from "components/Follow/Follow";
import { UserContext } from "components/App/App";

const FollowRecom = () => {
  const {
    userConnections: { following },
  } = useContext(UserContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const snapshot = await getDocs(
        query(collection(db, "users"), where(documentId(), "not-in", following), limit(3))
      );
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(docs);
    };
    getUsers();
  }, []);
  return (
    <>
      {users.length > 0 && (
        <div className={styles["inner-container"]}>
          <div className={styles["title"]}>
            <span>You might like</span>
          </div>
          {users?.map((user, idx) => (
            <Follow key={idx} user={user} />
          ))}
        </div>
      )}
    </>
  );
};

export default FollowRecom;
