import { Link, useLocation } from "react-router-dom";
import styles from "./Navigation.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouseChimney, faHouseUser, faUser } from "@fortawesome/free-solid-svg-icons";
import { faUser as faUserRegular } from "@fortawesome/free-regular-svg-icons";

const Navigation = ({ userObj }) => {
  const location = useLocation().pathname.split("/")[1];
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
          <li>
            <Link to="/">
              <span>
                <i>
                  <FontAwesomeIcon icon={location === "" ? faHouseUser : faHouseChimney} />
                </i>
              </span>
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/Profile">
              <span>
                <i>
                  <FontAwesomeIcon icon={location === "Profile" ? faUser : faUserRegular} />
                </i>
              </span>
              <span>Profile</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navigation;
