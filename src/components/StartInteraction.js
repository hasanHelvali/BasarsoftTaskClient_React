import React from 'react'
import { Button } from 'primereact/button';    
import { useState } from 'react';
import { useEffect } from 'react';
import { Interaction } from 'ol/interaction';
function StartInteraction({startedInteraction,handleCloseInteraction,intersec}) {
const [customIntersec, setcustomIntersec] = useState()

useEffect(() => {
    console.log(intersec);
}, [intersec])

    
  return (
    <>
      <div id="popup" >
    {  intersec ?
      <div className='ol-popup z-3 '>
              <a id="popup-closer" className="ol-popup-closer" style={{"cursor":" pointer" ,"zIndex":"10000000000000000"}} onClick={handleCloseInteraction}></a>
              <div id="popup-content">
                  {/* <span *ngIf="customIntersec.name && customIntersec.hdms">{{customIntersec.name}} {{customIntersec.hdms}}</span> */}
                  <span >{intersec?.name} <br/> {intersec?.hdsm}</span>
              </div> 
      </div>  
       :""
      }
      </div>

    </>
    /*Buradaki  */
  )
}

export default StartInteraction
