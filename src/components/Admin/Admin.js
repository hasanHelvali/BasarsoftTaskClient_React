import React, { useEffect, useState } from 'react'
// import { Navigate, Route, Router, Routes, useNavigate } from 'react-router-dom';
// import VerifyToken from '../../services/Auth.service';
// import { useMyContext } from '../../context/DataContext';
import "./Admin.css"
// import AllUsers from './AllUsers';
// import Roles from './Roles';
// import GeographyAuthority from './GeographyAuthority';
import Nav from './Nav';
import SideBar from './SideBar';
import { Route, Routes, useOutletContext } from 'react-router-dom';
import AllUsers from './AllUsers';
import Roles from './Roles';
import GeographyAuthority from './GeographyAuthority';
import { Outlet } from 'react-router-dom';
import { useMyContext } from '../../context/DataContext';
function Admin() {
  const {activeAdminPageComponentUrl}=useMyContext()
  // const { outletContext } = useOutletContext();
    // function SideBar() {
    //   return (
    //     <>
    //           <div className="sidebar text-center">
    //     <ul>
    //       <label for="" className="form-label  rounded-5 border-warning ">Admin Paneli</label> <hr/>
    //       <li className="item rounded-5 border-warning "style={{"cursor":"pointer"}}><a onClick={()=>{navigate("/maps")}} >Haritaya Git</a></li> <br />
    //       <li className="item rounded-5 border-warning "style={{"cursor":"pointer"}}><a onClick={()=>{navigate("/admin/users")}}>Tüm Kullanıcılar</a></li><br/>
    //       {role==="SuperAdmin"?
    //         <div>
    //           <li className="item rounded-5 border-warning "><a onClick={()=>{navigate("/admin/roles");}} >Rol Düzenle</a></li><br/>
    //           <li className="item rounded-5 border-warning "><a onClick={()=>{navigate("/admin/geoAuth")}}>Alan-Kullanıcı İlişkisi İzinleri</a></li><br/>
    //         </div>:""
    //       }
    //       <li className="item rounded-5 border-warning " style={{"cursor":"pointer"}}><a onClick={()=>{navigate("/login-register")}} >Çıkış</a></li><br/>
    //     </ul>
    //   </div>
    //   </>
    //   )
    // }
 
    
    return (
      <>
      
      <SideBar/>
      <div className='content'>
      {/* {outletContext.outletElement}  */}
      {/* <Outlet/> */}
      {activeAdminPageComponentUrl==="users"?<AllUsers/>:activeAdminPageComponentUrl==="roles"?<Roles/>:activeAdminPageComponentUrl==="geoAuth"?<GeographyAuthority/>:""}
      </div>

    </>
    )
}

export default Admin

export  const AdminRoutes = () => {
  return (
      <Routes>
        {/* Her bir rota yapısını ilgili yollarla eşleştiriyoruz */}
        <Route path="/" element={<Admin />} />
        <Route element={<SideBar />} /> 
        <Route path="/users" element={<AllUsers />} />
        <Route path="/roles" element={<Roles></Roles>} />
        <Route path="/geoAuth" element={<GeographyAuthority/>} />
      </Routes>
  );
};