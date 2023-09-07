import {
  auth,
  signOut,
  db,
  query,
  getDocs,
  orderBy,
  collection,
  where,
  updateProfile,
  storage,
  ref,
  uploadString,
  getDownloadURL,
  doc,
  updateDoc,
  onSnapshot,
  documentId,
} from "fBase";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Profile.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import Kweet from "components/Kweet";
import Follow from "components/Follow";
import { faFaceSadTear } from "@fortawesome/free-regular-svg-icons";

const Profile = ({ userObj, refreshUser }) => {
  const [inputs, setInputs] = useState({
    nickname: userObj.displayName,
    photo: userObj.userPhoto,
    bg: userObj.userBg,
  });
  const { nickname, photo, bg } = inputs;
  const [isEditing, setIsEditing] = useState(false);
  const [kweets, setKweets] = useState([]);
  const [editDiv, setEditDiv] = useState(false);
  const [kweetsProfiles, setKweetsProfiles] = useState({});
  const [kweetIds, setKweetIds] = useState([]);
  const [rekweetIds, setReKweetIds] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const navigate = useNavigate();
  const onLogOut = () => {
    signOut(auth);
    navigate("/");
  };
  const getKweetProfiles = async () => {
    const profiles = await getDocs(collection(db, "users"));
    const profilesObject = {};
    profiles.docs.forEach((doc) => {
      profilesObject[doc.id] = doc.data();
    });
    setKweetsProfiles(profilesObject);
  };
  const getFollowing = async () => {
    if (userObj.follow.length === 0) return;
    const snapshot = await getDocs(
      query(
        collection(db, "users"),
        where(documentId(), "in", [...userObj.follow])
      )
    );
    const docsArr = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setFollowing(docsArr);
  };
  const getFollowers = async () => {
    const snapshot = await getDocs(
      query(
        collection(db, "users"),
        where("follow", "array-contains", userObj.uid)
      )
    );
    const docsArr = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setFollowers(docsArr);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    let photoURL = userObj.userPhoto ?? "",
      userBg = userObj.userBg ?? "";
    if (photo && photo !== userObj.userPhoto) {
      const imgRef = ref(storage, `photoURL/${userObj.uid}}`);
      const response = await uploadString(imgRef, photo, "data_url");
      photoURL = await getDownloadURL(response.ref);
    }
    if (bg && bg !== userObj.userBg) {
      const bgRef = ref(storage, `userBg/${userObj.uid}}`);
      const response2 = await uploadString(bgRef, bg, "data_url");
      userBg = await getDownloadURL(response2.ref);
    }
    await updateProfile(userObj.user, {
      displayName: nickname,
      photoURL,
    });
    await updateDoc(doc(db, "users", userObj.uid), {
      userName: nickname,
      userPhoto: photoURL,
      userBg,
    });

    refreshUser();
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
    onSnapshot(
      query(
        collection(db, "reKweets"),
        where("creatorId", "==", userObj.uid),
        orderBy("createdAt", "desc")
      ),
      (snapshot) => {
        const docsArr = snapshot.docs.map((doc) => doc.data().kweetId);
        setReKweetIds(docsArr);
      }
    );
    onSnapshot(
      query(
        collection(db, "kweets"),
        where("creatorId", "==", userObj.uid),
        orderBy("createdAt", "desc")
      ),
      (snapshot) => {
        const docsArr = snapshot.docs.map((doc) => doc.id);
        setKweetIds(docsArr);
      }
    );
    getKweetProfiles();
    getFollowers();
    getFollowing();
  }, []);
  useEffect(() => {
    if (kweetIds.length > 0 || rekweetIds.length > 0) {
      const set = new Set([...kweetIds, ...rekweetIds]);
      onSnapshot(
        query(collection(db, "kweets"), where(documentId(), "in", [...set])),
        (snapshot) => {
          const docsArr = snapshot.docs.map((doc) => ({
            id: doc.id,
            reKweet: doc.data().creatorId === userObj.uid ? false : true,
            ...doc.data(),
          }));
          docsArr.sort((a, b) => b.createdAt - a.createdAt);
          setKweets(docsArr);
        }
      );
    }
  }, [kweetIds, rekweetIds]);
  return (
    <div className={styles["inner-container"]}>
      <h3>{nickname}</h3>
      <div className={styles["profile-area"]}>
        <div className={styles["profile-bg"]}>
          {userObj.userBg && <img src={userObj.userBg} alt="userBg" />}
        </div>
        <div className={styles["profile-thumb"]}>
          <div className={styles["image-container"]}>
            <div className={styles["profile-image"]}>
              {userObj.userPhoto && (
                <img src={userObj.userPhoto} alt="userPhoto" />
              )}
            </div>
          </div>
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>
        <div className={styles["profile-content"]}>
          <div className={styles["name"]}>
            <span>{nickname}</span>@{userObj.userEmail}
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
            {kweets.map((kweet) => (
              <Kweet
                key={kweet.id}
                kweetObj={kweet}
                uid={userObj.uid}
                creatorProfiles={kweetsProfiles[kweet.creatorId]}
              />
            ))}
          </div>
        )}
        {tabIndex === 1 && (
          <>
            {following?.map((user, idx) => (
              <Follow
                user={user}
                userObj={userObj}
                key={idx}
                refreshUser={refreshUser}
              />
            ))}
          </>
        )}
        {tabIndex === 2 && (
          <>
            {followers.length > 0 ? (
              <>
                {followers?.map((user, idx) => (
                  <Follow
                    user={user}
                    userObj={userObj}
                    key={idx}
                    refreshUser={refreshUser}
                  />
                ))}
              </>
            ) : (
              <>
                <div className={styles["null-container"]}>
                  <div className={styles["bg"]}>
                    <FontAwesomeIcon icon={faFaceSadTear} size="2xl" />
                  </div>
                  <div className={styles["comment"]}>
                    <span>No Followers...</span>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
      <button onClick={onLogOut}>Log Out</button>
    </div>
  );
};

export default Profile;
