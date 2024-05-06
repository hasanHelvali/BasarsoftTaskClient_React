import React, { useEffect, useState } from 'react'
import { Message } from 'primereact/message';
function CustomMessage({message,severity}) {
  const [showMessage, setshowMessage] = useState(true)
  useEffect(() => {
      const timer=setTimeout(()=>{
      setshowMessage(false);        
      })
      return () => clearTimeout(timer);
  }, [])
  
//css kısmı eksik
  return (
    <>
    {
        // <div className="card messageCard message-container message" >
        //     <Message text={message} severity={severity} />
        // </div>
        
        // :""
      <div className={`alert alert-${severity}`}>
          <div className="message">{message}</div>
      </div>
      }
    </>
  )
}

export default CustomMessage