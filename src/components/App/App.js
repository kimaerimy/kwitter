import { createContext, useEffect, useState } from "react";
import { auth, db } from "fbase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import AppRouter from "components/AppRouter/AppRouter";
import "./App.module.scss";
import Loading from "components/Loading/Loading";

export const UserContext = createContext();

const App = () => {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userConnections, setUserConnections] = useState({
    following: [],
    followers: [],
    users: {},
  });
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("screen and (max-width: 768px").matches
  );

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snapshot = await getDoc(doc(db, "users", user.uid));
        const userDoc = snapshot.data();
        const snapshots = await getDocs(
          query(
            collection(db, "users"),
            where("follow", "array-contains", user.uid)
          )
        );
        const followers = snapshots.docs.map((doc) => doc.id);
        const usersSnapshot = await getDocs(query(collection(db, "users")));
        const usersObj = {};
        usersSnapshot.docs.forEach((doc) => {
          usersObj[doc.id] = doc.data();
        });
        setUserConnections({
          following: [user.uid, ...userDoc.follow],
          followers: followers,
          users: usersObj,
        });
        setIsLoggedIn(true);
        setUser({
          userId: user.uid,
          userName: userDoc.userName,
          userEmail: user.email,
          userPhoto: user.photoURL,
          userBg: userDoc.userBg,
          follow: userDoc.follow ?? [],
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
        <UserContext.Provider
          value={{
            user,
            setUser,
            userConnections,
            setUserConnections,
            isLoggedIn,
          }}
        >
          <AppRouter isMobile={isMobile} />
        </UserContext.Provider>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default App;
