import { Fragment } from "react";
import styles from "./TextHighlights.module.scss";

const TextHighlights = ({ text, searchText = "" }) => {
  return (
    <div className={styles["inner-container"]}>
      <span className={styles["text"]}>
        {text.split(searchText).map((part, idx) => (
          <Fragment key={idx}>
            {searchText && idx > 0 && (
              <span className={styles["searched-text"]}>{searchText}</span>
            )}
            {part}
          </Fragment>
        ))}
      </span>
    </div>
  );
};

export default TextHighlights;
