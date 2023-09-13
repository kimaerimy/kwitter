import { useState } from "react";
import { auth, db } from "fbase";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import styles from "./Auth.module.scss";
import { Logo } from "components/Svg/Svg";

const Auth = ({ isMobile }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      if (newAccount) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await setDoc(doc(db, "users", userCredential.user.uid), {
          createdAt: Date.now(),
          userId: userCredential.user.uid,
          userName:
            userCredential.user.displayName ??
            userCredential.user.email.split("@")[0],
          userEmail: userCredential.user.email,
          userPhoto: userCredential.user.photoURL ?? "",
          userBg: "",
          follow: [],
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      setError(error.message.split("Firebase: ")[1]);
    }
  };
  const toggleAccount = () => {
    setError("");
    setNewAccount((prev) => !prev);
  };
  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;
    let providerInstance, provider;
    if (name === "google") {
      provider = GoogleAuthProvider;
      providerInstance = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = GithubAuthProvider;
      providerInstance = new GithubAuthProvider();
    }
    try {
      const data = await signInWithPopup(auth, providerInstance);
      const credential = provider.credentialFromResult(data);
      const token = credential.accessToken;
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div
      className={`${styles["inner-container"]} ${
        isMobile ? styles["mobile-wrap"] : ``
      }`}
    >
      <div className={styles["login-logo-wrap"]}>
        <Logo size={400} />
      </div>
      <div className={styles["login-wrap"]}>
        <div className={styles["login-email"]}>
          <p>X에 가입하여 트윗하세요</p>
          <form onSubmit={onSubmit}>
            <input
              type="email"
              placeholder={`Email`}
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <input
              type="password"
              placeholder={`Password`}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <div className={styles["err-msg"]}>{error}</div>
            <input
              type="submit"
              value={newAccount ? "Create Account" : "Sign In"}
            />
          </form>
          <span onClick={toggleAccount}>
            {newAccount ? "Sign In" : "Create Account"}
          </span>
        </div>
        <div className={styles["login-social"]}>
          <div className={styles["social-item"]}>
            <button name="google" onClick={onSocialClick}>
              Continue with Google
            </button>
          </div>
          <div className={styles["social-item"]}>
            <button name="github" onClick={onSocialClick}>
              Continue with Github
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
