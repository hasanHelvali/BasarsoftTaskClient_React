import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useMyContext } from '../context/DataContext'
import { sendRequest } from '../services/httpClient.service'

function GetWFS({handleIsOpenAllFeatureModal,handleSelectedFeatureWFSMap,handleClearWfs,handleFeatureDistanceActive}) {
    const [isVisibleWfsModal, setisVisibleWfsModal] = useState(false)
    const [isWFSActive, setisWFSActive] = useState(false)
    const {handleLoading}=useMyContext();
    const [allFeature, setAllFeature] = useState([])
    const [featureCount, setfeatureCount] = useState(0)
    useEffect(() => {
        if(featureCount>1){
            handleFeatureDistanceActive();
        }
    }, [featureCount])

    function handleSelectedFeature(e){
        //burada ilgiliveri alındı. Simdi bunu haritada gostermek gerekiyor.
        handleClose();
        // handleSelectedFeatureWFSMap(e.id)
        handleLoading(true)
        const id=e.id;
        sendRequest("GetWFS","GetWfsById","GET",null,id).then((data)=>{
            handleLoading(false)
            handleSelectedFeatureWFSMap(data)
            setisWFSActive(true)
            setfeatureCount(featureCount+1);
        }).catch((err)=>{
            alert("WFS Alınırken Bir Hata Oluştu...")
            handleLoading(false)
            console.log(err);
            setisWFSActive(false)
        })
    }
    const handleClose=()=>{
        setAllFeature([])
    }
    const getAllWFSFeature=()=>{
        handleLoading(true);
        sendRequest("maps","","GET").then((data)=>{
            console.log(data);
            setAllFeature(data);
            handleLoading(false);
        }).catch((err)=>{
            alert("Kayıt Getirme Islemi Sirasinda Bir Hata Oluştu...")
            handleLoading(false);
        })
    }
    
  return (
    <div className=''>
        <button className='wfsButton btn btn-danger' onClick={getAllWFSFeature}>WFS Getir</button>
        {isWFSActive===true ?
            <button className='wfsButton2 btn btn-danger' onClick={()=>{setisWFSActive(false); handleClearWfs()}}>WFS Temizle</button>:""
        }

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


    </div>
  )
}

export default GetWFS