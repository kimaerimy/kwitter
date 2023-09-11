import styles from "./Svg.module.scss";

export const Logo = ({ color = "currentColor", size = "1" }) => {
  return (
    <div className={styles["inner-container"]}>
      <svg
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        width={`${size}rem`}
        height={`${size}rem`}
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
      </svg>
    </div>
  );
};

export const FaceFrownIcon = ({ color = "currentColor", size = "1" }) => {
  return (
    <div className={styles["inner-container"]}>
      <svg
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        width={`${size}rem`}
        height={`${size}rem`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
        />
      </svg>
    </div>
  );
};

export const Spinner = ({ color = "currentColor", size = 2 }) => {
  const px = size * 16;
  return (
    <div className={styles["inner-container"]}>
      <svg
        className={styles["spinner"]}
        viewBox={`0 0 ${px} ${px}`}
        width={`${size}rem`}
        height={`${size}rem`}
      >
        <circle
          className={styles["path"]}
          cx={`${px / 2}px`}
          cy={`${px / 2}px`}
          r={`${px / 2 - 2}px`}
          fill="none"
          strokeWidth="4"
          stroke={color}
        ></circle>
      </svg>
    </div>
  );
};
