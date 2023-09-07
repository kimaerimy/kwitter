import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "pages/Auth";
import Home from "pages/Home";
import Navigation from "components/Navigation";
import Sidebar from "components/Sidebar";
import Profile from "pages/Profile";
import styles from "./Router.module.scss";
import { Fragment } from "react";

const AppRouter = ({ isLoggedIn, userObj, refreshUser, isMobile }) => {
  return (
    <Router>
      <div className={styles["container"]}>
        <div className={styles["outer-container"]}>
          <Routes>
            {isLoggedIn ? (
              <>
                <Route
                  path={`/`}
                  element={
                    <>
                      <Navigation userObj={userObj} />
                      <Home userObj={userObj} refreshUser={refreshUser} />
                      <Sidebar userObj={userObj} />
                    </>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <>
                      <Navigation userObj={userObj} />
                      <Profile userObj={userObj} refreshUser={refreshUser} />
                      <Sidebar userObj={userObj} />
                    </>
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
      </div>
      <footer>&copy; {new Date().getFullYear()} Kwitter</footer>
    </Router>
  );
};

export default AppRouter;
