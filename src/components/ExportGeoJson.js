import React, { useEffect } from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useMyContext } from '../context/DataContext';
import { sendRequest } from '../services/httpClient.service';
import { Table } from 'react-bootstrap';
import { FaFileDownload } from "react-icons/fa";
function ExportGeoJson() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [tableNames, setTableNames] = useState([])
    const {handleLoading}=useMyContext();
    useEffect(() => {
      if (show) {
        handleLoading(true)
        sendRequest("maps", "GetLocationTableName", "GET", null)
            .then((tableDatas) => {
                handleLoading(false)
                console.log(tableDatas);
                setTableNames(tableDatas);
            })
            .catch((err) => {
                handleLoading(false)
                console.error(err);
            });
        }
    }, [show])

    const saveFile=(fileName)=>{
      console.log(fileName);
      handleLoading(true)
      sendRequest("maps","GetLocationByGeoJsonData","GET",null,tableNames).then((geoJsonData)=>{
        //Get isteklerinde body kullanımı desteklenmez. Bu sebeple direkt null verildi.
        console.log(geoJsonData);
        handleLoading(false)
        downloadGeoJSON(geoJsonData,fileName);
        
      }).catch((err)=>{
        handleLoading(false)
      })
    }
    const downloadGeoJSON = (geoJsonData,fileName) => {
      const geoJsonString = JSON.stringify(geoJsonData);
      const blob = new Blob([geoJsonString], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      const _fileName = `${fileName}.geojson`; // Dosya adı

        // Dosyayı indirmek için bir link oluştur
      link.download = _fileName;

      link.click();
      handleClose();
    }
    function renderTable(){
      return (
        <Table  bordered hover className='text-center' title=''>
                <thead className='text-center' >
                    <th>Tablo Adı</th>
                    <th>İndir</th>
                </thead>
                <tbody>
                  {tableNames.map((name,index)=>(
                    <tr key="index">
                      <td>{name}</td>
                      <td className='cursor-pointer'> <FaFileDownload style={{cursor:"pointer"}} size={"30px"} onClick={()=>saveFile(name)}/></td>
                    </tr>
                  ))}
                </tbody>
          </Table>
      )
    }
  return (
    <>
      <button className="btn btn-danger exportButton" onClick={handleShow}>Export GeoJSON File</button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body> {renderTable()}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      </>
  )
}

export default ExportGeoJson