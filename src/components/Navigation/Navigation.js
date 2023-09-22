import { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "fbase";
import { signOut } from "firebase/auth";
import styles from "./Navigation.module.scss";
import { UserContext } from "components/App/App";
import {
  HomeIcon,
  Logo,
  MoreIcon,
  SearchIcon,
  UserIcon,
} from "components/Svg/Svg";

const Navigation = ({ isMobile }) => {
  const { user } = useContext(UserContext);
  const [isHover, setIsHover] = useState(false);
  const location = useLocation().pathname.split("/")[1];
  const navigate = useNavigate();
  const popupEl = useRef();
  const onLogOut = () => {
    signOut(auth);
    navigate("/");
  };
  const onPopup = () => {
    setIsHover((prev) => !prev);
  };
  return (
    <header className={styles["inner-container"]}>
      <div className={styles["nav-wrap"]}>
        <nav>
          <ul>
            <li className={styles["nav-item"]}>
              <Link to="/">
                <div className={styles["item-box"]}>
                  <Logo size={32} />
                </div>
              </Link>
            </li>
            <li
              className={`${styles["nav-item"]} ${
                location === "" && styles["active"]
              }`}
            >
              <Link to="/">
                <div className={styles["item-box"]}>
                  <HomeIcon fill={location === "" ? `currentColor` : `none`} />
                  <div>
                    <span>Home</span>
                  </div>
                </div>
              </Link>
            </li>
            <li className={styles["nav-item"]}>
              <Link to="/Search">
                <div className={styles["item-box"]}>
                  <SearchIcon
                    fill={location === "Search" ? `currentColor` : `none`}
                  />
                  <div>
                    <span>Search</span>
                  </div>
                </div>
              </Link>
            </li>
            <li
              className={`${styles["nav-item"]} ${
                location === "Profile" && styles["active"]
              }`}
            >
              <Link to="/Profile">
                <div className={styles["item-box"]}>
                  <UserIcon
                    fill={location === "Profile" ? `currentColor` : `none`}
                  />
                  <div>
                    <span>Profile</span>
                  </div>
                </div>
              </Link>
            </li>
            {isMobile && (
              <li className={styles["nav-item"]}>
                <a href="#;" onClick={onPopup}>
                  <div className={styles["item-box"]}>
                    <div className={styles["profile-photo"]}>
                      {user?.userPhoto && (
                        <img src={user.userPhoto} alt="userPhoto" />
                      )}
                    </div>
                    <div>
                      <span>SignOut</span>
                    </div>
                  </div>
                  <div
                    className={`${styles["item-popup"]} ${
                      isHover && styles["active"]
                    }`}
                  >
                    <div className={styles["profile-logout"]}>
                      <button onClick={onLogOut}>LogOut</button>
                    </div>
                  </div>
                </a>
              </li>
            )}
          </ul>
          {user && (
            <div className={styles["profile-wrap"]}>
              <div className={styles["profile-info"]}>
                <div className={styles["profile-photo"]}>
                  {user.userPhoto && (
                    <img src={user.userPhoto} alt="userPhoto" />
                  )}
                </div>
                <div className={styles["profile-info-detail"]}>
                  <div>
                    <span>{user.userName}</span>
                  </div>
                  <div>
                    <span>@{user.userEmail.split("@")[0]}</span>
                  </div>
                </div>
              </div>
              <div className={styles["profile-logout"]}>
                <button onClick={onLogOut}>LogOut</button>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
