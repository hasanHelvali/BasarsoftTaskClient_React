import React, { useEffect } from "react";
import { PieChart } from '@mui/x-charts/PieChart';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { sendRequest } from "../services/httpClient.service";
import { useMyContext } from "../context/DataContext";
import Form from 'react-bootstrap/Form';
function Chart({handleClose}) {  
    const [show, setShow] = useState(true);

//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);
  const {handleLoading,role}=useMyContext()
  const [getLogsAnalyse, setgetLogsAnalyse] = useState()
  const [logTime, setlogTime] = useState(1)
  useEffect(() => {
    handleLoading(true)
    sendRequest("LogAnalyse","","GET",null,logTime).then((logData)=>{
          handleLoading(false)
        console.log(logData);
    }).catch((err)=>{
          handleLoading(false)
          console.log(err);
    });
  }, [logTime])
  const handleChange=(val)=>{
    setlogTime(val.target.value)
  }
  function getModal(){
        return <>

            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Log Analizi</Modal.Title> <hr/>
               
              </Modal.Header>
              <Modal.Body>
              <Form.Select aria-label="Default select example d-block" onChange={handleChange}>
                    <option>Zaman Aralığı Seçin</option>
                    <option value="1">1 Günlük</option>
                    <option value="7">1 Haftalık</option>
                    <option value="30">1 Aylık</option>
                </Form.Select> <hr/>
                  <PieChart
                  series={[
                      {
                          data: [
                              {value: 10, label: 'series A' },
                              {value: 15, label: 'series B' },
                              {value: 20, label: 'series C' },
                          ],
                      },
                  ]}
                  width={400}
                  height={200}
                  />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleClose}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
                  </>
  }
    return (getModal());

} 
export default Chart;
