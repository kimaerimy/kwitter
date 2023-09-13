import { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "components/Navigation/Navigation";
import Sidebar from "components/Sidebar/Sidebar";
import styles from "./AppRouter.module.scss";
import { UserContext } from "components/App/App";
import ScrollToTop from "components/ScrollToTop/ScrollToTop";
import Search from "routes/Search";

const AppRouter = ({ isMobile }) => {
  console.log(isMobile);
  const { isLoggedIn } = useContext(UserContext);
  return (
    <>
      <Router>
        <ScrollToTop />
        <div className={styles["container"]}>
          <Routes>
            {isLoggedIn ? (
              <>
                <Route
                  path={`/`}
                  element={
                    <>
                      <Navigation />
                      <Home />
                      {!isMobile && <Sidebar />}
                    </>
                  }
                />
                <Route
                  path={`/search`}
                  element={
                    <>
                      <Navigation />
                      <Search />
                      {!isMobile && <Sidebar />}
                    </>
                  }
                />                
                <Route
                  path="/profile"
                  element={
                    <>
                      <Navigation />
                      <Profile />
                      {!isMobile && <Sidebar />}
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
          <footer>&copy; {new Date().getFullYear()} Kwitter</footer>
        </div>
      </Router>
    </>
  );
};

export default AppRouter;
