import React, { useContext, useEffect, useState } from "react";
import { auth, db, storage } from "fbase";
import { updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  documentId,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import styles from "./Profile.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import Tweet from "components/Tweet/Tweet";
import Follow from "components/Follow/Follow";
import { faFaceSadTear } from "@fortawesome/free-regular-svg-icons";
import { UserContext } from "components/App/App";
import EmptyContent from "components/EmptyContent/EmptyContent";

const Profile = () => {
  const { user, setUser, userConnections, setUserConnections } =
    useContext(UserContext);
  const [inputs, setInputs] = useState({
    nickname: user.userName,
    photo: user.userPhoto,
    bg: user.userBg,
  });
  const { nickname, photo, bg } = inputs;
  const [isEditing, setIsEditing] = useState(false);
  const [tweets, setTweets] = useState([]);
  const [editDiv, setEditDiv] = useState(false);
  const [tweetIds, setTweetIds] = useState([]);
  const [reTweetIds, setReTweetIds] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);

  const getFollowing = async () => {
    if (user.follow.length === 0) return;
    const snapshot = await getDocs(
      query(
        collection(db, "users"),
        where(documentId(), "in", [...user.follow])
      )
    );
    const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setFollowing(docs);
  };
  const getFollowers = async () => {
    const snapshot = await getDocs(
      query(
        collection(db, "users"),
        where("follow", "array-contains", user.userId)
      )
    );
    const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setFollowers(docs);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    let photoURL = user.userPhoto ?? "",
      userBg = user.userBg ?? "";
    if (photo && photo !== user.userPhoto) {
      const imgRef = ref(storage, `userPhoto/${user.userId}}`);
      const response = await uploadString(imgRef, photo, "data_url");
      photoURL = await getDownloadURL(response.ref);
    }
    if (bg && bg !== user.userBg) {
      const bgRef = ref(storage, `userBg/${user.uid}}`);
      const response2 = await uploadString(bgRef, bg, "data_url");
      userBg = await getDownloadURL(response2.ref);
    }
    await updateProfile(auth.currentUser, {
      displayName: nickname,
      photoURL,
    });
    await updateDoc(doc(db, "users", user.userId), {
      userName: nickname,
      userPhoto: photoURL,
      userBg,
    });
    setUser({
      ...user,
      userName: nickname,
      userPhoto: photoURL,
      userBg,
    });
    setUserConnections({
      ...userConnections,
      users: {
        ...userConnections.users,
        [user.userId]: {
          ...userConnections.users[user.userId],
          userName: nickname,
          userPhoto: photoURL,
          userBg,
        },
      },
    });
    setIsEditing(false);
  };
  const onNameChange = (event) => {
    setInputs({ ...inputs, nickname: event.target.value });
  };
  const onFileUpload = (event) => {
    const { name, files } = event.target;
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      setInputs({ ...inputs, [name]: finishedEvent.currentTarget.result });
    };
    reader.readAsDataURL(files[0]);
  };
  const onTabClick = (index) => {
    setTabIndex(index);
  };
  useEffect(() => {
    getFollowers();
    getFollowing();
    const reTweetSnapshot = onSnapshot(
      query(
        collection(db, "reTweets"),
        where("userId", "==", user.userId),
        orderBy("createdAt", "desc")
      ),
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => doc.data().tweetId);
        setReTweetIds(docs);
      }
    );
    const tweetSnapshot = onSnapshot(
      query(
        collection(db, "tweets"),
        where("userId", "==", user.userId),
        orderBy("createdAt", "desc")
      ),
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => doc.id);
        setTweetIds(docs);
      }
    );

    return () => {
      reTweetSnapshot();
      tweetSnapshot();
    };
  }, [getFollowers, getFollowing]);
  useEffect(() => {
    if (tweetIds.length > 0 || reTweetIds.length > 0) {
      onSnapshot(
        query(
          collection(db, "tweets"),
          where(documentId(), "in", [
            ...(tweetIds ?? []),
            ...(reTweetIds ?? []),
          ])
        ),
        (snapshot) => {
          const docs = snapshot.docs.map((doc) => ({
            id: doc.id,
            reTweet: doc.data().userId === user.userId ? false : true,
            ...doc.data(),
          }));
          docs.sort((a, b) => b.createdAt - a.createdAt);
          setTweets(docs);
        }
      );
    }
  }, [tweetIds, reTweetIds]);
  return (
    <div className={styles["inner-container"]}>
      <h3>{nickname}</h3>
      <div className={styles["profile-area"]}>
        <div className={styles["profile-bg"]}>
          {user.userBg && <img src={user.userBg} alt="userBg" />}
        </div>
        <div className={styles["profile-thumb"]}>
          <div className={styles["image-container"]}>
            <div className={styles["profile-image"]}>
              {user.userPhoto && <img src={user.userPhoto} alt="userPhoto" />}
            </div>
          </div>
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>
        <div className={styles["profile-content"]}>
          <div className={styles["name"]}>
            <span>{nickname}</span>{user.userEmail}
          </div>
          <div className={styles["follow"]}>
            <div>
              <span>{following?.length}</span> Following
            </div>
            <div>
              <span>{followers?.length}</span> Followers
            </div>
          </div>
        </div>
      </div>
      {isEditing && (
        <div className={styles["edit-area"]}>
          <form onSubmit={onSubmit}>
            <div className={styles["input-bg"]}>
              <input
                type="file"
                onChange={onFileUpload}
                id="bg-upload"
                name="bg"
              />
              <div className={styles["bg-upload"]}>
                <label htmlFor="bg-upload">
                  <FontAwesomeIcon icon={faCamera} size="xl" inverse />
                </label>
                {bg && <img src={bg} alt="userBg" />}
              </div>
            </div>
            <div className={styles["input-photo"]}>
              <input
                type="file"
                onChange={onFileUpload}
                id="photo-upload"
                name="photo"
              />
              <div className={styles["photo-upload"]}>
                <label htmlFor="photo-upload">
                  <FontAwesomeIcon icon={faCamera} size="xl" inverse />
                </label>
                {photo && <img src={photo} alt="photoURL" />}
              </div>
            </div>
            <div
              className={`${styles["input-text"]} ${
                editDiv && styles["active"]
              }`}
            >
              <div>
                <span>Name</span>
              </div>
              <input
                type="text"
                value={nickname}
                onChange={onNameChange}
                onFocus={() => setEditDiv(true)}
                onBlur={() => setEditDiv(false)}
              />
            </div>
            <input type="submit" value="Save" />
            <button
              className={styles["cancel-btn"]}
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
      <div className={styles["tab-area"]}>
        <div
          className={`${styles["tab-items"]} ${
            tabIndex === 0 && styles["active"]
          }`}
          onClick={() => onTabClick(0)}
        >
          <div className={styles["item-wrap"]}>
            <span>Posts</span>
            <div></div>
          </div>
        </div>
        <div
          className={`${styles["tab-items"]} ${
            tabIndex === 1 && styles["active"]
          }`}
          onClick={() => onTabClick(1)}
        >
          <div className={styles["item-wrap"]}>
            <span>Following</span>
            <div></div>
          </div>
        </div>
        <div
          className={`${styles["tab-items"]} ${
            tabIndex === 2 && styles["active"]
          }`}
          onClick={() => onTabClick(2)}
        >
          <div className={styles["item-wrap"]}>
            <span>Followers</span>
            <div></div>
          </div>
        </div>
      </div>
      <div className={styles["tab-content"]}>
        {tabIndex === 0 && (
          <div className={styles["kweet-area"]}>
            {tweets.map((tweet) => (
              <Tweet key={tweet.id} tweet={tweet} />
            ))}
          </div>
        )}
        {tabIndex === 1 && (
          <>
            {following?.map((user, idx) => (
              <Follow key={idx} user={user} />
            ))}
          </>
        )}
        {tabIndex === 2 && (
          <>
            {followers.length > 0 ? (
              <>
                {followers?.map((user, idx) => (
                  <Follow key={idx} user={user} />
                ))}
              </>
            ) : (
              <EmptyContent text={`No Followers....`} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
