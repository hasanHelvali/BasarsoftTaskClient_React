import React, { useEffect, useState } from 'react'
import { sendRequest } from '../services/httpClient.service';
import { useMyContext } from '../context/DataContext';
import { Dialog } from '@mui/material';
import { Modal,Button } from 'react-bootstrap';
import VerifyToken from '../services/Auth.service';
import { useNavigate } from 'react-router-dom';
function AllFeatureModal({handleClose,handleIsOpenAllFeatureModal,handleSelectedFeatureMap}) {
    const [allFeature, setallFeature] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const {laoding,handleLoading,role,username,identifier}=useMyContext()
    const navigate=useNavigate();
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
        handleLoading(true);
        sendRequest("maps","","GET").then((data)=>{
            console.log(data);
            setallFeature(data);
            handleLoading(false);
        }).catch((err)=>{
            alert("Kayıt Getirme Islemi Sirasinda Bir Hata Oluştu...")
            handleLoading(false);
        })
    },[]) 
    handleIsOpenAllFeatureModal=()=>{
        setIsOpen(true)
    }
    function handleSelectedFeature(e){
        console.log(e);
        //burada ilgiliveri alındı. Simdi bunu haritada gostermek gerekiyor.
        handleClose();
        handleSelectedFeatureMap(e)
    }
  return (
    <>
        <Modal show={allFeature.length>0 } style={{zIndex:"5000"}}>
            <Modal.Header>
                <Modal.Title>Kayıtlar</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight:"400px", overflowY:"auto"}}>
                {
                    allFeature.map((item)=>{
                    return (
                        <div key={item.id} className="card flex justify-content-center m-2 p-2 " style={{cursor:"pointer"}} onClick={()=>handleSelectedFeature(item)}>
                            <span><b> Bölge Adı :</b> {item.name}</span> 
                        </div>
                    )
                    })
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary"onClick={handleClose}>İptal</Button>
            </Modal.Footer>
        </Modal>
    </>
  )
}

export default AllFeatureModal