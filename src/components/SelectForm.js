import React, { useEffect, useState } from 'react'
import { useMyContext } from '../context/DataContext';
function SelectForm({ onSelectChange , disable }) {
    //OnSelectChange adında bir state i props olarak parent component e geciyorum.
    const [selectedValue, setSelectedValue] = useState('');//secilen selectbox degeri icin bir state tutuyorum.
    const { featureType,handleFeatureType,isEndFeatureModalOpen,handleStateModal} = useMyContext();
    useEffect(() => {
        // select kutusunun featureType her degistiginde  güncelle
      }, [featureType,disable]);
    const handleSelectChange = (event) => {
        setSelectedValue(event.target.value);
        //secilen degere gore ilgili state i set liyorum.
        const _selectedValue = event.target.value;
        onSelectChange(_selectedValue); // selectedValue'yi Parent bileşene iletiyoruz. props geciyorum.
        handleFeatureType(event.target.value)//featureType i context te guncelliyorum.
      };
  return (
    <>
        {
        <form className="form">
            <div className="">
            <select disabled={disable} id="type" className="form-select" onChange={handleSelectChange}  value={featureType}>
                {/* selectbox degistiginde handleSelectChange adında bir fonksiyonu tetikliyorum. Ayrıca selectbox ın icerigi context teki 
                featureType a baglı.*/}
                <option value="">-- Seçiniz --</option>
                <option value="Point">Point</option>
                <option value="LineString">LineString</option>
                <option value="Polygon">Polygon</option>
                {/* <option value="Circle">Circle</option> */}
            </select>
            </div>
        </form>
        } 
    </>
  )
}

export default SelectForm


