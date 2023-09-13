import { db, storage } from "fbase";
import { doc, updateDoc } from "firebase/firestore";
import styles from "./TweetEditForm.module.scss";
import { ImageIcon, Spinner, XIcon } from "components/Svg/Svg";
import { useContext, useRef, useState } from "react";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { UserContext } from "components/App/App";

const TweetEditForm = ({ tweet, toggles, setToggles }) => {
  const [imgFile, setImgFile] = useState(tweet.photo ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const [newTweet, setNewTweet] = useState(tweet.text);
  const editFileInput = useRef();
  const { user } = useContext(UserContext);
  const onChange = (event) => {
    setNewTweet(event.target.value);
  };
  const onToggle = (name, event) => {
    setToggles((prev) => ({ ...prev, [name]: !prev[name] }));
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (!user || isLoading) return;
    try {
      setIsLoading(true);
      await updateDoc(doc(db, "tweets", tweet.id), {
        text: newTweet,
      });
      if (imgFile !== tweet.photo) {
        if (imgFile !== null) {
          const imgRef = ref(storage, `tweets/${user.userId}/${tweet.id}`);
          const result = await uploadString(imgRef, imgFile, "data_url");
          const url = await getDownloadURL(result.ref);
          await updateDoc(doc(db, "tweets", tweet.id), {
            photo: url,
          });
        } else {
          await updateDoc(doc(db, "tweets", tweet.id), {
            photo: "",
          });
        }
      }
      setNewTweet("");
      onClear();
      onToggle("editing");
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
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
    editFileInput.current.value = null;
  };
  return (
    <div className={styles["inner-container"]}>
      {isLoading && (
        <div className={styles["loader"]}>
          <Spinner color="rgb(29, 155, 240, 0.5)" />
        </div>
      )}
      <form onSubmit={onSubmit}>
        <textarea
          rows="2"
          maxLength={180}
          value={newTweet}
          onChange={onChange}
          autoFocus
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
        </div>
        <div className={styles["file-input"]}>
          <div className={styles["input-area"]}>
            <label
              htmlFor="editfile"
              className={`${imgFile && styles["active"]}`}
            >
              <div className={styles["image-icon"]}>
                <ImageIcon size={20} />
              </div>
            </label>
            <input
              id="editfile"
              type="file"
              accept="image/*"
              onChange={onFileChange}
              ref={editFileInput}
            />
          </div>
          <div className={styles["button-area"]}>
            <input
              type="button"
              className={styles["cancel-button"]}
              value="Cancel"
              onClick={() => onToggle("editing")}
            />
            <input
              type="submit"
              className={`${(tweet || imgFile) && styles["active"]} ${
                styles["submit-button"]
              }`}
              value="Update"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default TweetEditForm;
