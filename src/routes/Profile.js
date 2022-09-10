import { authService, dbService, storageService } from "fbase";
import { updateProfile } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "routes/Profile.module.css";

const Profile = ({ refreshUser, userObj }) => {
  const [sweets, setSweets] = useState([]); // 모든 트윗을 화면에 띄우기 위함.
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const navigate = useNavigate(); // 특정 액션을 했을때 특정 url로 이동하게 해준다.

  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
    refreshUser();
  };

  const getMySweets = async () => {
    const q = query(
      collection(dbService, "sweets"),
      where("creatorId", "==", `${userObj.uid}`)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  };

  useEffect(() => {
    getMySweets();
  }, []);

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewDisplayName(value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };

  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input
          type="text"
          autoFocus
          value={newDisplayName}
          onChange={onChange}
          className="formInput"
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
};

export default Profile;
