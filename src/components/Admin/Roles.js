import { DataTable } from 'primereact/datatable'
import React, { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown';
import { Column } from 'primereact/column';
import VerifyToken from '../../services/Auth.service';
import { useMyContext } from '../../context/DataContext';
import { sendRequest } from '../../services/httpClient.service';
import { useNavigate } from 'react-router-dom';
import { Users } from '../../models/User';
import RoleDropdownModal from './RoleDropdownModal';
// import Dropdown from 'react-bootstrap/Dropdown';

function Roles() {
    const [users, setusers] = useState([])
    const [selectedRole, setselectedRole] = useState(1)
    const {handleLoading}=useMyContext()
    const navigate=useNavigate();
    const [isRoleChanged, setisRoleChanged] = useState(false)
    const [dropdownStates, setDropdownStates] = useState({});
    const [approwedArr, setapprowedArr] = useState([])//approwedArr bir liste
    const [isUpdateRole, setisUpdateRole] = useState(false)
    const [defaulRole, setDefaultRole] = useState()
    const handleChangeRole = (selectedValue, rowData) => {
        // Yeni state'i oluştur
        const newDropdownStates = { ...dropdownStates };
        // Dropdown'un ID'si ile seçili değeri güncelle
        newDropdownStates[rowData.id] = selectedValue;
        // Yeni state'i ayarla
        setDropdownStates(newDropdownStates);

        const button = document.getElementsByClassName(`btn${rowData.id}`)
        // button[0].disabled=false;

        setapprowedArr([...approwedArr,rowData.id])//bu listede id ler tutulacak.
      };

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
        handleLoading(false);
        }).catch((err)=>{
          alert("Bir Hata Oluştu");
          handleLoading(false);
        })
      }
      const roles=[
        { name: 'Admin',id:1},
        { name: 'User' ,id:2},
      ]


      const getRoleById=(id)=>{
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].id === id) {
            //   return roles[i].id;
              return roles[i].name;
            }
        }
      }

      const getDefaultRole = (rowData) => {//kullanıcının role degerinin dropdown da secili gelmesi icin yazılmıstır.
        return dropdownStates[rowData.id] || null;
      };


      const handleSaveRole=(role)=>{
        setisUpdateRole(false)
        setrowData(null)
        console.log(role);
        console.log(rowData.id);
          handleLoading(true) 

        // console.log(dropdownStates[rowData.id]);
        // console.log( getDefaultRole(rowData))
        // console.log(getIdByRole(rowData));
        // let role = getRoleById(dropdownStates[rowData.id])
        // const roleArr=[role]
        const user=new Users(rowData.id,rowData.name,rowData.email,role)
        console.log(user);
        sendRequest("roles","UpdateRole","PUT",user).then((result)=>{
          handleLoading(false)
          alert("Guncelleme islemi basarılı")
          getAllUser()
      }).catch((err)=>{
          handleLoading(false)
          alert("Guncelleme islemi sırasında bir hata olustu.")

      })

      }
      const createHandleMenuClick=()=>{
        
      }
      const handleCloseRoleComponent=()=>{
        setisUpdateRole(false)
      }
      const [rowData, setrowData] = useState()
  return (
    <>
    <div className="card"  style={{" height": "90vh"}}>
    <DataTable value={users}  tableStyle={{'min-width': '50rem' }} rowClassName={(rowData)=>`border-1 ${rowData.id}`}>
        <Column field="id" header="ID"  ></Column> 
        <Column field="email" header="Email"  ></Column> 
        <Column field="role" header="Role"  ></Column> 
        <Column  header="Role Düzenle"  body={(rowData)=>(
          <button className='btn btn-warning' onClick={()=>
            {
              setisUpdateRole(true)
              setDefaultRole(rowData.role)
              setrowData(rowData)
            }}>Rol Seç</button>
        ) }>
        </Column> 
        {/* <Column  header="Onayla" body={(rowData)=><button onClick={()=>{handleSaveRole(rowData)}} disabled={approwedArr.indexOf(rowData.id)<=-1} className={`btn btn-danger btn${rowData.id}`} >Onayla</button>}  ></Column>  */}
            {/*  approwedArr icinde olmayan id ler i kilitledik. */}
    </DataTable>
</div>
    {<RoleDropdownModal defaultRole={defaulRole} handleClose={handleCloseRoleComponent} isUpdateRole={isUpdateRole} rowData={rowData} handleSave={handleSaveRole}/>}
</>
  )
}

export default Roles
