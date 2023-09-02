import {
  db,
  collection,
  addDoc,
  storage,
  ref,
  uploadString,
  getDownloadURL,
} from "fBase";
import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "./KweetWrite.module.scss";

const KweetFactory = ({ userObj }) => {
  const [kweet, setKweet] = useState("");
  const [attachment, setAttachment] = useState(null);
  const fileInput = useRef();

  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== null) {
      const imgRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(imgRef, attachment, "data_url");
      attachmentUrl = await getDownloadURL(response.ref);
    }
    await addDoc(collection(db, "kweets"), {
      text: kweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    });
    setKweet("");
    onClear();
  };
  const onChange = (event) => {
    setKweet(event.target.value);
  };
  const onFileChange = (event) => {
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      setAttachment(finishedEvent.currentTarget.result);
    };
    reader.readAsDataURL(event.target.files[0]);
  };
  const onClear = () => {
    setAttachment(null);
    fileInput.current.value = null;
  };
  return (
    <div className={styles["inner-container"]}>
      <form onSubmit={onSubmit}>
        <textarea
          className={styles["textarea"]}
          rows="5"
          maxLength={100}
          placeholder="What is happening?"
          onChange={onChange}
          value={kweet}
        ></textarea>
        <div className={styles["file-area"]}>
          {attachment && (
            <div className={styles["file-thumb"]}>
              <img src={attachment} alt="Thumbnail" />
              <button onClick={onClear}>X</button>
            </div>
          )}
          <div className={styles["file-input"]}>
            <label htmlFor="file">첨부</label>
            <input
              id="file"
              type="file"
              accept="image/*"
              onChange={onFileChange}
              ref={fileInput}
            />
            <input
              type="submit"
              className={`${!kweet && styles["dd"]}`}
              value="Post"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default KweetFactory;
