import React, { useEffect, useState } from 'react'
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { useMyContext } from '../../context/DataContext';
import VerifyToken from '../../services/Auth.service';
import { useNavigate } from 'react-router-dom';
function RoleDropdownModal({defaultRole,rowData,handleClose,isUpdateRole,handleSave}) {
  const [visible, setVisible] = useState(true);
  const [selectedRole, setSelectedRole] = useState()
  const [disabledButton, setdisabledButton] = useState(true)
  const {handleLoading,role}=useMyContext();
  const navigate=useNavigate();

 
  const roles=[
    { name: 'Admin',id:1},
    { name: 'User' ,id:2},
  ]
 
  useEffect(() => {
    handleLoading(true);
    VerifyToken()
      .then((result) => {
        if (result === true) {
          setTimeout(() => {
            handleLoading(false);
          }, 500);
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
    setdisabledButton(true)
    setSelectedRole(defaultRole)
  }, [defaultRole])
  
  const getIdByRole=(id)=>{
    // console.log(rowData.role[0]);
    // const id=roles[rowData.role[0]]
    // console.log(id);
    // console.log(roles[0].name);
    // for (let i = 0; i < roles.length; i++) {
    //     if (roles[i].name === rowData.role[0]) {
    //         setSelectedRole(roles[i].id)
    //     //   return roles[i].id;
    //       return roles[i].name;
    //     }
    // }
    let name = roles.find((role)=>role.id===id).name
    return name
    debugger
  }

  const handleChange=(e)=>{
    console.log(rowData);
    let _role = getIdByRole(e.value)
    console.log(defaultRole);
    console.log(_role);

    if(defaultRole[0]!==_role){
      setdisabledButton(false)
      setSelectedRole(_role)
    }
    else{
      setdisabledButton(true)
      setSelectedRole(defaultRole)

    }
  }
  return (
    <>

    {/* <Dialog className='bg-light border d-flex justify-content-center  m-3 '   visible={visible} style={{ width: '10vw' ,"borderRadius":"5px","height":"20vh"}} onHide={() => setVisible(false)}> */}
    <Dialog header="Role Guncelle" visible={isUpdateRole} position={"top"} style={{ width: '15vw',borderRadius:"5px", margin:"10px", padding:"10px", height:"200px" }}
     onHide={() => {setSelectedRole(defaultRole); setdisabledButton(true); handleClose()}} footer={""} draggable={true} resizable={false} className='bg-white d-flex m-auto'
    dismissableMask modal={true} maskStyle={{"backgroundColor":"rgba(0, 0, 0, 0.5)"}}>
      <hr/>
      <Dropdown
      className='bg-light m-3 border w-75 justify-content-center'
      panelClassName='bg-light mt-2'
      value={selectedRole}
      options={roles}
      // onChange={(e) => handleChangeRole(e.value,rowData)}
      onChange={(e) => handleChange(e)}
      optionValue="id"
      optionLabel="name"
      placeholder={selectedRole}
      // className={`w-full md:w-14rem drop${rowData.id}`}
      />
      <div className='m-auto'>
        <button className='btn btn-danger ' disabled={disabledButton} onClick={()=>handleSave(selectedRole)}>Onayla</button>
      </div>
    </Dialog>
      </>
  )
}

export default RoleDropdownModal