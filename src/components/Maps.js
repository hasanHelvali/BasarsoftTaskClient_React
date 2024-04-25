import React, {  useContext, useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import './Maps.css'
import { fromLonLat } from 'ol/proj';
import SelectForm from './SelectForm';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Draw, Interaction, Modify, MouseWheelZoom, Snap } from 'ol/interaction';
import GeoLocation from '../models/GeoLocation';
import EndFeatureModal from './EndFeatureModal';
import {  MyProvider,useMyContext } from '../context/DataContext';
import { geometryToWkt } from '../services/geometry-wkt-convert.service';
import { useJwt } from "react-jwt";
import { useNavigate } from 'react-router-dom';
import GeometryListModal from './GeometryListModal';
import { UpdateLocation } from '../models/UpdateLocation';
import WKT from 'ol/format/WKT';
let map;
let vectorLayer;
let drawInteraction;
let type;
// let isEndFeatureModalOpen=false;
let _data;
let snap;

// function addLayer() {
//   vectorLayer = new VectorLayer({
//     source: new VectorSource(),
//     style: {
//       'fill-color': 'rgba(0, 0, 0, 0.3)',
//       'stroke-color': '#000',
//       'stroke-width': 2,
//       'circle-radius': 7,
//       'circle-fill-color': '#ffcc33',
//     },
//     className: 'vecLay',
//   });
//   map.addLayer(vectorLayer);
// }

// function clearFeature(){
//     vectorLayer.getSource().clear();//Burada source icinde ki feature lar temizlendi.
// }


// function addFeature(value) {
  
//   clearFeature()
//   if(value==="") {
//     map.removeInteraction(drawInteraction)
//     return;
//   }
//   vectorLayer.getSource().clear();
//   // this.generalDataService.selectedOptions.next(value)
//   // let that = this;
//   // // this.generalDataService.getFeatureType(value); //service deki feature tipini guncellestiriyorum.
//   drawInteraction = new Draw({
//     type:value 
//     // Çizilebilecek şekil türünü (Point, LineString, Polygon) seciyorum
//   });
  
//   map.addInteraction(drawInteraction); //interaction i map e ekliyorum.
//   // this.changeDetectorRef.detectChanges();
  
//   map.on('click', (event) => {
//     //her click edildiginde
//     const coordinateLong = event.coordinate[0];
//     const coordinateLat = event.coordinate[1];
//   });

//   drawInteraction.on('drawend', function (event) {
//     // that.generalDataService.setLocation(null);
//     // that.generalDataService._wkt=null;
//     //cizim bittiginde
//     clearFeature() 
//     var feature = event.feature;
//     // const _type: FeatureType = event.feature
//     //   .getGeometry()
//     //   .getType() as FeatureType;

//     vectorLayer.getSource().addFeature(feature);
//     var geometry = feature.getGeometry();
//     const data=new GeoLocation(geometry.getType(),geometry.getCoordinates())
//     _data=data
//     isEndFeatureModalOpen=true;
//     this.handleDataCapture(data)
//     // that.generalDataService.geometryToWkt(feature); //service class ında bir property ye wkt verisi aktarıldı.
//     // that.generalDataService.setLocation(data);
//     // Burada ilgili service yapısına datalar gonderildigi anda ilgili coordinates modalı acılır.
//   });
// }
const Maps = () => {//map component baslangıcı
  // const [isEndFeatureModalOpen, setIsEndFeatureModalOpen] = useState(false)
  const {isEndFeatureModalOpen,handleStateModal } = useMyContext();
  const navigate = useNavigate();
  const [showFeature, setShowFeature] = useState(null)
  function addFeature(value) {
    clearFeature()
    if(value==="") {
      map.removeInteraction(drawInteraction)
      return;
    }
    vectorLayer.getSource().clear();
    // this.generalDataService.selectedOptions.next(value)
    // let that = this;
    // // this.generalDataService.getFeatureType(value); //service deki feature tipini guncellestiriyorum.
    drawInteraction = new Draw({
      type:value 
      // Çizilebilecek şekil türünü (Point, LineString, Polygon) seciyorum
    });
    map.addInteraction(drawInteraction); //interaction i map e ekliyorum.
    // this.changeDetectorRef.detectChanges();
    
    // map.on('click', (event) => {
    //   //her click edildiginde
    //   const coordinateLong = event.coordinate[0];
    //   const coordinateLat = event.coordinate[1];
    // });

    drawInteraction.on('drawend', function (event) {
      // that.generalDataService.setLocation(null);
      // that.generalDataService._wkt=null;
      //cizim bittiginde
      handleStateModal(true)

      var feature = event.feature;
      // const _type: FeatureType = event.feature
      //   .getGeometry()
      //   .getType() as FeatureType;

      vectorLayer.getSource().addFeature(feature);
      var geometry = feature.getGeometry();
      const data=new GeoLocation(geometry.getType(),geometry.getCoordinates())
      _data=data
      // setIsEndFeatureModalOpen(true);
      console.log(data);
      let wkt = geometryToWkt(feature)
      console.log(wkt);
      handleDataCapture(wkt)
      clearFeature() 
      clearInteraction()
      // that.generalDataService.geometryToWkt(feature); //service class ında bir property ye wkt verisi aktarıldı.
      // that.generalDataService.setLocation(data);
      // Burada ilgili service yapısına datalar gonderildigi anda ilgili coordinates modalı acılır.
    });
  }

  function clearFeature(){
    vectorLayer.getSource().clear();//Burada source icinde ki feature lar temizlendi.
  }
  function clearInteraction(){
    map.getInteractions().clear();
  }

  function addLayer() {
    vectorLayer = new VectorLayer({//global degiskene yeni bir layer ekleniyor.
      source: new VectorSource(),
      style: {
        'fill-color': 'rgba(0, 0, 0, 0.3)',
        'stroke-color': '#000',
        'stroke-width': 2,
        'circle-radius': 7,
        'circle-fill-color': '#ffcc33',
      },
      className: 'vecLay',
    });
    map.addLayer(vectorLayer);//layer globvaldeki haritaya ekleniyor.
  }
  
  function _featureType(value){
    console.log(value);
  }
  const { wkt ,handleDataCapture,handleLoading,laoding} = useMyContext()
  const [selectedValue, setSelectedValue] = useState('');
  const [isGeometryListModalOpen, setIsGeometryListModalOpen] = useState(false)
  const [isFeatureChanged, setisFeatureChanged] = useState(false)
  type=selectedValue
    //secilen selectbox degeri icin bir state tutuyorum. Baslangıcta bos degerde.
    
  useEffect(() => {//onInit in muadili bir yapı devrededir.
    handleLoading(false)
    map = new Map({//global degiskene yeni bir map nesnesi atandı.
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat([34.9998, 39.42152]),
        zoom: 6.8
      })
    });
    addLayer();//layer eklendi


    return () => map//ilgili map nesnesi geri donduruluyor.
  }, []);

    const handleSelectChange = (value) => {
      setSelectedValue(value);//ilgili degeri state e alıp guncelliyorum.
      // map.removeInteraction(drawInteraction)
      // return;
      // console.log(value);
      addFeature(value)
    };
    const mapRef = useRef(null);
    
    const logOut = () => {
      localStorage.removeItem('token');
      navigate("/login-register")
    };

    const openGeometryListModal=()=>{
      setIsGeometryListModalOpen(true)
    }
    const handleClose=()=>{
      setIsGeometryListModalOpen(false)
    }
    const handleGetLocation=(item)=>{
      console.log(item);
    }
    const setShowFeatureFunc=(value)=>{//openlayers icin en onemli fonksiyon
      setShowFeature(value);
      console.log(value);
      //id dahil butun veri burada
      
      setIsGeometryListModalOpen(false)
      var geoLoc=new UpdateLocation();
      geoLoc.id=value.id;
      geoLoc.name=value.name;
      geoLoc.type=value.type;
      geoLoc.wkt=value.wkt
      
      //-----------wkt to map feature aşaması------------------
      vectorLayer.getSource().clear();//layer temizlendi
      var format=new WKT();
      const feature = format.readFeature(geoLoc.wkt,{
        dataProjection:'EPSG:4326',
        featureProjection: 'EPSG:3857'
      })
      const source =vectorLayer.getSource();
      source.addFeature(feature);
      map.getView().fit(feature.getGeometry() ,{padding:[40,40,40,40],duration:1000})    

      //-------------------feature modify asaması------------
      const modify = new Modify({source: source});
      map.addInteraction(modify);
      snap = new Snap({source: source});
      map.addInteraction(snap);
      //Feature da degisiklik yapılmasına olanak saglayan yapılar bunlardır.
      modify.on('modifystart', () => {
        // setisFeatureChanged(true);//update modalı acacak olan butonun aktiflestirilmesi
        // feature.modified = true; // Özelliği güncelleme
      });
      modify.on('modifyend', () => {
        setisFeatureChanged(true);//update modalı acacak olan butonun aktiflestirilmesi
        // this.generalDataService.featureUpdate.next(true);
        // this.isFeatureChanged=true
        var geometry = feature.getGeometry();
        const data = {
          type: geometry.getType(),
          coordinates: geometry.getCoordinates(),
        };//guncellenen yapı
        console.log(data);
        // this.generalDataService.updatedLocation=data;
        // _data.type=data.type;
        // _data.coordinates=data.coordinates;
        //Elde edilen son geometri verisini wkt ye tekrardan cast etmem gerek
        // _data.wkt=this.generalDataService.updateGeometryToWkt(feature);
        // this.generalDataService.featureUpdateGeneralData.next(_data);
  
        // Değişiklikler tamamlandı
        console.log(feature);
      });
    }

    const changedFeatureSave=()=>{
      //Burada degistiirilen koordinatlar alınacak ve bir modal a basılacak. Modalın komponent i olusturuldu. 
      //daha sonra guncellenen yeni deger api ye gonderilecek.
    }
    return <>
          <div className="map" ref={mapRef} />
          {/* 
          Bu kod, React bileşenlerinde bir <div> elementi oluşturur ve bu <div> elementine map sınıfını ekler. 
          Ayrıca, bu <div> elementine bir referans ekler, yani mapRef değişkenine atar.
          */}
          <SelectForm onSelectChange={handleSelectChange} />
          {/* SelectForm component ini goruntuye alıyorum. SelectForm dan gecilen props u burada yakalıyorum ve handleSelectChange fonksiyonunu tetikliyorum.*/}
          
          {/* {isEndFeatureModalOpen && <EndFeatureModal onClose={handleCloseModal} />} */}
          {isEndFeatureModalOpen ===true? <EndFeatureModal  />:""}
          {isGeometryListModalOpen===true? <GeometryListModal isGeometryListModalOpen={isGeometryListModalOpen} handleClose={handleClose} showFeature={setShowFeatureFunc}/>:""}
          <button className='btn btn-danger' id='typeButton6' onClick={logOut}>Çıkış</button>
          <button className='btn btn-danger' id='typeButton6' onClick={logOut}>Çıkış</button>
          <button id="typeButton" class="btn btn-danger" onClick={openGeometryListModal}    style={{"background-color": "#fff", "color": "black"}}>Tüm Kayıtlar</button>
          {/* {showFeature!==null? console.log(showFeature):""} */}
          {isFeatureChanged===true? <button className='btn btn-danger' id='typeButton2' onClick={changedFeatureSave} >Değişiklikleri Onayla</button>:""}
    </>
  };
  
  export default Maps;


  /*
   startIntersection(){
      this.vectorLayer.getSource().clear();
      let that=this;
      const drawInteraction = new Draw({
        type: "Point", // Çizilebilecek şekil türünü (Point, LineString, Polygon) seciyorum
      });//point olusuturukldu
      this.map.addInteraction(drawInteraction);//Point seklindeki interaction haritaya eklendi.
      
      drawInteraction.on('drawstart', function (event) {
        
      })
        drawInteraction.on('drawend', function (event) {
        that.showSpinner();
        var feature = event.feature;
        var geometry = feature.getGeometry() as any;
        var coordinates= geometry.getCoordinates();
        that.generalDataService.intersectionPosition.next(coordinates);
        if( that.overlay.getElement()){
          that.overlay.setPosition(coordinates)
          console.log("setposiiton var");
        }
        that.changeDetectorRef.detectChanges()

        const _type: FeatureType = event.feature
          .getGeometry()
          .getType() as FeatureType;

          var geometry = feature.getGeometry() as any;

        var format = new WKT();

        const _locWkt = format.writeGeometry(feature.getGeometry(), {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        });

        const role = that.generalDataService.role;//rolu aldım.
        const id = that.generalDataService.identifier;
        var interactAuth:InteractionAuth=new InteractionAuth();
        interactAuth.pointWKT=_locWkt
        interactAuth.role=role;
        interactAuth.id=id;

        that.httpCLientService.post<any>({controller:"maps",action:"InteractionExists"},interactAuth).subscribe({//kesisim varsa
          next:(data)=>{
            that.showSpinner();
            if(data==null){
              that.generalDataService.modelIntersection.next("Bir Kesişim Bulunamadı.");
              that.generalDataService.intersectionActive.next(false);
              that.vectorLayer.getSource().clear()
              that.changeDetectorRef.detectChanges()
              that.hideSpinner();
              return 
            }
            that.hideSpinner();

            that.intersection=data as LocAndUsers;
            that.overlay = new Overlay({
              element: document.getElementById('popup'),
              autoPan: true,
            });

            that.map.addOverlay(that.overlay);
            const hdms = toStringHDMS(toLonLat(coordinates));
            that.generalDataService.modelIntersection.next({hdms:hdms,name:data.name });
            that.overlay?.setPosition(coordinates);
            that.vectorLayer.getSource().addFeature(feature);
            that.changeDetectorRef.detectChanges();
            that.hideSpinner();
            
          },
          error:(err)=>{
            alert("Kesisim veya Yetki Yok")
            that.hideSpinner();
            that.generalDataService.modelIntersection.next("Bir Kesişim Bulunamadı.");
              that.generalDataService.intersectionActive.next(false);
              that.vectorLayer.getSource().clear()
              that.generalDataService.closeIntersection.next(true);
              that.hideSpinner();
              that.changeDetectorRef.detectChanges()
            that.closeToolTip();
          }
        }) 
        that.map.on('click', (event) => {
           that.clearFeature()
           that.pixel = event.pixel
           that.changeDetectorRef.detectChanges()
        });
        })
  }
   */