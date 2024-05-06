// import Spinner from './Spinner'; 
import { useState } from 'react';
import { BeatLoader } from 'react-spinners';
import Spinner from '../components/Spinner';
import VerifyToken from './Auth.service';
// Spinner bileşeninizi import edin// Basit bir HTTP isteği gönderen fonksiyon
export function sendRequest(controller,action, method,bodyData,queryData) {
  const jwt = localStorage.getItem('token')
  const isVerify = VerifyToken(jwt)
  if(isVerify){
    console.log(bodyData);
    // fetch API'sini kullanarak isteği gönderme
    const options = {
        method: method,
        headers: {
            'content-type':'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}` // Header'a token ekleniyor
        },
        body:JSON.stringify(bodyData)
      };
      console.log(queryData);
    return fetch(`${getApiUrl()}/${controller}${action?"/"+action:""}${queryData?"/"+queryData:""}`, options)
      .then(response => {
        console.log(response);
        // Yanıtın durumuna göre işlemler
        if (!response.ok) {
          throw new Error('Istek basarısız oldu!');
        }
        return response.json()
  
      })
    //   .then(data => {
    //     // İşlenmiş veri
    //     console.log('Alınan veri:', data);
    //     return data; // İşlenmiş veriyi döndür
    //   })
      .catch(error => {
        // Hata durumunda işlemler
        // console.error('İstek sırasında hata:', error);
        throw error; // Hata durumunu ileterek işlemi durdur
        alert("Istek Sırasında Hata Oluştu.");
      });
  }
  else{
    localStorage.setItem('Token',"")//token gecersiz ise local storage bosaltılır.

  }
    
  }
  export function Register(controller,action, method,bodyData){
    localStorage.removeItem("token")
    const options = {
      method: method,
      headers: {
          'content-type':'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}` // Header'a token ekleniyor
      },
      body:JSON.stringify(bodyData)
    };
    return fetch(`${getApiUrl()}/${controller}/${action?action:""}`, options)

  } 
  
  // Örnek kullanım
//   const url = 'https://jsonplaceholder.typicode.com/posts/1';
//   const method = 'GET';
  
//   sendRequest(url, method)
//     .then(data => {
//       // Başarılı yanıt durumunda yapılacak işlemler
//       console.log('İşlenen veri:', data);
//     })
//     .catch(error => {
//       // Hata durumunda yapılacak işlemler
//       console.error('İşlem sırasında hata:', error);
//     });





const getApiUrl = () => {
    // Burada servisten URL'yi alabilirsiniz
    return 'https://localhost:7295/api';
  };
  
  export default getApiUrl;