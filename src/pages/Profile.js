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
  setDoc,
  doc,
  updateDoc,
  onSnapshot,
  documentId,
} from "fBase";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Profile.module.scss";
import Kweet from "components/Kweet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

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
  useEffect(() => {
    onSnapshot(
      query(
        collection(db, "reKweets"),
        where("creatorId", "==", userObj.uid),
        orderBy("createdAt", "desc")
      ),
      (snapshot) => {
        const reKweetArray = snapshot.docs.map((doc) => doc.data().kweetId);
        setReKweetIds(reKweetArray);
      }
    );
    onSnapshot(
      query(
        collection(db, "kweets"),
        where("creatorId", "==", userObj.uid),
        orderBy("createdAt", "desc")
      ),
      (snapshot) => {
        const kweetsArray = snapshot.docs.map((doc) => doc.id);
        setKweetIds(kweetsArray);
      }
    );
    getKweetProfiles();
  }, []);
  useEffect(() => {
    if (kweetIds.length > 0 || rekweetIds.length > 0) {
      const set = new Set([...kweetIds, ...rekweetIds]);
      onSnapshot(
        query(collection(db, "kweets"), where(documentId(), "in", [...set])),
        (snapshot) => {
          const kweetArray = snapshot.docs.map((doc) => ({
            id: doc.id,
            reKweet: doc.data().creatorId === userObj.uid ? false : true,
            ...doc.data(),
          }));
          setKweets(kweetArray);
        }
      );
    }
  }, [kweetIds, rekweetIds]);
  return (
    <div className={styles["inner-container"]}>
      <h2>{nickname}</h2>
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
          <p>
            <span>{nickname}</span>@{userObj.userEmail}
          </p>
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
        <div className={styles["tab-items"]}>
          <span>Posts</span>
          <div></div>
        </div>
      </div>
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
      <button onClick={onLogOut}>Log Out</button>
    </div>
  );
};

export default Profile;
