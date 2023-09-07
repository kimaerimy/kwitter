import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import styles from "./Navigation.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouseChimney,
  faHouseUser,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { faUser as faUserRegular } from "@fortawesome/free-regular-svg-icons";
import { auth, signOut } from "fBase";

const Navigation = ({ userObj }) => {
  const location = useLocation().pathname.split("/")[1];
  const navigate = useNavigate();
  const onLogOut = () => {
    signOut(auth);
    navigate("/");
  };
  return (
    <div className={styles["inner-container"]}>
      <nav>
        <ul>
          <li>
            <div>
              <svg viewBox="0 0 24 24">
                <g>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </g>
              </svg>
            </div>
          </li>
          <li className={`${location === "" && styles["active"]}`}>
            <Link to="/">
              <span>
                <i>
                  <FontAwesomeIcon icon={faHouseChimney} />
                </i>
              </span>
              <span>Home</span>
            </Link>
          </li>
          <li className={`${location === "Profile" && styles["active"]}`}>
            <Link to="/Profile">
              <span>
                <i>
                  <FontAwesomeIcon icon={faUserRegular} />
                </i>
              </span>
              <span>Profile</span>
            </Link>
          </li>
        </ul>
        <div className={styles["profile-wrap"]}>
          <div className={styles["info"]}>
            <div className={styles["photo"]}>
              <img src={userObj.userPhoto} alt="userPhoto" />
            </div>
            <div className={styles["info-detail"]}>
              <div>
                <span>{userObj.userName}</span>
              </div>
              <div>
                <span>@{userObj.userEmail.split("@")[0]}</span>
              </div>
            </div>
          </div>
          <div className={styles["logout-btn"]}>
            <button onClick={onLogOut}>LogOut</button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
