import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useMyContext } from '../context/DataContext';
import Table from 'react-bootstrap/Table';
import WKT from 'ol/format/WKT';
import { GeoJSON } from 'ol/format';
import { Feature } from 'ol';
import { sendRequest } from '../services/httpClient.service';
import { LineString, Point, Polygon } from 'ol/geom';
import { LocAndUsers } from '../models/LocAndUser';
function GeoJsonFileView({ isShow, handleCloseComp }) {
    const { geoJsonFile, handleGeoJsonFile } = useMyContext();
    const [parsedGeoJson, setParsedGeoJson] = useState(null);
    const [selectedFeatures, setSelectedFeatures] = useState({});
    const {handleLoading}=useMyContext();
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
                        <th>Uygula</th>
                        {headers.map(header => (
                            <th key={header}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                {/* Her bir feature için bir satır oluşturun */}
                {parsedGeoJson.features.map((feature, index) => (
                    <tr key={index}>
                            <input
                                type="checkbox"
                                checked={!!selectedFeatures[index]}
                                onChange={() => handleCheckboxChange(index)}
                                /*Her degistiginde handleCheckboxChange tetiklenir. Ilgili index parametre olarak gecilir. */
                            />
                        {/* Her özelliği uygun sütuna yerlestirilir */}
                        <td>{feature.properties.id}</td>
                        <td>{feature.properties.name}</td>
                        <td>{feature.geometry.type}</td>
                        <td>{wktGeometries[index]}</td>
                    </tr>
                ))}
            </tbody>
            </Table>
        );
    };

    const handleCheckboxChange = (index) => {
        setSelectedFeatures(prev => ({
            ...prev,//ne kadar deger varsa bunları alor.
            //...prev: Spread operatörü kullanılarak önceki state'in (yani selectedFeatures'in) tüm mevcut anahtar-değer çiftleri kopyalanır.
            [index]: !prev[index]//sadece ilgili indexi tersine cevirir.
            //[index]: !prev[index]: Verilen index için mevcut değerin tersine çevrilmiş hali (true ise false, false ise true) yeni değere atanır.
        }));
    };

    const handleSave = () => {
        const wktFormat = new WKT();
        const geoJsonFormat = new GeoJSON();

        const selectedData = parsedGeoJson.features.filter((_, index) => selectedFeatures[index]);
        //parsedGeoJson daki bilgilerden state te true olarak isaretlenenleri alır.

        console.log("Selected features:", selectedData);
        // İlgili veriyi burada işleyebilir veya kaydedebilirsiniz


        // const features = selectedData.map(data=>{
        //     console.log(data.geometry);
        //     data.geometry.map(jsonFeature => {//feature uzerinde donuyoruz
        //         const geometry = geoJsonFormat.readGeometry(jsonFeature.geometry);//ilgili geometry filed i bir degisken uzeirne alındı. Burada GeoJSON sınıfını kullandık.
        //         const feature = new Feature({ geometry });//feature a cevrildi.
        //         return feature;//feature lar birikimli bir sekilde donuldu.
        //     });
        // })
    //    const features = selectedData.map(data=>{
    //         const features = data.features.map(jsonFeature => {//feature uzerinde donuyoruz
    //             const geometry = geoJsonFormat.readGeometry(jsonFeature.geometry);//ilgili geometry filed i bir degisken uzeirne alındı. Burada GeoJSON sınıfını kullandık.
    //             const feature = new Feature({ geometry });//feature a cevrildi.
    //             return feature;//feature lar birikimli bir sekilde donuldu.
    //         });
    //         return features;
    //     })
        // console.log(features);
        
        // const wktGeometries = features.map(feature => {//feature lar uzerinde donuyoruz.
        //     const wktGeometry = wktFormat.writeFeature(feature);//feature lar wkt ye yazıldı. 
        //     return wktGeometry;//birikimli bir sekilde donuldu.
        // });
        const createGeometry = (type, coordinates) => {
            switch (type) {
                case 'Point':
                    return new Point(coordinates);
                case 'LineString':
                    return new LineString(coordinates);
                case 'Polygon':
                    return new Polygon(coordinates);
                default:
                    throw new Error(`Unsupported geometry type: ${type}`);
            }
        };
        
        const result = selectedData.map(feature => {
            const name = feature.properties.name;
            const type = feature.geometry.type;
            const coordinates = feature.geometry.coordinates;
            
            // Dinamik olarak geometri oluşturma
            const geometry = createGeometry(type, coordinates);//feature olsuturduk.
            
            // WKT formatına dönüştürme
            const wkt = wktFormat.writeGeometry(geometry);
            
            const locAndUser=new LocAndUsers();
            locAndUser.name=name;
            locAndUser.type=type;
            locAndUser.wkt=wkt;
            return locAndUser
        });
        console.log(result);
        handleLoading(true)
        sendRequest("maps","GeoJsonSaveList","POST",result).then((value)=>{
            handleLoading(false)
            alert("Kayıt Başarıyla Eklenmiştir.")
            handleClose();
          }).catch((err)=>{
            handleLoading(false)
            console.log(err);
            alert("Kayıt Eklenirken Bir Hata Oluştu")
            handleClose()
            return;
          })
    };
    return (
        <Modal show={isShow} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>GeoJSON Data</Modal.Title>
            </Modal.Header>
            <Modal.Body>{renderTable()}</Modal.Body>
            <Modal.Footer>
                <Button variant="warning" onClick={handleSave}>
                    {/* handleSave Tetiklenir. */}
                    Save
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default GeoJsonFileView;
