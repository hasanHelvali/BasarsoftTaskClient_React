import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useEffect, useState } from 'react'
import { sendRequest } from '../../services/httpClient.service';
import { useMyContext } from '../../context/DataContext';
import CustomMessage from './CustomMessage';
function UpdateUserModal({user,cleanUser}) {
    const [customers, setCustomers] = useState([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [_user, _setuser] = useState(user)
    const [visible, setvisible] = useState(false)
    const [email, setEmail] = useState(user?.email);
    const [name, setname] = useState(user?.name);
    const {handleLoading}=useMyContext();
    const [visibleMessage, setvisibleMessage] = useState(false)
    const [messageType, setmessageType] = useState("")
    const [messageContent, setmessageContent] = useState("")
    useEffect(() => {
      if(user){
        setvisible(true)
        setname(user.name)
        setEmail(user.email)
      }
      console.log(user);
    }, [user]);


      const handleClose = () => {
        setvisible(false);
        user=null
        setname("")
        setEmail("")
        cleanUser()
      };

      const handleEmailChange=(e)=>{
        setEmail(e.target.value);
      }
      const handleNameChange=(e)=>{
        setname(e.target.value);
      }
      const handleSave=()=>{
        handleLoading(true);
        user.name=name;
        user.email=email
        console.log(user);
        sendRequest("admin","UpdateUser","PUT",user).then((result)=>{
          handleClose()
          handleLoading(false);
          setmessageType("success");
          setmessageContent("Güncelleme İşlemi Başarı Ile Yapıldı...")
          setvisibleMessage(true)
          setTimeout(()=>{setvisibleMessage(false)},3000)
        }).catch((err)=>{
          handleClose()
          handleLoading(false);
          setmessageType("danger");
          setmessageContent("Güncelleme İşlemi Sırasında Bir Hata Oluştu!!!")
          setvisibleMessage(true)
          setTimeout(()=>{setvisibleMessage(false)},3000)
        })
      }
    return (
         <>
           <Dialog
             open={visible}
             onClose={handleClose}
             aria-labelledby="alert-dialog-title"
             aria-describedby="alert-dialog-description"
             >
             <DialogTitle id="alert-dialog-title">
               {"Güncelleme Ekranı"}
             </DialogTitle>
             <DialogContent>
               <DialogContentText id="alert-dialog-description">
                {/* <label>İsim</label>
                <input type="text" value={user.name} className='form-control' />
                <input type="text" value={user.email} className='form-control' /> */}
                  <form className='form'>
                    <label for="name ">UserName  </label> 
                    <br/>
                    <br/>
                    <input id="name" type="text" class="form-control bg-secondary text-white" value={name} onChange={handleNameChange}/> <br/> <br/>
                    <label for="name">Email</label> 
                    <input type="text" class="form-control bg-secondary text-white" value={email} onChange={handleEmailChange} /> 
                    <br/>
                    <br/>
                    <br/> 
                    {/* <button class="btn btn-danger" (click)="updateUser(name.value,email.value)" >Güncelle</button> */}
                  </form>
               </DialogContentText>
             </DialogContent>
             <DialogActions>
               <button onClick={handleClose} className='btn btn-success'>İptal</button>
               <button onClick={handleSave} className='btn btn-danger'>Güncelle</button>
             </DialogActions>
           </Dialog>
           {visibleMessage===true?<CustomMessage message={messageContent} severity={messageType}></CustomMessage>:""}
        </>
          );
        }
export default UpdateUserModal
