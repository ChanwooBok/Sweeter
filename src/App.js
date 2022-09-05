import { useState } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import Auth from 'routes/Auth';
import Home from 'routes/Home';
import authService from 'fbase';


function App() {
    //console.log(authService.currentUser);
    const [ isLoggedIn , setIsLoggedIn] = useState(authService.currentUser);
    return (
          <Router>
            <Routes>
                {isLoggedIn ? (
                    <>
                        <Route path={"/"} element={<Home />} />
                    </>
                ) : (
                    <Route path={"/"} element={<Auth />} />
                )}
            </Routes>
          </Router>
      );
}

export default App;
