import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useMyContext } from '../context/DataContext';
import Table from 'react-bootstrap/Table';
import WKT from 'ol/format/WKT';
import { GeoJSON } from 'ol/format';
import { Feature } from 'ol';
function GeoJsonFileView({ isShow, handleCloseComp }) {
    const { geoJsonFile, handleGeoJsonFile } = useMyContext();
    const [parsedGeoJson, setParsedGeoJson] = useState(null);

    const handleClose = () => {
        handleCloseComp();
        handleGeoJsonFile(null);
    };

    useEffect(() => {
        if (geoJsonFile) {
            // geoJsonFile değişkeninin dolu olup olmadığını kontrol ediyoruz. Eğer dolu ise dosya okuma işlemine başlıyoruz.
            const reader = new FileReader();
            // FileReader API'sini kullanarak yeni bir dosya okuma nesnesi oluşturuyoruz. Bu nesne, dosya içeriğini okuma ve işleme işlemlerini sağlar.
    
            reader.onload = function (e) {
                // reader nesnesine bir 'load' olayı işleyicisi ekliyoruz. Bu fonksiyon, dosya okuma işlemi tamamlandığında çalıştırılır.
                const text = e.target.result;
                // Okunan dosyanın içeriği `e.target.result` ile alınır ve `text` değişkenine atanır.
    
                try {
                    const geoJson = JSON.parse(text);
                    // `text` değişkenindeki dosya içeriğini JSON formatında ayrıştırıyoruz ve `geoJson` değişkenine atıyoruz.
                    setParsedGeoJson(geoJson);
                    // Ayrıştırılan JSON verisini `parsedGeoJson` state'ine set ediyoruz. Bu state daha sonra bileşenin render edilmesi sırasında kullanılacak.
                    console.log("GeoJSON data:", geoJson);
                    // Ayrıştırılan JSON verisini konsola yazdırıyoruz.
                } catch (error) {
                    console.error("Error parsing GeoJSON:", error);
                    // Eğer JSON ayrıştırma işlemi sırasında bir hata meydana gelirse, bu hata yakalanır ve konsola yazdırılır.
                }
            };
    
            reader.readAsText(geoJsonFile);
            // reader nesnesine, `geoJsonFile` dosyasını metin olarak okumasını söylüyoruz. Bu işlem `onload` olayını tetikleyecek ve yukarıdaki fonksiyon çalışacak.
        }
    }, [geoJsonFile]);
    
    const renderTable = () => {
        const wktFormat = new WKT();
        const geoJsonFormat = new GeoJSON();
        const headers = ['ID', 'Name', 'Type', 'WKT Coordinates'];

        if (!parsedGeoJson || !parsedGeoJson.features || parsedGeoJson.features.length === 0) {
            return <p>No valid GeoJSON data available</p>;
        }
        // console.log(parsedGeoJson);

        const features = parsedGeoJson.features.map(jsonFeature => {//feature uzerinde donuyoruz
            const geometry = geoJsonFormat.readGeometry(jsonFeature.geometry);//ilgili geometry filed i bir degisken uzeirne alındı. Burada GeoJSON sınıfını kullandık.
            const feature = new Feature({ geometry });//feature a cevrildi.
            return feature;//feature lar birikimli bir sekilde donuldu.
        });
        
        const wktGeometries = features.map(feature => {//feature lar uzerinde donuyoruz.
            const wktGeometry = wktFormat.writeFeature(feature);//feature lar wkt ye yazıldı. 
            return wktGeometry;//birikimli bir sekilde donuldu.
        });
        // console.log(wktGeometries);
        
        return (
            <Table striped bordered hover>
                <thead>
                    <tr> 
                        {headers.map(header => (
                            <th key={header}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                {/* Her bir feature için bir satır oluşturun */}
                {parsedGeoJson.features.map((feature, index) => (
                    <tr key={index}>
                        {/* Her özelliği uygun sütuna yerleştirin */}
                        <td>{feature.properties.id}</td>
                        <td>{feature.properties.name}</td>
                        <td>{feature.geometry.type}</td>
                        <td>{wktGeometries[index]}</td>
                    </tr>
                    /*Bundan sonra yapılacak islem ise buradaki objeleri bir nesneye map leyecez. Daha sonrasında butun listedeki gosterimlerin yanına 
                    bir selectbox koyup gidecek verileri elde edip en sonunda secili verileri gonderecez. */
                ))}
            </tbody>
            </Table>
        );
    };

    return (
        <Modal show={isShow} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>GeoJSON Data</Modal.Title>
            </Modal.Header>
            <Modal.Body>{renderTable()}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default GeoJsonFileView;
