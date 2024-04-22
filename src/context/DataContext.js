import React, { createContext, useState, useContext } from 'react';
// Context oluştur
const MyContext = createContext();

// Context içindeki durumları yöneten bir provider bileşeni oluştur
 const MyProvider = ({ children }) => {
  const [wkt, setWkt] = useState({});
  const [featureType, setFeatureType] = useState("");
  const [isEndFeatureModalOpen, setIsEndFeatureModalOpen] = useState(false);
  const [isAuth, setisAuth] = useState(false)
  // Veri yakalandığında context'e set etme işlemi
  const handleDataCapture = (_wkt) => {
    setWkt(_wkt);
    setIsEndFeatureModalOpen(true); // Modal'ı aç
    // console.log(_wkt);
  };
  // Modal'ı kapatma işlemi
  const handleStateModal = (value) => {
    // console.log(value);
    setIsEndFeatureModalOpen(value);
  };

  const handleFeatureType=(value)=>{
    // console.log(value);
    setFeatureType(value);
  }

  const handleIsAuth=(value)=>{
    console.log(value);
    setisAuth(value) 
  }

  return (
    <MyContext.Provider value={{ wkt, handleDataCapture,isEndFeatureModalOpen,handleStateModal,featureType,handleFeatureType,isAuth,handleIsAuth}}>
      {children}
    </MyContext.Provider>
  );
};

// Context'ten değerleri almak için bir custom hook oluştur
export const useMyContext = () => {
  return useContext(MyContext);
};
export {MyProvider};