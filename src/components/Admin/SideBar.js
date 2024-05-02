import { Link, useNavigate } from "react-router-dom";
import { useMyContext } from "../../context/DataContext";
import { useEffect, useState } from "react";
import VerifyToken from "../../services/Auth.service";
function SideBar() {
    const {handleLoading,activeAdminPageComponentUrl,handleActiveAdminPageComponentUrl}=useMyContext()
    const navigate = useNavigate();
    const [url, seturl] = useState("")
    
    const {role}=useMyContext()
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
    const handleComponents = (e) => {
        handleActiveAdminPageComponentUrl(e)
        // seturl(e);
        //   navigate(`/admin/${e}`);
        //   navigate(`/admin/${e}`);
    }
 
    return (
      <>
            {/* <div className="sidebar text-center">
      <ul>
        <label for="" className="form-label  rounded-5 border-warning ">Admin Paneli</label> <hr/>
        <li className="item rounded-5 border-warning "style={{"cursor":"pointer"}}><a onClick={()=>{navigate("/maps")}} >Haritaya Git</a></li> <br />
        <li className="item rounded-5 border-warning "style={{"cursor":"pointer"}}><a onClick={()=>{handleComponents("users")}}>Tüm Kullanıcılar</a></li><br/>
        {role==="SuperAdmin"?
          <div>
            <li className="item rounded-5 border-warning "><a onClick={()=>{seturl("/admin/roles")}} >Rol Düzenle</a></li><br/>
            <li className="item rounded-5 border-warning "><a onClick={()=>{seturl("/admin/geoAuth")}}>Alan-Kullanıcı İlişkisi İzinleri</a></li><br/>
          </div>:""
        }
        <li className="item rounded-5 border-warning " style={{"cursor":"pointer"}}><a onClick={()=>{navigate("/login-register")}} >Çıkış</a></li><br/>
      </ul>
    </div> */}
        <div className="sidebar text-center">
        <ul>
            <label for="" className="form-label  rounded-5 border-warning ">Admin Paneli</label> <hr/>
            <li className="item rounded-5 border-warning "style={{"cursor":"pointer"}}>
                <Link to="/maps" >
                   Haritaya Git
                </Link>
            </li> <br />
            <li className="item rounded-5 border-warning "style={{"cursor":"pointer"}}><a onClick={()=>{handleComponents("users")}}>Tüm Kullanıcılar</a></li><br/>
            {role==="SuperAdmin"?
            <div>
                <li className="item rounded-5 border-warning " style={{"cursor":"pointer"}}><a onClick={()=>{handleComponents("roles")}} >Rol Düzenle</a></li><br/>
                <li className="item rounded-5 border-warning "style={{"cursor":"pointer"}}><a onClick={()=>{handleComponents("geoAuth")}}>Alan-Kullanıcı İlişkisi İzinleri</a></li><br/>
            </div>:""
            }
            <li className="item rounded-5 border-warning " style={{"cursor":"pointer"}}><a onClick={()=>{navigate("/login-register")}} >Çıkış</a></li><br/>
        </ul>
        </div>
    </>
    )
  }
  export default SideBar;