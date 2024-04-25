import React from 'react'
import { useNavigate } from 'react-router-dom';

function VerifyToken() {
    return new Promise((resolve, reject) => {
        const jwt = localStorage.getItem("token");
        fetch('https://localhost:7295/api/AuthManagement/VerifyToken',{
            method: 'GET',
            headers: {
              'content-type':'application/json',
              'Authorization': `Bearer ${jwt}`
            }
        })
            .then(response => {
                if (response.ok) {
                    resolve(true); // Token doğrulandı

                } else {
                    resolve(false); // Token doğrulanamadı
                }
            })
            .catch(error => {
                reject(error); // Hata oluştu
                return false;
            });
    });

    // const jwt=localStorage.getItem("token")  
    // fetch('https://localhost:7295/api/AuthManagement/VerifyToken').then((isVerify)=>{
    // return true;
    // }).catch((err)=>{
    //     return false;
    // })
}

export function login(method,bodyData) {//jwt almak icin yazılan koddur.
    const options = {
      method: method,
      headers: {
        'content-type':'application/json',
    },
      body:JSON.stringify(bodyData)
    };
    return fetch("https://localhost:7295/api/AuthManagement/LoginUser",options)
    .then(response => {
      console.log(response);
      // Yanıtın durumuna göre işlemler
      //  const result = response.json()
      return response.json()
      .then(result => {//
        console.log(result);
        if (!response.ok) {
          throw new Error('Istek basarısız oldu!');
        }
        return result;
      });

      //  console.log(result);
      // if (!response.ok) {
      //   throw new Error('Istek basarısız oldu!');
      // }
      // return response.json()
  
    })
  }

export default VerifyToken