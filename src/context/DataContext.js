import React, { createContext, useState, useContext } from 'react';
// Context oluştur
const MyContext = createContext();

// Context içindeki durumları yöneten bir provider bileşeni oluştur
 const MyProvider = ({ children }) => {
  const [wkt, setWkt] = useState({});
  const [featureType, setFeatureType] = useState("");
  const [isEndFeatureModalOpen, setIsEndFeatureModalOpen] = useState(false);
  const [isAuth, setisAuth] = useState(false)
  const [jwt, setJwt] = useState("");
  const [loading, setloading] = useState(true)
  // const [Verify, setVerify] = useState(false)
  const [role, setrole] = useState("User")
  const [username, setusername] = useState("")
  const [identifier, setIdentifier] = useState("")
const [activeAdminPageComponentUrl, setactiveAdminPageComponentUrl] = useState()
const [geoJsonFile, setGeoJsonFile] = useState()
  //  yakalandığında context'e set etme işlemi
  const handleDataCapture = (_wkt) => {
    setWkt(_wkt);
    setIsEndFeatureModalOpen(true); // Modal'ı aç
  };
  // Modal'ı kapatma işlemi
  const handleStateModal = (value) => {
    setIsEndFeatureModalOpen(value);
  };

  const handleFeatureType=(value)=>{
    setFeatureType(value);
  }

  const handleIsAuth=(value)=>{
    setisAuth(value) 
  }
  const handleJWT=(value)=>{
    setJwt(value);
  }
  const handleLoading=(value)=>{
    setloading(value);
  }

  // const handleIsVerify=(value)=>{
  //   setVerify(value);
  // ,Verify,handleIsVerify
  // }

  const handleRole=(value)=>{
    setrole(value)
  }
  const handleName=(value)=>{
    setusername(value)
  }
  const handleIdentifier=(value)=>{
    setIdentifier(value)
  }
  const handleActiveAdminPageComponentUrl=(value)=>{
    setactiveAdminPageComponentUrl(value)
  }
  const handleGeoJsonFile=(value)=>{
    // console.log(value);
    setGeoJsonFile(value)
  }
  return (
    <MyContext.Provider value={{ wkt, handleDataCapture,isEndFeatureModalOpen,handleStateModal,featureType,handleFeatureType,isAuth,handleIsAuth
    ,jwt,handleJWT,loading,handleLoading,role,handleRole,username, handleName,identifier,handleIdentifier,activeAdminPageComponentUrl,
    handleActiveAdminPageComponentUrl,
    geoJsonFile,handleGeoJsonFile}}>
      {children}
    </MyContext.Provider>
  );
};

// Context'ten değerleri almak için bir custom hook oluştur
export const useMyContext = () => {
  return useContext(MyContext);
};
export {MyProvider};