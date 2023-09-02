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
} from "fBase";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Profile.module.scss";

const Profile = ({ userObj, refreshUser }) => {
  const [displayName, setDisplayName] = useState(userObj.displayName);
  const [displayPhoto, setDisplayPhoto] = useState(userObj.photoURL);
  const navigate = useNavigate();
  const onLogOut = () => {
    signOut(auth);
    navigate("/");
  };
  const getMyKweets = async () => {
    const kweets = await getDocs(
      query(
        collection(db, "kweets"),
        where("creatorId", "==", userObj.uid),
        orderBy("createdAt", "desc")
      )
    );
    const test = kweets.docs.map((doc) => doc.data());
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    let photoURL = "";
    if (displayPhoto !== null) {
      const imgRef = ref(storage, `photoURL/${userObj.uid}}`);
      const response = await uploadString(imgRef, displayPhoto, "data_url");
      photoURL = await getDownloadURL(response.ref);
    }
    await updateProfile(userObj, {
      displayName,
      photoURL,
    });
    refreshUser();
  };
  const onNameChange = (event) => {
    setDisplayName(event.target.value);
  };
  const onFileUpload = (event) => {
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      setDisplayPhoto(finishedEvent.currentTarget.result);
    };
    reader.readAsDataURL(event.target.files[0]);
  };
  useEffect(() => {
    getMyKweets();
  }, []);
  return (
    <>
      <h2>{userObj.displayName ?? userObj.email}'s Profile</h2>
      <form onSubmit={onSubmit}>
        <label htmlFor="displayName">Name</label>
        <input
          type="text"
          value={displayName}
          onChange={onNameChange}
          id="displayName"
        />
        <div>
          <label htmlFor="photoURL">ProfilePhoto</label>
          <br />
          <input type="file" onChange={onFileUpload} />
          {displayPhoto && (
            <img
              src={displayPhoto}
              alt="displayPhoto"
              id="photoURL"
              style={{ width: "100px", height: "100px" }}
            />
          )}
        </div>
        <input type="submit" value="Edit Profile" />
      </form>
      <hr />
      <br />
      <br />
      <button onClick={onLogOut}>Log Out</button>
    </>
  );
};

export default Profile;
