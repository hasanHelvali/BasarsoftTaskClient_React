import { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes ,Navigate} from 'react-router-dom';
import './App.css';
import Maps from './components/Maps';
import LoginAndRegister from './components/LoginAndRegister';
import { useMyContext } from './context/DataContext';
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import Spinner from './components/Spinner';
import { RingLoader } from 'react-spinners';
function App() {
  const navigate = useNavigate();
  // const [isAuth, setisAuth] = useState(false)
  const {isAuth,handleIsAuth,jwt,loading} = useMyContext() 
  const [_jwt, set_jwt] = useState("") 
  // const [jwt, setjwt] = useState()

  useEffect(() => {
    const fetchJwt = async () => {
      const jwt = await localStorage.getItem("token");
      console.log(jwt);
      set_jwt(jwt);
      console.log(_jwt);
      if(jwt){
        navigate('/maps');
      }
    };
    // setjwt(localStorage.getItem("token"))  
    // const jwt=localStorage.getItem("token")
    // set_jwt(jwt)
    fetchJwt();  
    // if (_jwt) {
    //    <Navigate to="/maps" />;
    // }
    // else{
    //    <Navigate to="/login-register" />;
    // }
  },[jwt])


  return (
      <div className="App">
        {loading?(
          <div id="spinner-container">
          <RingLoader
            color=" #fff"
            loading
            size={249}
            speedMultiplier={2}
            id='spinner'
          />
        </div>
        ):("")}
          {/* {isAuth? (
            <Maps></Maps>        
          ):(
            <LoginAndRegister/>
          )} */}
          {/* {_jwt!==null ?(
            <Maps/>       
          ):(
            <LoginAndRegister/>
          )} */}
           <Routes>
              <Route path="/login-register" element={<LoginAndRegister/>} />
              <Route path="/maps" element={_jwt?< Maps/>:<Navigate to="/login-register" />}  />
            </Routes>
      </div>
  );
}

export default App;
