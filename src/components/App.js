import { useEffect, useState } from "react";
import { auth, db, onAuthStateChanged, doc, getDoc } from "fBase";
import AppRouter from "components/Router";
import styles from "./App.module.scss";
import Loading from "./Loading";

const App = () => {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("screen and (max-width: 768px").matches
  );
  const refreshUser = () => {
    setUserObj(Object.assign({}, auth.currentUser));
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const dbUser = await getDoc(doc(db, "users", user.uid));
        setIsLoggedIn(true);
        setUserObj({
          displayName: user.displayName ?? dbUser.data().userName,
          userEmail: user.email,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
    window.addEventListener("resize", () => {
      setIsMobile(
        () => window.matchMedia("screen and (max-width: 768px").matches
      );
    });
  }, []);
  return (
    <>
      {init ? (
        <AppRouter
          isLoggedIn={isLoggedIn}
          userObj={userObj}
          refreshUser={refreshUser}
          isMobile={isMobile}
        />
      ) : (
        <Loading />
      )}
    </>
  );
};

export default App;
