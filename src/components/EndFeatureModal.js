import React, { useEffect, useState } from 'react'
import { useMyContext } from '../context/DataContext';
import { Box, Button, Modal, Typography } from '@mui/material';
import { sendRequest } from '../services/httpClient.service';
import { loadFeaturesXhr } from 'ol/featureloader';
function EndFeatureModal(props) {
    const { wkt, isEndFeatureModalOpen, handleStateModal,handleDataCapture ,featureType,handleFeatureType,loading,handleLoading} = useMyContext();
    const [value, setValue] = useState('')
    const [open, setOpen] = React.useState(false);
    const [name, setname] = useState("")
    const handleOpen = () => setOpen(true);
    const handleClose = () =>{
      setOpen(false)
      handleDataCapture("")
      handleStateModal(false)
      handleFeatureType("");
    };

    const style = {
      position: 'absolute',
      top: '20%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      border: '2px solid #000',  
      boxShadow: 24,
      p: 4,
    };

    useEffect(() => {
      handleOpen()
      return () => {
      }
    }, [])

    const handleChange = (e) => {
      setValue(e.target.value);
      handleFeatureType(e.target.value)
    };
    const  handleNameChange=(event)=>{
      setname(event.target.value)
    }
    const saveFeature=()=>{
      handleLoading(true)
      sendRequest("maps","","POST",{name:name,wkt:wkt}).then((value)=>{
        handleStateModal(false)
        handleLoading(false)
        alert("Kayıt Başarıyla Eklenmiştir.")
      }).catch((err)=>{
        handleLoading(false)
        console.log(err);
        alert("Kayıt Eklenirken Bir Hata Oluştu")
        return;
      })
    }
  return (
    <>
    {
        isEndFeatureModalOpen && wkt &&(
          <div className=''>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style} className='modalDiv '>
                  <Typography id="modal-modal-title " variant="h6" component="h2" className=' m-2' >
                    Koordinat Ekranı
                    <span><hr /></span>
                    <input type="text" placeholder='Isim Giriniz' className='form-control' onChange={handleNameChange}/>
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <label className='border-bottom mb-2'>Koordinat Verisi   </label> <br />
                    {wkt} <br /> <hr />
                    <div className='d-flex m-2 m-auto'>
                      <Button  className='border m-2 m-auto'onClick={saveFeature}>Kaydet</Button>
                      <Button className='border  m-2 m-auto' onClick={handleClose}>Çık</Button>
                    </div>
                  </Typography>
                </Box>
              </Modal>
            </div>
    ) 
    }
    </>

  )
}

export default EndFeatureModal