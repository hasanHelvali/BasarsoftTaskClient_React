import { useContext, useState } from 'react';
import './App.css';
import Maps from './components/Maps';
import LoginAndRegister from './components/LoginAndRegister';
import { useMyContext } from './context/DataContext';
import { css } from '@emotion/react';
function App() {
  // const [isAuth, setisAuth] = useState(false)
  const {isAuth,handleIsAuth} = useMyContext()  
  return (
    <div className="App">
        {isAuth?(
          <Maps></Maps>        
        ):(
          <LoginAndRegister/>
        )}
    </div>
  );
}

export default App;
