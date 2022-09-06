import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AppRouter from "components/AppRouter";


function App() {
    //console.log(authService.currentUser);
    //const [ isLoggedIn , setIsLoggedIn] = useState(authService.currentUser);
    // 계정을 생성해서 자동으로 로그인이 되었음에도 불구하고 authService.currentUser가 null인 이유 
    // 페이지를 처음 로드하면  firebase가 활성이 안되있기때문에 그렇다. 따라서 기다려줬다가 활성하면 액션을 취하자. -> using onAuthStateChanged

    const [ init , setInit ] = useState(false); // to check if firebase is initialized
    const [ isLoggedIn , setIsLoggedIn] = useState(false);

    useEffect( () => {
        const auth = getAuth();
        // onAuthStateChanged : Adds an observer for changes to the user's sign-in state.
        onAuthStateChanged(auth , (user) => { 
            if(user) {
                setIsLoggedIn(true);
            }else{
                setIsLoggedIn(false);
            }
            setInit(true); // firebase is initialized
        })
    } , []);


    return (
        <>
        { init ? <AppRouter isLoggedIn={isLoggedIn} /> : "initializiing..."}
        </>
      );
}

export default App;
