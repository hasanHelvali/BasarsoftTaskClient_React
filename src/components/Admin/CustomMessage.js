import React from 'react'
import { Message } from 'primereact/message';

function CustomMessage({message,severity}) {
//css kısmı eksik
  return (
    <>
        <div class="card messageCard" >
            <Message text={message} severity={severity} />
        </div>
    </>
  )
}

export default CustomMessage