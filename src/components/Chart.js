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
  const [logsAnalyse, setLogsAnalyse] = useState([])
  const [logTime, setlogTime] = useState(1)
  useEffect(() => {
    handleLoading(true)
    sendRequest("LogAnalyse","","GET",null,logTime).then((logData)=>{
          handleLoading(false)
          analyseStart(logData)
    }).catch((err)=>{
          handleLoading(false)
          console.log(err);
    });
  }, [logTime])
  const handleChange=(val)=>{
    setlogTime(val.target.value)
  }
  function analyseStart(logs){
    console.log(logs);
    const logUserDatas=logs.map(item=>{
      var parsedMessage=JSON.parse(item.message)
      console.log(parsedMessage);
      // return parsedMessage.userName
      return parsedMessage
    })
    const userCount = logUserDatas.reduce((acc, curr) => {
      const userName = curr.userName;
      if (acc[userName]) {
        acc[userName]++;
      } else {
        acc[userName] = 1;
      }
      return acc;
    }, {});
    console.log(userCount);
    const transformedData = Object.keys(userCount).map(key => {
      return {
        value: userCount[key],
        label: key
      };
    });
    setLogsAnalyse(transformedData)
  }
  function getModal(){
        return <>

            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Log Analizi</Modal.Title> <hr/>
               
              </Modal.Header>
              <Modal.Body>
              <Form.Select aria-label="Default select example d-block" onChange={handleChange} defaultValue={"1"}>
                    {/* <option>Zaman Aralığı Seçin</option> */}
                    <option value="1">1 Günlük</option>
                    <option value="7">1 Haftalık</option>
                    <option value="30">1 Aylık</option>
                </Form.Select> <hr/>
                  <PieChart
                  series={[
                      {
                            data: logsAnalyse
                      },
                  ]}
                  width={400}
                  height={200}
                  />
              </Modal.Body>
              <Modal.Footer>
              </Modal.Footer>
            </Modal>
                  </>
  }
    return (getModal());

} 
export default Chart;
