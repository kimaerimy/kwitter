import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "components/Navigation/Navigation";
import Sidebar from "components/Sidebar/Sidebar";
import styles from "./AppRouter.module.scss";
import { UserContext } from "components/App/App";

const AppRouter = ({ isMobile }) => {
  const { isLoggedIn } = useContext(UserContext);
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className={styles["container"]}>
        <div className={styles["outer-container"]}>
          <Routes>
            {isLoggedIn ? (
              <>
                <Route
                  path={`/`}
                  element={
                    <>
                      <Navigation />
                      <Home />
                      <Sidebar />
                    </>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <>
                      <Navigation />
                      <Profile />
                      <Sidebar />
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
