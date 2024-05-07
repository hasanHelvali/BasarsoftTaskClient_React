import { DataTable } from 'primereact/datatable'
import React, { useEffect, useState } from 'react'
import { useMyContext } from '../../context/DataContext';
import VerifyToken from '../../services/Auth.service';
import { useNavigate } from 'react-router-dom';
import { sendRequest } from '../../services/httpClient.service';
import { Column } from 'primereact/column';
import { none } from 'ol/centerconstraint';
import GeographyAuthorityDialog from './GeographyAuthorityDialog';

function GeographyAuthority() {
  const navigate=useNavigate()
  const {handleLoading,role}=useMyContext()
  const [users, setusers] = useState();
  const [dialogData, setdialogData] = useState(null)
const [topologies, settopologies] = useState()
  useEffect(() => {
    handleLoading(true);
    VerifyToken()
      .then((result) => {
        if (result === true) {
          setTimeout(() => {
            handleLoading(false);
          }, 500);
          getTopology();
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



  function getTopology(){
    handleLoading(true);
    sendRequest("maps","","GET").then((data)=>{
      handleLoading(false)
      settopologies(data);
      console.log(data);
    }).catch((err)=>{
      handleLoading(false)
      alert("Bir hata oluştu...")
    })
  }
  function showDialog(rowData){
    console.log(rowData);
    setdialogData(rowData)
  }
  const closeDialog=()=>{
    setdialogData(null)
    getTopology()
  }
  return (
    <>
      <div className='border'>
        <div className='card'>
          <DataTable value={topologies} tableStyle={{ minWidth: '50rem'}} className='' rowClassName={"border-bottom"}  >
            <Column field="id" header="Topology ID"  ></Column> 
            <Column field="name" header="Topology Name"  ></Column> 
            <Column field="type" header="Topology Type"  ></Column> 
            <Column field="wkt" header="Topology WKT" body={(rowData)=>(<div className='text-center'>
              <textarea className='textarea-container text-start ' readOnly={true} cols={"h-auto "} rows={4} 
              style={{"border":"none", "border-bottom":"1px", "width":"100%","pointerEvents":"painted","resize":"none"}} value={rowData.wkt}></textarea>
            </div>)} ></Column> 
            <Column header="Active User"  body={(rowData)=>(rowData.userId!==null ? 
              <div>
                  Aktif Kullanıcı ID: {rowData.userId} <br/>
                  Aktif Kullanıcı Adı: {rowData.userName}
              </div>:<span>Aktif Bir Kullanıcı Bulanamadı</span>
            )}
            ></Column> 
            {role==="SuperAdmin"?<Column  header="Choose/Delete User" body={(rowData)=>(<button className='btn btn-danger border-radius ms-2 ' 
            onClick={()=>showDialog(rowData)}>Kullanıcılar</button>)}  ></Column> :""
            }
          </DataTable>
          {dialogData!==null?<GeographyAuthorityDialog topology={dialogData} closeDialog={closeDialog}/>:""}
        </div>
      </div>
    </>
  )
}

export default GeographyAuthority