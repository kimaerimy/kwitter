import styles from "./Svg.module.scss";

export const Logo = ({ color = "currentColor", size = "32" }) => {
  return (
    <div className={styles["inner-container"]}>
      <svg
        fill={color}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        width={`${size}px`}
        height={`${size}px`}
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
      </svg>
    </div>
  );
};
export const HomeIcon = ({
  color = "currentColor",
  size = "32",
  fill = "none",
}) => {
  return (
    <div className={styles["inner-container"]}>
      <svg
        fill={fill}
        stroke={color}
        strokeWidth={1.5}
        width={`${size}px`}
        height={`${size}px`}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z"></path>
        <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z"></path>
      </svg>
    </div>
  );
};

export const UserIcon = ({
  color = "currentColor",
  size = "32",
  fill = "none",
}) => {
  return (
    <div className={styles["inner-container"]}>
      <svg
        fill={fill}
        stroke={color}
        strokeWidth={1.5}
        color={color}
        width={`${size}px`}
        height={`${size}px`}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          clipRule="evenodd"
          fillRule="evenodd"
          d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
        />
      </svg>
    </div>
  );
};

export const MoreIcon = ({
  color = "currentColor",
  size = "32",
  fill = "none",
}) => {
  return (
    <div className={styles["inner-container"]}>
      <svg
        color={color}
        fill={fill}
        stroke={color}
        strokeWidth={1.5}
        width={`${size}px`}
        height={`${size}px`}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  );
};

export const SearchIcon = ({
  color = "currentColor",
  size = "32",
  fill = "none",
}) => {
  return (
    <div className={styles["inner-container"]}>
      <svg
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        width={`${size}px`}
        height={`${size}px`}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
    </div>
  );
};

export const XIcon = ({
  color = "currentColor",
  size = "32",
  fill = "none",
}) => {
  return (
    <div className={styles["inner-container"]}>
      <svg
        fill={fill}
        stroke={color}
        strokeWidth={1.5}
        width={`${size}px`}
        height={`${size}px`}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </div>
  );
};

export const ChatIcon = ({
  color = "currentColor",
  size = "32",
  fill = "none",
}) => {
  return (
    <div className={styles["inner-container"]}>
      <svg
        fill={fill}
        stroke={color}
        strokeWidth={1.5}
        width={`${size}px`}
        height={`${size}px`}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
        />
      </svg>
    </div>
  );
};

export const ReTweetIcon = ({
  color = "currentColor",
  size = "32",
  fill = "none",
}) => {
  return (
    <div className={styles["inner-container"]}>
      <svg
        fill={color}
        width={`${size}px`}
        height={`${size}px`}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          clipRule="evenodd"
          fillRule="evenodd"
          d="M12 5.25c1.213 0 2.415.046 3.605.135a3.256 3.256 0 013.01 3.01c.044.583.077 1.17.1 1.759L17.03 8.47a.75.75 0 10-1.06 1.06l3 3a.75.75 0 001.06 0l3-3a.75.75 0 00-1.06-1.06l-1.752 1.751c-.023-.65-.06-1.296-.108-1.939a4.756 4.756 0 00-4.392-4.392 49.422 49.422 0 00-7.436 0A4.756 4.756 0 003.89 8.282c-.017.224-.033.447-.046.672a.75.75 0 101.497.092c.013-.217.028-.434.044-.651a3.256 3.256 0 013.01-3.01c1.19-.09 2.392-.135 3.605-.135zm-6.97 6.22a.75.75 0 00-1.06 0l-3 3a.75.75 0 101.06 1.06l1.752-1.751c.023.65.06 1.296.108 1.939a4.756 4.756 0 004.392 4.392 49.413 49.413 0 007.436 0 4.756 4.756 0 004.392-4.392c.017-.223.032-.447.046-.672a.75.75 0 00-1.497-.092c-.013.217-.028.434-.044.651a3.256 3.256 0 01-3.01 3.01 47.953 47.953 0 01-7.21 0 3.256 3.256 0 01-3.01-3.01 47.759 47.759 0 01-.1-1.759L6.97 15.53a.75.75 0 001.06-1.06l-3-3z"
        />
      </svg>
    </div>
  );
};

export const ImageIcon = ({
  color = "currentColor",
  size = "32",
  fill = "none",
}) => {
  return (
    <div className={styles["inner-container"]}>
      <svg
        fill={color}
        width={`${size}px`}
        height={`${size}px`}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          clipRule="evenodd"
          fillRule="evenodd"
          d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
        />
      </svg>
    </div>
  );
};

export const EllipsisIcon = ({
  color = "currentColor",
  size = "32",
  fill = "none",
}) => {
  return (
    <div className={styles["inner-container"]}>
      <svg
        fill={color}
        width={`${size}px`}
        height={`${size}px`}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          clipRule="evenodd"
          fillRule="evenodd"
          d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
        />
      </svg>
    </div>
  );
};

export const FaceFrownIcon = ({ color = "currentColor", size = "32" }) => {
  return (
    <div className={styles["inner-container"]}>
      <svg
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        width={`${size}px`}
        height={`${size}px`}
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

export const Spinner = ({ color = "currentColor", size = 32 }) => {
  return (
    <div className={styles["inner-container"]}>
      <svg
        className={styles["spinner"]}
        viewBox={`0 0 ${size} ${size}`}
        width={`${size}px`}
        height={`${size}px`}
      >
        <circle
          className={styles["path"]}
          cx={`${size / 2}px`}
          cy={`${size / 2}px`}
          r={`${size / 2 - 2}px`}
          fill="none"
          strokeWidth="4"
          stroke={color}
        ></circle>
      </svg>
    </div>
  );
};
