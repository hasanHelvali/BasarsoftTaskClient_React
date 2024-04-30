import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import VerifyToken from '../../services/Auth.service';
import { useMyContext } from '../../context/DataContext';
function Admin() {
    const {handleLoading}=useMyContext()
    const navigate = useNavigate();
    useEffect(() => {
        handleLoading(true);
        VerifyToken().then((result)=>{
            if (result===true) {
                setTimeout(() => {
                    handleLoading(false);
                }, 500);
            }
              else{
                navigate('/login-register');
                localStorage.removeItem("token")
                handleLoading(false);    
                return;
              }
        }).catch((err)=>{
            navigate('/login-register');
            localStorage.removeItem("token")
            handleLoading(false);    
            return ;
        })
    }, [])

  return (
    
    <div>Admin</div>
  )
}

export default Admin