import { useContext, useEffect } from "react";
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

const Navigation = () => {
  const { user } = useContext(UserContext);
  const location = useLocation().pathname.split("/")[1];
  const navigate = useNavigate();
  const onLogOut = () => {
    signOut(auth);
    navigate("/");
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
            <li className={styles["nav-item"]}>
              <Link>
                <div className={styles["item-box"]}>
                  <MoreIcon
                    fill={location === "More" ? `currentColor` : `none`}
                  />
                  <div>
                    <span>Menu3</span>
                  </div>
                </div>
              </Link>
            </li>
          </ul>
          {user && (
            <div className={styles["profile-wrap"]}>
              <div className={styles["profile-info"]}>
                <div className={styles["profile-photo"]}>
                  <img src={user.userPhoto} alt="userPhoto" />
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
