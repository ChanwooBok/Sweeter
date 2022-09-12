import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, updateCurrentUser } from "firebase/auth";
import AppRouter from "components/AppRouter";
import { authService } from "fbase";

function App() {
  //console.log(authService.currentUser);
  //const [ isLoggedIn , setIsLoggedIn] = useState(authService.currentUser);
  // 계정을 생성해서 자동으로 로그인이 되었음에도 불구하고 authService.currentUser가 null인 이유
  // 페이지를 처음 로드하면  firebase가 활성이 안되있기때문에 그렇다. 따라서 기다려줬다가 활성하면 액션을 취하자. -> using onAuthStateChanged

  const [init, setInit] = useState(false); // to check if firebase is initialized
  //const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    // onAuthStateChanged : Adds an observer for changes to the user's sign-in state.
    onAuthStateChanged(auth, (user) => {
      if (user) {
        //setIsLoggedIn(true); -> 그냥 밑에서 Boolean(userObj) 으로 isLoggedIn 넘겨주면 된다. userObj가 존재한다면 그건 로그인 된거나 마찬가지이므로.
        if (user.displayName === null) {
          // 로컬로그인할경우, null로 나오는 에러 해결 : user의 이메일 @앞에 이름을 가져다 이름으로 지정해줌.
          // user.displayName = user.email.split("@")[0]; 위 아래 방법 둘 다 같다.
          user.displayName = user.email.substring(0, user.email.indexOf("@"));
        }
        setUserObj(user); // 상태가 변할때마다 user정보를 obj에 넣어준다. 로그인한 유저의 아이디를 얻기위함.(트윗작성 시)
        //다만, user가 너무 방대한 object라 리액트가 작은변화를 감지하고 리렌더링하기가 힘들다.
      } else { // logout 할때 userObj비워주기. 
        setUserObj(null);
      }
      setInit(true); // firebase is initialized
    });
  }, []);

  const refreshUser = async () => {
    await updateCurrentUser(authService, authService.currentUser);
    setUserObj(authService.currentUser);
  };
  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        "initializiing..."
      )}
    </>
  );
}

export default App;
