import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "pages/Auth";
import Home from "pages/Home";
import Navigation from "components/Navigation";
import Profile from "pages/Profile";
import styles from "./Router.module.scss";

const AppRouter = ({ isLoggedIn, userObj, refreshUser, isMobile }) => {
  return (
    <Router>
      {/* {isLoggedIn && <Navigation userObj={userObj} />} */}
      <div className={styles["container"]}>
        {/* <Navigation userObj={userObj} /> */}
        <Routes>
          {isLoggedIn ? (
            <>
              <Route path={`/`} element={<Home userObj={userObj} />} />
              <Route
                path="/profile"
                element={
                  <Profile userObj={userObj} refreshUser={refreshUser} />
                }
              />
            </>
          ) : (
            <>
              <Route path={`/`} element={<Auth isMobile={isMobile} />} />
            </>
          )}
        </Routes>
      </div>
      <footer>&copy; {new Date().getFullYear()} Kwitter</footer>
    </Router>
  );
};

export default AppRouter;
