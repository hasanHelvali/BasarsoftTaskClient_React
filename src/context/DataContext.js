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

  // Veri yakalandığında context'e set etme işlemi
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
    console.log(value);
    setisAuth(value) 
  }
  const handleJWT=(value)=>{
    setJwt(value);
    console.log(value);
    console.log(jwt);
  }
  const handleLoading=(value)=>{
    setloading(value);
  }

  // const handleIsVerify=(value)=>{
  //   setVerify(value);
  // ,Verify,handleIsVerify
  // }
  return (
    <MyContext.Provider value={{ wkt, handleDataCapture,isEndFeatureModalOpen,handleStateModal,featureType,handleFeatureType,isAuth,handleIsAuth
    ,jwt,handleJWT,loading,handleLoading}}>
      {children}
    </MyContext.Provider>
  );
};

// Context'ten değerleri almak için bir custom hook oluştur
export const useMyContext = () => {
  return useContext(MyContext);
};
export {MyProvider};