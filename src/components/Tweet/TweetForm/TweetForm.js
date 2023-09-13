import { useContext, useRef, useState } from "react";
import { db, storage } from "fbase";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./TweetForm.module.scss";
import { UserContext } from "components/App/App";
import { Spinner, XIcon } from "components/Svg/Svg";

const TweetForm = () => {
  const { user } = useContext(UserContext);
  const [tweet, setTweet] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInput = useRef();
  const onSubmit = async (event) => {
    event.preventDefault();
    if (!user || isLoading) return;
    try {
      setIsLoading(true);
      const doc = await addDoc(collection(db, "tweets"), {
        text: tweet,
        createdAt: Date.now(),
        userId: user.userId,
      });
      if (imgFile !== null) {
        const imgRef = ref(storage, `tweets/${user.userId}/${doc.id}`);
        const result = await uploadString(imgRef, imgFile, "data_url");
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, {
          photo: url,
        });
      }
      setTweet("");
      onClear();
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };
  const onChange = (event) => {
    setTweet(event.target.value);
  };
  const onFileChange = (event) => {
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      setImgFile(finishedEvent.currentTarget.result);
    };
    reader.readAsDataURL(event.target.files[0]);
  };
  const onClear = () => {
    setImgFile(null);
    fileInput.current.value = null;
  };
  return (
    <div className={styles["inner-container"]}>
      {isLoading && (
        <div className={styles["loader"]}>
          <Spinner color="rgb(29, 155, 240, 0.5)" />
        </div>
      )}
      <div className={styles["profile"]}>
        {user?.userPhoto && <img src={user.userPhoto} alt="userPhoto" />}
      </div>
      <form onSubmit={onSubmit}>
        <textarea
          className={styles["textarea"]}
          rows="4"
          maxLength={180}
          placeholder="What is happening?"
          onChange={onChange}
          value={tweet}
        ></textarea>
        <div className={styles["file-area"]}>
          {imgFile && (
            <>
              <div className={styles["file-remove-button"]} onClick={onClear}>
                <XIcon />
              </div>
              <div className={styles["file-thumb"]}>
                <img src={imgFile} alt="Thumbnail" />
              </div>
            </>
          )}
          <div className={styles["file-input"]}>
            <label
              htmlFor="file"
              className={`${(tweet || imgFile) && styles["active"]}`}
            >
              <FontAwesomeIcon icon={faImage} />
            </label>
            <input
              id="file"
              type="file"
              accept="image/*"
              onChange={onFileChange}
              ref={fileInput}
            />
            <input
              type="submit"
              className={`${!tweet && styles["dd"]} ${
                (tweet || imgFile) && styles["active"]
              }`}
              value="Post"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default TweetForm;
