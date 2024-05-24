import React, { useEffect, useRef } from 'react'
import { useMyContext } from '../context/DataContext';
function UploadGeojson({GeoJsonView}) {
   const {handleGeoJsonFile}= useMyContext()
   useEffect(() => {
   }, [])
   
    const fileInputRef = useRef(null);
    /* React kütüphanesini ve useRef kancasını içe aktarır. useRef, React bileşenleri içerisinde referanslar oluşturmak için kullanılır.
    Bu satır: fileInputRef adında bir referans oluşturur ve bunu null ile başlatır. Bu referans, dosya girişi (input) 
    elemanına erişmek için kullanılacaktır.*/
    
    const handleButtonClick = () => {
        fileInputRef.current.click();//fileInputRef referansına tıklandıgı yani 
        /* handleButtonClick adlı bir olay işleyicisi fonksiyonu tanımlar. Bu fonksiyon, 
        butona tıklanıldığında fileInputRef ile referans verdiğimiz input elemanını programlı olarak tıklatır (click()).
         */
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          // Dosya ile yapılacak işlemleri burada yapılır
          handleGeoJsonFile(file)
          GeoJsonView()
          fileInputRef.current.value = null;
        }
      };
  return (
    <div>
      <button className="btn btn-danger uploadButton" onClick={handleButtonClick}>Upload GeoJSON File</button>
      <input
        type="file"
        ref={fileInputRef}//ilgili referans input a baglandı. fileInputRef.current.click(); calıstıgında fileDialog calısacak.
        style={{ display: 'none' }}
        accept=".geojson"
        onChange={handleFileChange}//secili dosyayı elde ediyoruz.
      />
    </div>
  )
}

export default UploadGeojson