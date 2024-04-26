import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { sendRequest } from '../services/httpClient.service';
import { UpdateLocation } from '../models/UpdateLocation';
import { useMyContext } from '../context/DataContext';
function UpdateModal({feature,handleClose}) {
  const [save, setsave] = useState(false)
  const [close, setclose] = useState(false)
  const [nameState, setnameState] = useState("")
  const {loading,handleLoading} = useMyContext()
  useEffect(() => {
    console.log(feature);
    setnameState(feature.name)
  }, [feature])
  
  const saveFeature=()=>{
    const updateLocation=new UpdateLocation();
    updateLocation.id=feature.id
    updateLocation.wkt=feature.wkt
    updateLocation.name=nameState
    handleLoading(true);
    console.log(updateLocation);
    sendRequest("maps","","PUT",updateLocation).then((result)=>{
      handleLoading(false);
      alert("Güncelleme Başarılı...");
      handleClose();

    }).catch((err)=>{
      handleLoading(false);
      alert("Veri Güncellenirken Bir Sorun Oluştu.");
      handleClose();
    })
  }
  const handleName=(e)=>{
    setnameState(e.target.value)
  }
  return (
    <>
      <Modal show={feature!==null} onEscapeKeyDown={handleClose}>
        <Modal.Header>
          <Modal.Title>Koordinat Güncelleme Ekranı</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="form"> 
            <input type="text" className="form-control" placeholder="İsim" value={nameState} onChange={handleName} />
            <label className="form-control-plaintext" ></label>{feature.type}<br/>
            <textarea className="form-control-plaintext" style={{resize: "none" ,width: "100%" ,height: "100px"}}  defaultValue={feature.wkt}></textarea>   
          </form>          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={saveFeature}>Kaydet</Button>
          <Button variant="secondary"onClick={handleClose}>İptal</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default UpdateModal