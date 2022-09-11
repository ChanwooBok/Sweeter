import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { authService } from "fbase";

import styles from "./AuthForm.module.css";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let data;
      if (newAccount) {
        //create
        // data = await createUserWithEmailAndPassword(authService , email , password);
        data = await createUserWithEmailAndPassword(
          authService,
          email,
          password
        );
      } else {
        //login
        // data = await signInWithEmailAndPassword(authService , email  ,password);
        data = await signInWithEmailAndPassword(authService, email, password);
      }
      console.log(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const onChange = (e) => {
    const {
      target: { name, value },
    } = e;
    try {
      if (name === "email") {
        setEmail(value);
      } else if (name === "password") {
        setPassword(value);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const toggleAccount = () => {
    setNewAccount((prev) => !prev);
  };

  return (
    <>
      <form onSubmit={onSubmit} className="container">
        <input
          name="email"
          type="email"
          placeholder="email"
          value={email}
          onChange={onChange}
          required
          className={styles.authInput}
        />
        <input
          name="password"
          type="password"
          placeholder="password"
          value={password}
          onChange={onChange}
          required
          className={styles.authInput}
        />
        <input
          type="submit"
          className={styles.authSubmit}
          value={newAccount ? "Create Account" : "Sign In"}
        />
        {error && <span className={styles.authError}>{error}</span>}
      </form>

      <span onClick={toggleAccount} className={styles.authSwitch}>
        {newAccount ? "Sign in" : "Create Account"}
      </span>
    </>
  );
};

export default AuthForm;
