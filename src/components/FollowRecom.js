import { useEffect, useState } from "react";
import styles from "./FollowRecom.module.scss";
import { collection, db, documentId, getDocs, query, where } from "fBase";
import Follow from "components/Follow";

const FollowRecom = ({ userObj }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const following = [...userObj.follow, userObj.uid];
      const list = await getDocs(
        query(collection(db, "users"), where(documentId(), "not-in", following))
      );
      const listArray = list.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(listArray);
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
            <Follow user={user} userObj={userObj} key={idx} />
          ))}
        </div>
      )}
    </>
  );
};

export default FollowRecom;
