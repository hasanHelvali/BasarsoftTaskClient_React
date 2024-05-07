import React, { useEffect, useState } from 'react'
import VerifyToken from '../../services/Auth.service';
import { useMyContext } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { sendRequest } from '../../services/httpClient.service';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import Dialog from '@mui/material/Dialog';
import { DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { DataTable } from 'primereact/datatable';
import Button from '@mui/material/Button';
import { GeoAuth } from '../../models/GeoAuth';
function GeographyAuthorityDialog({topology,closeDialog}) {
    const {handleLoading} = useMyContext()
    const navigate = useNavigate()
    const [users, setusers] = useState()
    const [visible, setvisible] = useState(false)

    useEffect(() => {
        handleLoading(true);
        VerifyToken()
          .then((result) => {
            if (result === true) {
              setTimeout(() => {
                handleLoading(false);
              }, 500);
              getAllUser();
              if(topology!==null){
                setvisible(true)
              }
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
      }, [topology])

    function getAllUser(){
        handleLoading(true);
        sendRequest("AuthManagement","GetAllUsers","GET").then((data)=>{
          const updatedUsers = data.filter(user => !user.role.includes('SuperAdmin'));//superadmin kullanıclar ıcınde kendisini gormesin diye bu islem yapıldı
          setusers(updatedUsers)
          console.log(data);
          setvisible(true)
        handleLoading(false);
        }).catch((err)=>{
          alert("Bir Hata Oluştu");
          handleLoading(false);
        })
      }
      const assignTopology=(rowData)=>{
        console.log(rowData);
        console.log("rowData");
        console.log(topology);
        console.log("topoloji");
        // handleLoading(true);
        let geoAuth=new GeoAuth();
        geoAuth.topology=topology;
        geoAuth.users=rowData;
        sendRequest("GeographyAuthority","AssignRoleAndUser","POST",geoAuth).then((result)=>{
            handleLoading(false)
            handleClose()
            alert("Rol duzenleme basarılı")
        }).catch((err)=>{
            handleLoading(false)
            alert("Rol duzenleme basarısız")
            handleClose();
        });
      }
      const clearTopologyAndCloseModal=(rowData)=>{
        console.log(rowData);
        handleLoading(true)
        sendRequest("GeographyAuthority","","DELETE",null,rowData.id).then((result)=>{
            handleLoading(false)
            alert("Rol Silme basarılı")
            handleClose();
        }).catch((err)=>{
            handleLoading(false)
            alert("Rol Silme basarısız")
            handleClose();
        })
      }
      const handleClose=()=>{
        setvisible(false)
        closeDialog();
      }
  return (
    <>
    <div className="card flex justify-content-center align-items-center " style={{"backgroundColor":"black"}}>
        <Dialog  open={visible} style={{"width":"100vw"}} modal={true} onHide={()=>setvisible(false)} maxWidth={false} >
            {/* maxWidth false ozelligi modal ın ıcerigi kadar buyumesi icindir. */}
            <DialogTitle className='text-center'>
                Kullanıcılar <hr/>
            </DialogTitle>
            <DialogContent>
                <DataTable value={users}  rows={5} rowClassName={"border-bottom"}   >
                    <Column sortable={true}  field="id" header="ID"   headerClassName='border-bottom'></Column> 
                    <Column sortable={true}  field="name" header="Name"   headerClassName='border-bottom'></Column> 
                    <Column sortable={true} field="email" header="Email"   headerClassName='border-bottom'></Column> 
                    <Column sortable={true} field="role" header="Role"  headerClassName='border-bottom' body={(rowData)=>(<Tag value={rowData.role[0]} severity={rowData.role[0]==='SuperAdmin'?'success':rowData.role[0]=='Admin'?'warning':'danger'}></Tag>)} ></Column> 
                    <Column header="Atama"  headerClassName='border-bottom' body={(rowData)=>(<Button className='bg-warning text-black'  icon="pi pi-plus" onClick={()=>assignTopology(rowData)}>Bölgeye Ata </Button>)} ></Column> 
                    <Column header="Temizleme"  headerClassName='border-bottom' body={(rowData)=>(<Button className='bg-danger text-white' icon="pi pi-plus" onClick={()=>clearTopologyAndCloseModal(rowData)}>Bölgeyi Temizle </Button>)} ></Column> 
                </DataTable>
            </DialogContent>
            <DialogActions>
                 <Button className='bg-secondary text-white' onClick={handleClose}>Cancel</Button>
             </DialogActions>
        </Dialog>
    </div>
    </>
  )
}

export default GeographyAuthorityDialog