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
import VerifyToken from './services/Auth.service';
import JWTDecode from './services/jwt.service';
import Admin, { AdminRoutes } from './components/Admin/Admin';
import StartInteraction from './components/StartInteraction';
import AllUsers from './components/Admin/AllUsers';
import Roles from './components/Admin/Roles';
import GeographyAuthority from './components/Admin/GeographyAuthority';
function App() {
  const navigate = useNavigate();
  // const [isAuth, setisAuth] = useState(false)
  const {isAuth,handleIsAuth,jwt,loading,handleLoading,Verify,role,handleRole,handleName,handleIdentifier,name,indentifier} = useMyContext() 
  const [_jwt, set_jwt] = useState("") 
  // const [jwt, setjwt] = useState()

  useEffect( () => {
    const fetchJwt = async () => {
      const jwt = await localStorage.getItem("token");
      set_jwt(jwt);
      if(jwt){//bir jwt varsa
        handleLoading(true)
          VerifyToken().then((result)=>{
            
            JWTDecode(handleRole,handleName,handleIdentifier).then(()=>{})
            
            if (result===true) {
              navigate('/maps');
            }
            else{
              navigate('/login-register');
              localStorage.removeItem("token")
            }
            handleLoading(false)
         })
      }
      else{
        navigate('/login-register');
      }
    };
    fetchJwt();  
  },[jwt])


  return (
      <div className="App">
        {/* <StartInteraction /> */}
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
              {/* <Route path="/admin" element={_jwt? */}
                {/* < Admin> */}
                {/* <Routes> 
                    <Route path='/admin/users' element={<AllUsers/>}/>
                    <Route path='/admin/roles' element={<Roles/>}/>
                    <Route path='/admin/geoAuth' element={<GeographyAuthority/>}/>
                  </Routes> */}
              {/* </Admin>:<Navigate to="/login-register" />}  /> */}
              <Route path="/admin/*" element={_jwt?
                < AdminRoutes>
                {/* <Routes> 
                    <Route path='/admin/users' element={<AllUsers/>}/>
                    <Route path='/admin/roles' element={<Roles/>}/>
                    <Route path='/admin/geoAuth' element={<GeographyAuthority/>}/>
                  </Routes> */}
              </AdminRoutes>:<Navigate to="/login-register" />}  />
              {/* <Route path="/admin/*" element={<Adminroutes />} /> */}

            </Routes>
      </div>
  );
}

export default App;

