import React, { useState } from 'react'
import { sendRequest, sendRequestWMS } from '../services/httpClient.service'
import { useMyContext } from '../context/DataContext';
import ImageLayer from 'ol/layer/Image';
import { ImageStatic, XYZ } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
function GetWMS({handleWmslayerData,clearWms}) {
  const [imageUrl, setimageUrl] = useState()
    const {handleLoading} = useMyContext()
    const [pngData, setPngData] = useState(null);
    const [layer, setlayer] = useState(null);
    const [isWmsActive, setIsWmsActive] = useState(false)
    
    const getWms=()=>{
        sendRequestWMS("GetWMS","","GET").then((result)=>{
          console.log(result.body.getReader().read().then(({value,done})=>{
            console.log("image geldi");
            if(!done){
              const blob = new Blob([value], { type: 'image/png' });
              const _imageUrl = URL.createObjectURL(blob);
              setimageUrl(_imageUrl)
              console.log(_imageUrl);
              var imageBounds = [24.713407516479492, 32.70863342285156, 46.297359466552734, 42.6185417175293];
              const imageLayer = new ImageLayer({
                name:"imageLayer",
                source: new ImageStatic({
                  url: _imageUrl,
                  projection: 'EPSG:4326',
                  imageExtent: imageBounds
                })
              });
              handleWmslayerData(imageLayer);
              setIsWmsActive(true);
            }
          }));
        })
    }
const [imgSrc, setimgSrc] = useState()

  return (
    <div>
        {/* {imgSrc!==null ?
            <img src={imgSrc} alt="" />:""
        } */}
        {
          isWmsActive ===false ?<button className='wmsButton btn btn-danger' onClick={getWms}>WMS Harita Getir</button>:
        <button className='wmsButton btn btn-danger' onClick={()=>{
          clearWms()
          setIsWmsActive(false);
        }}>WMS Haritayı Kapat</button>
        }
    </div>
  )
}

export default GetWMS