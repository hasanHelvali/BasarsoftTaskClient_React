import React, { useContext, useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { sendRequest } from '../services/httpClient.service';
import { ReactComponent as PinMapFill } from 'bootstrap-icons/icons/pin-map-fill.svg';
import { ReactComponent as Trash } from 'bootstrap-icons/icons/trash.svg';
import { useMyContext } from '../context/DataContext';
import VerifyToken from '../services/Auth.service';
import { useNavigate } from 'react-router-dom';
function GeometryListModal({ open, handleClose, getLocation, deleteLocAndUser,isGeometryListModalOpen,showFeature}) {
    const navigate = useNavigate();
    const [listLocAndUsers, setListLocAndUsers] = useState([])
    const {loading,handleLoading } = useMyContext();

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
        handleLoading(true);
        sendRequest("maps","","GET").then((result)=>{
            setListLocAndUsers(result);
            handleLoading(false);
        }).catch((err)=>{
            handleLoading(false);
            alert("Veriler Alınırken Bir Hata Olustu...")
        })
    }, [])


    const deleteFeature=(item)=>{
        
    }
    // const handleClose=()=>{
        
    // }

    return (
    <>
      <Dialog open={isGeometryListModalOpen} onClose={handleClose}  maxWidth={false}>
            {/* <DialogContent className="mat-typography" *ngIf="listLocAndUsers.length>0"> */}
            <DialogTitle>Kayıt Listesi</DialogTitle>
            <DialogContent className="mat-typography" >
                {/* <h2 mat-dialog-title>Kayıt Listesi</h2> */}
                <table className="mat-table">
                    <thead className="text-center">
                    <tr>
                        {/* <th mat-header-cell *matHeaderCellDef> Score </th> */}
                        <th className='p-2' mat-header-cell > ID </th>
                        <th scope="col">Name</th>
                        <th scope="col">Type</th>
                        <th scope="col">WKT</th>
                        <th scope="col">Göster</th>
                        <th scope="col">Sil</th>
                    </tr>
                    </thead>
                    <tbody className="text-center">
                    {/* <tr id="dataRow{{item.id}}" className="trRow" *ngFor="let item of listLocAndUsers"> */}
                    {
                        listLocAndUsers.map(item=>(
                            <tr key={item.id} id={`dataRow${item.id}`} className="trRow" >
                                <th className="border" scope="row">{item.id}</th>
                                <td className="border">{ item.name }</td>
                                <td className="border" >{ item.type }</td>
                                <td className="border" >{ item.wkt }</td>
                                <td className="border">
                                    <span className='icon' onClick={()=>showFeature(item)}>
                                    {/* <i className="bi bi-pin-map-fill text-warning"></i> */}
                                    <PinMapFill  color="text-warning" size={30}/>
                                    </span>
                                </td>
                                <td className='border'><span className='icon' onClick={()=>deleteFeature(item)}>
                                    {/* <i className="bi bi-trash text-danger" ></i> */}
                                    <Trash color="red" size={30} className='text-warning'/>
                                    </span>
                                </td>
                            </tr>
                        ))
                    }

                    {/* // <tr id="dataRow{{item.id}}" className="trRow" >
                    //     <th className="border" scope="row">{{item.id}}</th>
                    //     <td className="border">{{ item.name }}</td>
                    //     <td className="border" >{{ item.type }}</td>
                    //     <td className="border"><span><i className="bi bi-pin-map-fill text-warning" (click)="getLocation(item.id,item.name,item.type,item.wkt)" 
                    //     [mat-dialog-close]="true" ></i></span></td>
                    //     <td><span><i className="bi bi-trash text-danger" (click)="deleteLocAndUser(item.id)"></i></span></td>
                    // </tr> */}
                    </tbody>
                </table>
                </DialogContent>

                {/* <mat-dialog-actions align="end" *ngIf="listLocAndUsers.length>0">
                <button mat-button mat-dialog-close>Çık</button>
                <!-- <button mat-button [mat-dialog-close]="true" cdkFocusInitial>Install</button> -->
            </mat-dialog-actions> */}

            <DialogActions>
                <Button onClick={handleClose} color="primary">
                Çık
                </Button>
        </DialogActions>
      </Dialog>

    </>
  )
}

export default GeometryListModal