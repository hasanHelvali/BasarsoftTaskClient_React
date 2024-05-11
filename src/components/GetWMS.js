import React, { useState } from 'react'
import { sendRequest, sendRequestWMS } from '../services/httpClient.service'
import { useMyContext } from '../context/DataContext';
import ImageLayer from 'ol/layer/Image';
import { ImageStatic, XYZ } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
function GetWMS({handleWmslayerData}) {
    const {handleLoading} = useMyContext()
    const [pngData, setPngData] = useState(null);
    const [layer, setlayer] = useState(null);

    
    const getWms=()=>{
        //  sendRequestWMS("GetWMS","","GET")
        //     .then(async (response)=>{
        //         console.log(response.body);
        //         // setPngData(response.pngData);
        //         // handleWmslayerData(response.pngData)
        //         const pngDataUrl = URL.createObjectURL(response.body); // PNG görüntüsünün veri URL'si
        //         const imageLayer = new Image({
        //             source: new ImageStatic({
        //                 url: pngDataUrl,
        //                 imageSize: [250, 250], // Görüntünün boyutu
        //                 projection: 'EPSG:4326', // Koordinat sistemi
        //                 // imageExtent: [minx, miny, maxx, maxy] // Görüntünün koordinatları
        //             })
        //         });
        //         handleWmslayerData(imageLayer)
        //     });
        //     // setimgSrc(blob)
        handleWmslayerData();
    }
const [imgSrc, setimgSrc] = useState()

  return (
    <div>
        {imgSrc!==null ?
            <img src={imgSrc} alt="" />:""
        }
        <button className='wmsButton btn btn-danger' onClick={getWms}>WMS Harita Getir</button>
    </div>
  )
}

export default GetWMS