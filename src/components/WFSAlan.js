import React, { useEffect, useState } from 'react'
import { useMyContext } from '../context/DataContext'
import { sendRequest } from '../services/httpClient.service'
import { Button, Modal } from 'react-bootstrap'
function WFSAlan({allWfs,clearAlan}) {
    const [allWfsFeature, setallWfsFeature] = useState([])
    const {handleLoading}=useMyContext()
    const [isAlanActive, setisAlanActive] = useState(false)
    const getAllWFS=()=>{
        setisAlanActive(true)
        handleLoading(true)
        sendRequest("Maps","","GET").then((data)=>{
            console.log(data);
            setallWfsFeature(data);
            allWfs(data)
            handleLoading(false)
        }).catch((err)=>{
            alert("WFS Alınırken Bir Hata Oluştu...")
            handleLoading(false)
            setallWfsFeature(null)
            console.log(err);
        })
    }
    const handleSelectedFeature=()=>{

    }
    useEffect(() => {
    }, [])
    const handleClose=()=>{
        setallWfsFeature([])
    }
  return (
    <div>
        {isAlanActive===false?
            <button className='btn btn-danger wfsAlan' onClick={()=>{getAllWFS();}}>WFS Alan Hesapla</button>:
            <button className='btn btn-danger wfsAlan' onClick={()=>{{clearAlan(); setisAlanActive(false)}}}>WFS Alan Temizle</button>
        }
    </div>
  )
}

export default WFSAlan