import React, { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { sendRequest } from '../../services/httpClient.service';
import { useMyContext } from '../../context/DataContext';
import VerifyToken from '../../services/Auth.service';
import { useNavigate } from 'react-router-dom';
import { BsPencilSquare } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import UpdateUserModal from './UpdateUserModal';

function AllUsers() {
  const {handleLoading,role}=useMyContext();
  const navigate=useNavigate();
  const [users, setusers] = useState([])
  const [updateModalVisible, setupdateModalVisible] = useState(false)
  const [isupdate, setisupdate] = useState(false)
  const [isdelete, setisdelete] = useState(false)
  const [user, setuser] = useState()

  useEffect(() => {
    handleLoading(true);
    VerifyToken()
      .then((result) => {
        if (result === true) {
          setTimeout(() => {
            handleLoading(false);
          }, 500);
          getAllUser();
        } else {
          navigate("/login-register");
          localStorage.removeItem("token");
          handleLoading(false);
          return;
        }
      })
      .catch((err) => {
        navigate("/login-register");
        localStorage.removeItem("token");
        handleLoading(false);
        return;
      });
  }, [])
  
  function getAllUser(){
    handleLoading(true);
    sendRequest("AuthManagement","GetAllUsers","GET").then((data)=>{
      // setusers(data);
      const updatedUsers = data.filter(user => !user.role.includes('SuperAdmin'));//superadmin kullanıclar ıcınde kendisini gormesin diye bu islem yapıldı
      setusers(updatedUsers)
      console.log(data);
    handleLoading(false);
    }).catch((err)=>{
      alert("Bir Hata Oluştu");
      handleLoading(false);
    })
  }
  const handleUpdateUser=(rowData)=>{
    //modal acılacak.
    setuser(rowData)
    setisupdate(true);
  }
  const handleDeleteUser=(rowData)=>{
    //kullanıcı silinecek
    setuser(rowData)
  }
  const cleanUser=()=>{
    console.log("clean");
    setuser(null)
  }
  return (
      <>
      <DataTable  value={users} tableStyle={{ minWidth: '50rem', border:"3px solid",padding:"5px",  }} rowClassName={"border-1"}>
        <Column field="id" header="ID"  ></Column> 
        <Column field="name" header="Name"  ></Column>
        <Column field="email" header="Username" ></Column>
        <Column field="role" header="Role"  ></Column>
        {role==="SuperAdmin"?
          <Column  header="Düzenle" body={(rowData)=>(<BsPencilSquare size={"20px"} onClick={() => handleUpdateUser(rowData)} style={{"cursor":"pointer"}}/>)}  className='text-warning update'  ></Column>
        :""
        }
        {role==="SuperAdmin"?
          <Column  header="Sil" body={(rowData)=>(<FaTrash size={"20px"} onClick={()=>handleDeleteUser(rowData)} style={{"cursor":"pointer"}}/>)}  className='text-danger update'></Column>
        :""
        }
      </DataTable>
      {
        <UpdateUserModal  user={user} visible={isupdate} cleanUser={cleanUser}></UpdateUserModal>
      }

      </>

  )
}

export default AllUsers