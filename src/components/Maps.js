import React, { useContext, useEffect, useRef, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import "./Maps.css";
import { fromLonLat, toLonLat } from "ol/proj";
import SelectForm from "./SelectForm";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import ImageLayer from 'ol/layer/Image';
import ImageStatic from 'ol/source/ImageStatic';
import GeoJSON from 'ol/format/GeoJSON';
import RegularShape from 'ol/style/RegularShape';
import {
  Draw,
  Interaction,
  Modify,
  MouseWheelZoom,
  Select,
  Snap,
} from "ol/interaction";
import GeoLocation from "../models/GeoLocation";
import EndFeatureModal from "./EndFeatureModal";
import { MyProvider, useMyContext } from "../context/DataContext";
import { geometryToWkt } from "../services/geometry-wkt-convert.service";
import { useJwt } from "react-jwt";
import { useNavigate } from "react-router-dom";
import GeometryListModal from "./GeometryListModal";
import { UpdateLocation } from "../models/UpdateLocation";
import WKT from "ol/format/WKT";
import UpdateModal from "./UpdateModal";
import AllFeatureModal from "./AllFeatureModal";
import { Feature, Overlay, Tile } from "ol";
import { InteractionAuth } from "../models/InteractionAuth";
import StartInteraction from "./StartInteraction";
import { sendRequest, sendRequestWMS } from "../services/httpClient.service";
import { toStringHDMS } from "ol/coordinate";
import { CustomIntersection } from "../models/Interaction";
import VerifyToken from "../services/Auth.service";
import GetWMS from "./GetWMS";
import LayerGroup, { GroupEvent } from "ol/layer/Group";
import GetWFS from "./GetWFS";
import { VscDebugPause } from "react-icons/vsc";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import Icon from "ol/style/Icon";
import { LineString, Point, Polygon } from "ol/geom";
import { Circle } from 'ol/style';
import WFSAlan from "./WFSAlan";
import { click } from "ol/events/condition";
import Chart from "./Chart";

let map;
let vectorLayer;
let drawInteraction;
let type;
// let isEndFeatureModalOpen=false;
let _data;
let snap;
let overlay;
let interaction;
const Maps = ({ handleSelectedFeatureMap, handleCloseInteraction }) => {
  //map component baslangıcı
  // const [isEndFeatureModalOpen, setIsEndFeatureModalOpen] = useState(false)
  const {
    isEndFeatureModalOpen,
    handleStateModal,
    role,
    username,
    identifier,
  } = useMyContext();
  const navigate = useNavigate();
  const [showFeature, setShowFeature] = useState(null);
  const [isAllFeatureButtonActive, setisAllFeatureButtonActive] =
    useState(true);
  const [isOpenAllFeatureModel, setisOpenAllFeatureModel] = useState(false);
  const [allFeature, setallFeature] = useState([]);
  const [selectedPrimeModalFeature, setSelectedPrimeModalFeature] = useState();
  const [isStartInteractionButtonDisable, setIsStartInteractionButtonDisable] =
    useState(false);
  const [intersec, setintersec] = useState();
  const [
    openGeometryListModalButtonDisable,
    setopenGeometryListModalButtonDisable,
  ] = useState(false);
  const [allFeatureListButtonDisable, setAllFeatureListButtonDisable] =
    useState(false);
  const [selectFormActive, setselectFormActive] = useState(false);

  const [featureDistanceIsActive, setFeatureDistanceIsActive] = useState(false)

  const [isLogAnalyseActive, setisLogAnalyseActive] = useState(false)

  const wfsVectorLayer = new VectorLayer({
    source: undefined,
    style: new Style({
      stroke: new Stroke({
        color: 'blue',
        width: 3
      }),
      fill: new Fill({
        color: 'rgba(0, 0, 255, 0.1)'
      })
    })
  });

  handleSelectedFeatureMap = (value) => {
    // setSelectedPrimeModalFeature(value)
    console.log(value);
    vectorLayer.getSource().clear();
    var format = new WKT();
    const feature = format.readFeature(value.wkt, {
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    });
    const source = vectorLayer.getSource();
    source.addFeature(feature);
    map.getView().fit(feature.getGeometry(), {
      padding: [40, 40, 40, 40],
      duration: 1000,
    });
  };


  function addFeature(value) {
    clearFeature();
    if (value === "") {
      map.removeInteraction(drawInteraction);
      return;
    }
    vectorLayer.getSource().clear();
    // this.generalDataService.selectedOptions.next(value)
    // let that = this;
    // // this.generalDataService.getFeatureType(value); //service deki feature tipini guncellestiriyorum.
    drawInteraction = new Draw({
      type: value,
      // Çizilebilecek şekil türünü (Point, LineString, Polygon) seciyorum
    });
    map.addInteraction(drawInteraction); //interaction i map e ekliyorum.
    // this.changeDetectorRef.detectChanges();

    // map.on('click', (event) => {
    //   //her click edildiginde
    //   const coordinateLong = event.coordinate[0];
    //   const coordinateLat = event.coordinate[1];
    // });

    drawInteraction.on("drawend", function (event) {
      // that.generalDataService.setLocation(null);
      // that.generalDataService._wkt=null;
      //cizim bittiginde
      console.log("*********");
      handleStateModal(true);

      var feature = event.feature;
      // const _type: FeatureType = event.feature
      //   .getGeometry()
      //   .getType() as FeatureType;

      vectorLayer.getSource().addFeature(feature);
      var geometry = feature.getGeometry();
      const data = new GeoLocation(
        geometry.getType(),
        geometry.getCoordinates()
      );
      _data = data;
      // setIsEndFeatureModalOpen(true);
      console.log(data);
      let wkt = geometryToWkt(feature);
      console.log(wkt);
      handleDataCapture(wkt);
      clearFeature();
      clearInteraction();
      // that.generalDataService.geometryToWkt(feature); //service class ında bir property ye wkt verisi aktarıldı.
      // that.generalDataService.setLocation(data);
      // Burada ilgili service yapısına datalar gonderildigi anda ilgili coordinates modalı acılır.
    });
  }

  function clearFeature() {
    vectorLayer.getSource().clear(); //Burada source icinde ki feature lar temizlendi.
  }
  function clearInteraction() {
    map.getInteractions().clear();
  }

  function addLayer() {
    vectorLayer = new VectorLayer({
      //global degiskene yeni bir layer ekleniyor.
      source: new VectorSource(),
      style: {
        "fill-color": "rgba(0, 0, 0, 0.3)",
        "stroke-color": "#000",
        "stroke-width": 2,
        "circle-radius": 7,
        "circle-fill-color": "#ffcc33",
      },
      className: "vecLay",
      
    });
    map.addLayer(vectorLayer); //layer globvaldeki haritaya ekleniyor.
  }

  function _featureType(value) {
    console.log(value);
  }
  const { wkt, handleDataCapture, handleLoading, laoding } = useMyContext();
  const [selectedValue, setSelectedValue] = useState("");
  const [isGeometryListModalOpen, setIsGeometryListModalOpen] = useState(false);
  const [isFeatureChanged, setisFeatureChanged] = useState(false);
  const [newCoordinates, setnewCoordinates] = useState();
  const [updatedFeature, setUpdatedFeature] = useState();
  const [isOpenupdatedFeatureModal, setIsOpenupdatedFeatureModal] =useState(false);
  type = selectedValue;
  //secilen selectbox degeri icin bir state tutuyorum. Baslangıcta bos degerde.

  useEffect(() => {
    //onInit in muadili bir yapı devrededir.
    handleLoading(true);
    VerifyToken()
      .then((result) => {
        if (result === true) {
          setTimeout(() => {
            handleLoading(false);
          }, 500);
        } else {
          navigate("/login-register");
          localStorage.removeItem("token");
          handleLoading(false);
          return;
        }
      })
      .catch((err) => {
        navigate("/login-register");
        localStorage.removeItem("token");
        handleLoading(false);
        return;
      });


    map = new Map({
      //global degiskene yeni bir map nesnesi atandı.
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
          name:"map"
        }),
      ],
      view: new View({
        center: fromLonLat([34.9998, 39.42152]),
        zoom: 6.8,
      }),
    });
    addLayer(); //layer eklendi

 
    let container = document.getElementById("popup");
    overlay = new Overlay({
      element: container,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    });
    map.addOverlay(overlay);
    return () => map; //ilgili map nesnesi geri donduruluyor.
  }, []);

  const handleSelectChange = (value) => {
    clearImageLayer();
    setSelectedValue(value); //ilgili degeri state e alıp guncelliyorum.
    // map.removeInteraction(drawInteraction)
    // return;
    // console.log(value);
    addFeature(value);
  };
  const mapRef = useRef(null);

  const logOut = () => {
    localStorage.removeItem("token");
    navigate("/login-register"); //nedenini bilmedigim bir hata verdi.
    // window.location.href="/login-register";
  };

  const openGeometryListModal = () => {
    clearImageLayer()
    setIsGeometryListModalOpen(true);
  };
  const handleClose = () => {
    setIsGeometryListModalOpen(false);
  };
  const handleGetLocation = (item) => {
    console.log(item);
  };
  const setShowFeatureFunc = (value) => {
    debugger
    //openlayers icin en onemli fonksiyon
    setShowFeature(value);
    //id dahil butun veri burada valeu nun icinde

    setIsGeometryListModalOpen(false);
    var geoLoc = new UpdateLocation();
    geoLoc.id = value.id;
    geoLoc.name = value.name;
    geoLoc.type = value.type;
    geoLoc.wkt = value.wkt;
    //degistiirlmeden onceki veriler geoloc un icinde

    //-----------wkt to map feature aşaması------------------
    vectorLayer.getSource().clear(); //layer temizlendi
    var format = new WKT();
    const feature = format.readFeature(geoLoc.wkt, {
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    });
    const source = vectorLayer.getSource();
    source.addFeature(feature);
    map.getView().fit(feature.getGeometry(), {
      padding: [40, 40, 40, 40],
      duration: 1000,
    });

    //-------------------feature modify asaması------------
    const modify = new Modify({ source: source });
    map.addInteraction(modify);
    snap = new Snap({ source: source });
    map.addInteraction(snap);
    //Feature da degisiklik yapılmasına olanak saglayan yapılar bunlardır.
    modify.on("modifystart", () => {
      // setisFeatureChanged(true);//update modalı acacak olan butonun aktiflestirilmesi
      // feature.modified = true; // Özelliği güncelleme
    });
    modify.on("modifyend", () => {
      setisFeatureChanged(true); //update modalı acacak olan butonun aktiflestirilmesi
      // this.generalDataService.featureUpdate.next(true);
      // this.isFeatureChanged=true
      var geometry = feature.getGeometry();
      const data = {
        type: geometry.getType(),
        coordinates: geometry.getCoordinates(),
        wkt: geometryToWkt(feature),
      }; //guncellenen yapı
      // console.log(data);
      setnewCoordinates(data);
      value.wkt = geometryToWkt(feature);
      setUpdatedFeature(value);
    });
  };

  const changedFeatureSave = () => {
    //Burada degistiirilen koordinatlar alınacak ve bir modal a basılacak. Modalın komponent i olusturuldu.
    //daha sonra guncellenen yeni deger api ye gonderilecek.
    setIsOpenupdatedFeatureModal(true);
  };
  const handleUpdateModalClose = () => {
    vectorLayer.getSource().clear();
    setIsOpenupdatedFeatureModal(false);
    setisFeatureChanged(false);
  };

  const handleOpenAllFeatureModal = () => {
    clearImageLayer()
    setisOpenAllFeatureModel(true);
  };
  const handleCloseAllFeatureModal = () => {
    setisOpenAllFeatureModel(false);
  };
  const handleInteractionButton = (value) => {
    setIsStartInteractionButtonDisable(true);
    setopenGeometryListModalButtonDisable(true);
    setAllFeatureListButtonDisable(true);
    setselectFormActive(true);
    // setselectFormActive(false)
    handleStartInteraction();
  };
  const handleStartInteraction = () => {
    vectorLayer.getSource().clear();
    var tooltipElement = document.getElementById("tooltip"); //tooltip oegsi yakalandı
    var tooltipOverlay = tooltipElement; //overlay i temsilen bir nesneye verildi.

    const drawInteraction = new Draw({
      type: "Point", // Çizilebilecek şekil türünü (Point, LineString, Polygon) seciyorum
    }); //point olusuturukldu
    map.addInteraction(drawInteraction); //Point seklindeki interaction haritaya eklendi.

    drawInteraction.on("drawstart", function (event) {});
    drawInteraction.on("drawend", function (event) {
      console.log("------------------------");
      handleLoading(true);
      var feature = event.feature;
      var geometry = feature.getGeometry();
      // setcoordinate(geometry.getCoordinates())//Buradaki coordinates i
      let coordinate = geometry.getCoordinates();
      console.log(coordinate);

      // let container = document.getElementById('popup');
      //   overlay = new Overlay({
      //   element: container,
      //   autoPan: {
      //     animation: {
      //       duration: 250,
      //     },
      //   },
      // });
      const _type = event.feature.getGeometry().getType();

      var geometry = feature.getGeometry();

      var format = new WKT();
      const _locWkt = format.writeGeometry(feature.getGeometry(), {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857",
      });

      var interactAuth = new InteractionAuth();
      interactAuth.pointWKT = _locWkt;
      interactAuth.role = role;
      interactAuth.id = identifier;
      console.log(interactAuth);

      sendRequest("maps", "InteractionExists", "POST", interactAuth)
        .then((result) => {
          console.log(result);
          handleLoading(true);
          if (result === null) {
            //bir kesisim bulunamadı
            vectorLayer.getSource().clear();
            handleLoading(false);
            return;
          }
          interaction = result;

          const hdms = toStringHDMS(toLonLat(coordinate));
          let intersection = new CustomIntersection();
          intersection.hdsm = hdms;
          intersection.name = result.name;
          //model intersection yayınlanacak
          if (overlay) {
            console.log(coordinate);
            let _coordinate = fromLonLat(coordinate);
            console.log(coordinate[0] + "-" + coordinate[1]);
            
            // overlay.setPosition(coordinate[0],coordinate[1]);
            console.log(coordinate);
            const element = document.getElementById('popup');
            // overlay.getElement().appendChild(element);
            overlay.setPosition(coordinate)
          }
          vectorLayer.getSource().addFeature(feature);
          handleLoading(false);
          setintersec(intersection);

          return;
        })
        .catch((err) => {
          console.log(err);
          alert("Kesisim veya Yetki Yok");
          handleLoading(false);
          overlay.setPosition(undefined);
          //model intersection yayınlanacak
          vectorLayer.getSource().clear();
          //intersection i kapat
          //closeTooltip
          removeInteraction("Point");
          setopenGeometryListModalButtonDisable(false);
          setAllFeatureListButtonDisable(false);
          setIsStartInteractionButtonDisable(false);
          setselectFormActive(false);
        });
    });
  };

  handleCloseInteraction = () => {
    overlay.setPosition(undefined);
    vectorLayer.getSource().clear();
    // setisAllFeatureButtonActive(true)
    // setselectFormActive(true)
    setopenGeometryListModalButtonDisable(false);
    setAllFeatureListButtonDisable(false);
    setIsStartInteractionButtonDisable(false);
    setselectFormActive(false);
    removeInteraction("Point");
  };

  function removeInteraction(_interaction) {
    var interactions = map.getInteractions();
    // Etkileşim listesini döngüye alarak kaldırmak istediğiniz etkileşimi bulun
    interactions.forEach(function (interaction) {
      if (interaction["type_"] === _interaction)
        map.removeInteraction(interaction);
    });
  }
  const clearImageLayer=()=>{
    var layers = map.getLayers().getArray();
    var layerToRemove = layers.find(layer => layer.get('name') === "imageLayer");
    if(layerToRemove){
      map.removeLayer(layerToRemove);
    }
  }
  const [isWmsClick, setisWmsClick] = useState(false)
  const handleWmslayerData=(imageLayer)=>{
    setisWmsClick(true);
    var layers = map.getLayers().getArray();
    var layerToRemove = layers.find(layer => layer.get('name') === "imageLayer");
    if(layerToRemove){}else{map.addLayer(imageLayer)}
      // map.removeLayer(layerToRemove);
      
   
  }
  const handleClearWms=()=>{
    setisWmsClick(false)
    clearImageLayer();
  }
  const [isLayer, setisLayer] = useState(false)
  const [vectorSource, setVectorSource] = useState();
  const [snapInteractionAdded, setSnapInteractionAdded] = useState(false);
  const [distanceActive, setdistanceActive] = useState(false)
  // const [feature, setfeature] = useState()
  const handleSelectedFeatureWFSMap=(geoJsonObject)=>{
    setisWmsClick(true)
    let feature =geoJsonObject["features"][0]["properties"]["Type"];
    if (!vectorSource) {//vectorSource en basta null degerinde yani en basta buraya gelinecek.
      const newVectorSource = new VectorSource({
          features: new GeoJSON().readFeatures(geoJsonObject, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'//gelen verinin gosterilecegi vectorSource ayarlandı
        }) 
      });
      
      setVectorSource(newVectorSource);//vectorSource set lendi artık null degil bu yuzden alttaki layer ikinci kez olusturulmayacak.
      
      // Point geometrileri için stil
      const pointStyle = new Style({
        image: new Circle({
          radius: 5,
          fill: new Fill({
            color: 'rgba(255, 0, 0, 0.8)' // Kırmızı renkli dolgu
          }),
          stroke: new Stroke({
            color: 'black', // Siyah çerçeve
            width: 1 // Çerçeve genişliği daha makul bir değere ayarlandı
          })
        })
      });
      

// Polygon geometrileri için stil
    const polygonStyle = new Style({
      stroke: new Stroke({
        color: 'black',
        width: 3
      }),
      fill: new Fill({
        color: 'rgba(0, 0, 255, 0.1)' // Mavi renkli dolgu
      })
    });

    // Stil fonksiyonu, geometri türüne göre stil döndürür
    const styleFunction = (feature) => {
      switch (feature.getGeometry().getType()) {
        case 'Point':
          return pointStyle;
        case 'Polygon':
          return polygonStyle;
        // Diğer geometri türleri için daha fazla case eklenebilir
        default:
          // Varsayılan stil
          return new Style({});
      }
    };
      const newLayer = new VectorLayer({//layer icerisine eklenen feature ların stilini yukarıdaki fonksiyonlardan alır
        source: newVectorSource,
        style: styleFunction
      });
      map.addLayer(newLayer);//layer haritaya eklendi.

      // map.getView().fit(newVectorSource.getExtent());//eklenen feature kadar haritaya yakınlasma yapıldı
  } else {//eger vectorSource varsa
      const newFeatures = new GeoJSON().readFeatures(geoJsonObject, {//gelen veriye gore feature olusturuluyor
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
      });
      vectorSource.addFeatures(newFeatures);//vectorSource setlenmisti. bu setlenen yapıya bir feature ekleniyor.
      // map.getView().fit(vectorSource.getExtent());//harita eklenen feature kadar yakınlastırılıyor.
      //ile haritanın görünümünü Feature’ın sınırlarına göre ayarladım.
     
    }
  }


  const handleClearWfs=()=>{
    setdistanceActive(false)
    map.getLayers().getArray()
      .filter(layer => layer instanceof VectorLayer)
      .forEach(vectorLayer => vectorLayer.getSource().clear());
    setFeatureDistanceIsActive(false)
    setisLayer(false);
    map.getOverlays().clear();
    setisWmsClick(false)

    // Çizim interaction'ını al ve kaldır
    map.getInteractions().forEach(interaction => {
      if (interaction instanceof Draw) {
          map.removeInteraction(interaction);
      }
    });
  }

  const handleClearWfsDistance=()=>{
    setdistanceActive(false)
    map.getLayers().getArray()
      .filter(layer => layer instanceof VectorLayer)
      .forEach(vectorLayer => vectorLayer.getSource().clear());
    setFeatureDistanceIsActive(false)
    setisLayer(false);
    map.getOverlays().clear();
    setisWmsClick(false)

    // Çizim interaction'ını al ve kaldır
    map.getInteractions().forEach(interaction => {
      if (interaction instanceof Draw) {
          map.removeInteraction(interaction);
      }
    });
  }
  function handleFeatureDistanceActive(){
    setdistanceActive(true)
    setFeatureDistanceIsActive(true)
    // const  wfsVectorSource = wfsVectorLayer.getSource();
    // map.getLayers().getArray()
    // .filter(layer => layer instanceof VectorLayer)
    // .forEach(vectorLayer =>{
    //   const source=vectorLayer.getSource()
    //   const snap = new Snap({
    //     source:source ,
    //   });
    //   map.addInteraction(snap);
    // });
 
  // setFeatureDistanceIsActive(false)
   

  }


  const handleFeatureDistance=(source)=>{
    setdistanceActive(true);
    console.log(source);
    console.log(vectorLayer.getSource());
    let draw;
    if(source){
       draw= new Draw({//yeni bir cizim yaptırıyorum. Bu cizim linestring olacak.
            
        source: source,
        type: 'LineString',
      })
      map.addInteraction(draw);//bu yeni nesne haritaya interaction ekleniyor.
      // modify.setActive(true);
    // }
    snap = new Snap({//bir snap olusturuluyor
      source: vectorSource
    });
    map.addInteraction(snap);//snap de 
    }
    else{
      const _source=vectorLayer.getSource()
      source=_source
       draw= new Draw({//yeni bir cizim yaptırıyorum. Bu cizim linestring olacak.
        source: _source,
        type: 'LineString',
      })
      map.addInteraction(draw);//bu yeni nesne haritaya interaction ekleniyor.
      // modify.setActive(true);
    // }
    snap = new Snap({//bir snap olusturuluyor
      source: _source
    });
    map.addInteraction(snap);//snap de 
    }
  //   console.log(wfsVectorLayer.getSource());
  //   const snapInteraction = new Snap({
  //     // source: wfsVectorLayer.getSource()
  //     source:vectorLayer
  // });
  // //   let source =wfsVectorLayer.getSource();
  // //   const snap = new Snap({
  // //     source: source
  // // });
  // map.addInteraction(snapInteraction)

  map.addInteraction(draw);//bu yeni nesne haritaya interaction ekleniyor.
  // modify.setActive(true);
// }
snap = new Snap({//bir snap olusturuluyor
  source: source
});
map.addInteraction(snap);//snap de 
draw.on('drawend', (event) => {//cizim bittiginde 
  const feature = new Feature({//feature alınıyor
    geometry: event.feature.getGeometry(),
  });

  const geometry = feature.getGeometry();//geometrisi alınıyor
  const coordinates = geometry.getCoordinates();//coordinatları alınıyor
  const length = coordinates.length;//koordanatların uzunlugu alındı
  const mesafe = geometry.getLength();//koordanatların uzunlugu alındı
  const midpoint = geometry.getCoordinateAt(0.5);

  const labelContent = document.createElement('div');
  labelContent.innerHTML = `Mesafe: ${mesafe.toFixed(2)} m`; // Etiket içeriği
  const labelStyle = new Style({
    text: new Text({
      text: labelContent.innerHTML,
      scale: 1.5,
      fill: new Fill({
        color: '#ffcc33'
      })
    })
  });
  const labelOverlay = new Overlay({
    position: midpoint,
    element: labelContent,
  });
  labelContent.classList.add('overlay-background');
  map.addOverlay(labelOverlay);
  // Başlangıç ve bitiş noktaları için ok şeklinde stil tanımı

  // Bu fonksiyon, bir koordinat ve dönüş açısı alır ve bir stil döndürür.
  const arrowStyle = (coordinate, rotation) => new Style({
    // Yeni bir nokta geometrisi oluşturur ve bu noktaya stil uygular.
    geometry: new Point(coordinate),
    // RegularShape ile bir ok şekli oluşturur.
    image: new RegularShape({
      // Okun içini siyah renkle doldurur.
      fill: new Fill({ color: 'black' }),
      // Okun çevresine siyah, 2 piksel genişliğinde bir çizgi çizer.
      stroke: new Stroke({
        color: 'black',
        width: 2
      }),
      // Okun üç köşesi olacak şekilde ayarlar (üçgen şekli için).
      points: 3,
      // Okun boyutunu belirler (yarıçap).
      radius: 10,
      // Okun haritadaki dönüş açısını ayarlar (radyan cinsinden).
      rotation: rotation,
      // Okun başlangıç açısını ayarlar (genellikle 0 olarak bırakılır).
      angle: 0
    })
  });

  

  // Linestring için varsayılan stil
  const lineStyle = new Style({
    stroke: new Stroke({
      color: 'blue',
      width: 3
    })
  });

// Linestring'in başlangıç noktasındaki okun dönüş açısını hesaplar.
const startRotation = Math.atan2(
  coordinates[1][1] - coordinates[0][1], // Y eksenindeki değişim
  coordinates[1][0] - coordinates[0][0]  // X eksenindeki değişim
);
// Bu, başlangıç noktasındaki okun linestring yönünde olmasını sağlar.

// Linestring'in bitiş noktasındaki okun dönüş açısını hesaplar.
const endRotation = Math.atan2(
  coordinates[length - 1][1] - coordinates[length - 2][1], // Y eksenindeki değişim
  coordinates[length - 1][0] - coordinates[length - 2][0]  // X eksenindeki değişim
);
// Bu, bitiş noktasındaki okun linestring yönünde olmasını sağlar.

  // Stilleri uygula
  feature.setStyle([
    lineStyle,
    arrowStyle(coordinates[0], startRotation),
    arrowStyle(coordinates[length - 1], endRotation)
  ]);

  // Haritaya özelliği ekle
  source.addFeature(feature);
});
  }

  function createOverlayElement() {
    // Overlay konteynerini oluştur
    const overlayContainer = document.createElement('div');
    overlayContainer.id = 'overlay';
    overlayContainer.className = 'ol-overlay-container ol-selectable';
  
    // Overlay içeriği için div'i oluştur
    const overlayContent = document.createElement('div');
    overlayContent.id = 'overlay-content';
  
    // İçerik div'ini konteynere ekle
    overlayContainer.appendChild(overlayContent);
  
    // Konteyneri body'ye ekle
    document.body.appendChild(overlayContainer);
  
    return overlayContainer;
  }

  const getAllWfs=(features)=>{
    console.log(features);
    if (features && features.length > 0) {
      //   const newFeatures = new GeoJSON().readFeatures(geoJsonObject, {//gelen veriye gore feature olusturuluyor
      //     dataProjection: 'EPSG:4326',
      //     featureProjection: 'EPSG:3857'
      // });
      const vectorSource = new VectorSource();
      const format = new WKT();
      // Sadece poligon feature'ları filtrele
      // const polygonFeatures = features.filter(feature => (feature.type === 'POLYGON' || feature.type === 'Polygon'));
        const polygonFeatures = features.filter(feature => feature.type.toUpperCase()==="POLYGON");
      // Poligon feature'larını döngüyle gez
      polygonFeatures.forEach(feature => {

          // Feature'ı oluştur
          const polygonGeometry = format.readGeometry(feature.wkt, {
            dataProjection: 'EPSG:4326', // Kaynak projeksiyon
            featureProjection: 'EPSG:3857' // Haritanın projeksiyonu
          });

          const polygonFeature = new Feature({
              geometry: polygonGeometry,
          });

          polygonFeature.setStyle(new Style({
            fill: new Fill({
              color: 'rgba(255, 0, 0, 0.2)',
            }),
            stroke: new Stroke({
              color: 'red',
              width: 2,
            }),
          }));

          // VectorSource'a feature'ı ekle
          vectorSource.addFeature(polygonFeature);
      });
      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });
      map.addLayer(vectorLayer);
      const selectInteraction = new Select({
        condition: click // Tıklama ile seçim yap
      });
      map.addInteraction(selectInteraction);

      selectInteraction.on('select', function(e) {
        e.selected.forEach(function(feature) {
          feature.setStyle(new Style({
            fill: new Fill({
              color: 'rgba(0, 255, 0, 0.5)', // Yeni doldurma rengi
            }),
            stroke: new Stroke({
              color: 'green', // Yeni çizgi rengi
              width: 4,
            }),
          }));
      
          // Alan bilgisini hesapla (örneğin metre kare olarak)
          console.log(feature.getGeometry().getType());
          let area;
          let areaInSquareMeters;
          let areaInSquareKilometers;
          if(feature.getGeometry().getType()==="Polygon"){
             area = feature.getGeometry().getArea();//alan icin bir deger getirildi
             areaInSquareMeters = Math.round(area *100) / 100; // Alanı yuvarla
             areaInSquareKilometers = (areaInSquareMeters / 1000000).toFixed(0); // Sadece tam sayı kısmını alır
             // const area = feature.getGeometry().getArea();//alan icin bir deger getirildi
   
   
             createOverlayElement();
             
             // Overlay oluştur ve haritaya ekle
             const overlay = new Overlay({
               element: document.getElementById('overlay'), // HTML'de bir id ile belirtilmiş element
               positioning: 'bottom-center',
               stopEvent: false,
             });
             map.addOverlay(overlay);
             // Overlay içeriğini güncelle ve göster
             const overlayContent = document.getElementById('overlay-content');
             console.log(overlayContent);
             overlayContent.innerHTML = `<div className="overlay-content">Alan: ${areaInSquareKilometers} km²</div>`; // İçerik
             overlay.setPosition(e.mapBrowserEvent.coordinate); // Overlay pozisyonunu ayarla
          }
        });
      
        // Deseçim yapıldığında eski stilini geri yükle
        e.deselected.forEach(function(feature) {//select eventi hala aktif. burada da deselected tetikleniyor.
          feature.setStyle(new Style({//stili verildi
            fill: new Fill({
              color: 'rgba(255, 0, 0, 0.2)',
            }),
            stroke: new Stroke({
              color: 'red',
              width: 2,
            }),
          })); // Varsayılan stile dön
        });
      });

    }
  }
  const handleCloseChart=()=>{
    console.log("-----");
    setisLogAnalyseActive(false)
  }
  return (
    <>
    {/* <img src={imageUrl} alt="Map Layer" /> */}
      <div className="map" ref={mapRef} />
      {/* 
          Bu kod, React bileşenlerinde bir <div> elementi oluşturur ve bu <div> elementine map sınıfını ekler. 
          Ayrıca, bu <div> elementine bir referans ekler, yani mapRef değişkenine atar.
          */}
      {isWmsClick===false ?
        <SelectForm
          disable={selectFormActive}
          onSelectChange={handleSelectChange}
        />:""
      }

      {/* SelectForm component ini goruntuye alıyorum. SelectForm dan gecilen props u burada yakalıyorum ve handleSelectChange fonksiyonunu tetikliyorum.*/}

      {/* {isEndFeatureModalOpen && <EndFeatureModal onClose={handleCloseModal} />} */}
      {isEndFeatureModalOpen === true && isWmsClick===false? <EndFeatureModal /> : ""}
      {isGeometryListModalOpen === true && isWmsClick===false? (
        <GeometryListModal
          isGeometryListModalOpen={isGeometryListModalOpen}
          handleClose={handleClose}
          showFeature={setShowFeatureFunc}
        />
      ) : (
        ""
      )}
      {isOpenupdatedFeatureModal === true && isWmsClick===false? (
        <UpdateModal
          feature={updatedFeature}
          handleClose={handleUpdateModalClose}
        />
      ) : (
        ""
      )}
      {isOpenAllFeatureModel === true && isWmsClick===false ? (
        <AllFeatureModal
          handleClose={handleCloseAllFeatureModal}
          handleSelectedFeatureMap={handleSelectedFeatureMap}
        />
      ) : (
        ""
      )}
      <div className="popup">
          <StartInteraction intersec={intersec} handleCloseInteraction={handleCloseInteraction}/>
      </div>
      <button className="btn btn-danger" id="typeButton6" onClick={logOut}>
        Çıkış
      </button>
      {isWmsClick===false?
        <button
        id="typeButton"
        className="btn btn-danger"
        disabled={openGeometryListModalButtonDisable}
        onClick={openGeometryListModal}
        style={{ "backgroundColor": "#fff", color: "black" }}
        >
        Tüm Kayıtlar
      </button>:""
      }
      {isAllFeatureButtonActive === true &&isWmsClick===false?  (
        <button
          className="btn btn-danger"
          id="typeButton3"
          disabled={allFeatureListButtonDisable}
          onClick={handleOpenAllFeatureModal}
        >
          Tüm Kayıtları Getir
        </button>
      ) : (
        ""
      )}
      {/* {showFeature!==null? console.log(showFeature):""} */}
      {isFeatureChanged === true ? (
        <button
          className="btn btn-danger"
          id="typeButton2"
          onClick={changedFeatureSave}
        >
          Değişiklikleri Onayla
        </button>
      ) : (
        ""
      )}
      {role !== "SuperAdmin" && isWmsClick===false ? (
        <button
          className="btn btn-danger"
          id="typeButton4"
          onClick={handleInteractionButton}
          disabled={isStartInteractionButtonDisable}
        >
          Start Intersection
        </button>
      ) : (
        ""
      )}
      {(role === "SuperAdmin" || role==="Admin")&&isWmsClick===false ? (
        <button
          id="typeButton5"
          onClick={()=> {
            clearImageLayer()
            console.log("tıktık");
            navigate("/admin");
          }}
          className="btn btn-danger"
        >
          Admin Paneli
        </button>
      ) : (
        ""
      )}
      <GetWMS handleWmslayerData={handleWmslayerData} clearWms={handleClearWms}></GetWMS>
      <GetWFS handleSelectedFeatureWFSMap={handleSelectedFeatureWFSMap} handleClearWfs={handleClearWfs} handleFeatureDistanceActive={handleFeatureDistanceActive} wfsClearButtonActive={distanceActive}></GetWFS>
      {distanceActive===false ?<button className="btn btn-danger distanceButton" onClick={()=>handleFeatureDistance(vectorSource)}>Mesafe Ölç</button>:
      <button className="btn btn-danger distanceButton" onClick={()=>{handleClearWfsDistance(); setdistanceActive(false)}}>Mesafe Ölçme Kapat</button>}
      <WFSAlan allWfs={getAllWfs} clearAlan={handleClearWfs}></WFSAlan>
      {/* {isLogAnalyseActive===false ? 
          <button className="btn btn-danger analyseButton">Log Analizi Getir</button>:<Chart></Chart> 
      } */}
{/* 
      {isLogAnalyseActive===true?
        <button className="btn btn-danger analyseButton" onClick={()=>handleShow()}>Log Analizi Getir</button>:""
      } */}
      {role==="SuperAdmin"?
        <button className="btn btn-danger analyseButton" onClick={()=>setisLogAnalyseActive(true)}>Log Analizi Getir</button>:""
      }
      {isLogAnalyseActive===true?<Chart handleClose={handleCloseChart}></Chart>:""}
      
    </>
  );

};
export default Maps;