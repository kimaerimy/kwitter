import {
  auth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  db,
  setDoc,
  doc,
} from "fBase";
import { useState } from "react";
import styles from "./Auth.module.scss";

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
          userName:
            userCredential.user.displayName ??
            userCredential.user.email.split("@")[0],
          userEmail: userCredential.user.email,
          userPhoto: userCredential.user.photoURL ?? "",
          userBg: "",
          following: []
        });
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
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
        <svg viewBox="0 0 24 24">
          <g>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </g>
        </svg>
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
          <button name="google" onClick={onSocialClick}>
            Continue with Google
          </button>
          <button name="github" onClick={onSocialClick}>
            Continue with Github
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
