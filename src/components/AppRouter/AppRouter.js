import { useContext } from "react";
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
import Footer from "components/Footer/Footer";

const AppRouter = ({ isMobile }) => {
  const { isLoggedIn } = useContext(UserContext);
  return (
    <>
      <Router basename={process.env.PUBLIC_URL}>
        <ScrollToTop />
        <div className={styles["container"]}>
          {isLoggedIn && <Navigation isMobile={isMobile} />}
          <Routes>
            {isLoggedIn ? (
              <>
                <Route
                  path={`/`}
                  element={
                    <>
                      <Home />
                      {!isMobile && <Sidebar />}
                    </>
                  }
                />
                <Route
                  path={`/search`}
                  element={
                    <>
                      <Search />
                      {!isMobile && <Sidebar />}
                    </>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <>
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
          {/* <Footer /> */}
        </div>
      </Router>
    </>
  );
};

export default AppRouter;
