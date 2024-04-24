import React, { useEffect, useState } from 'react'
import getApiUrl, { sendRequest } from '../services/httpClient.service';
import { SignUpDTO } from '../models/Signup';
import { Login } from '../models/Login';
import { useMyContext } from '../context/DataContext';
import { login } from '../services/Auth.service';
import { Navigate } from 'react-router-dom';
function LoginAndRegister() {
    const {handleJWT,loading,handleLoading} = useMyContext()
    const [isLogin, setisLogin] = useState(false)
    const [formDataRegister, setFormDataRegister] = useState({
        firstName: '',
        lastName: '',
        username: '',
        password: ''
      });
    
      const [formDataLogin, setFormDataLogin] = useState({
        username: '',
        password: ''
      });

    const handleSetisLogin=()=>{
        setisLogin(!isLogin)
        console.log(isLogin);
    }
    useEffect(() => {
        handleLoading(true)
        setTimeout(() => {
        handleLoading(false)
        }, 500);
      }, [isLogin]);

      const handleChange = (event) => {
        // Form verilerini güncellemek için bir fonksiyon
        if(!isLogin){
            setFormDataRegister({ ...formDataRegister, [event.target.name]: event.target.value });
        }
        else{
            setFormDataLogin({ ...formDataLogin, [event.target.name]: event.target.value })
        }
        /*
        setFormData({ ...formDataRegister, [event.target.name]: event.target.value }) ifadesi, önceki formDataRegister nesnesini spread operatörü ... ile 
        kopyalar ve sonra [event.target.name] ile belirtilen form elemanının adı ile yeni bir özellik ekler ve bu özelliğin değerini
         event.target.value ile ayarlar. Böylece, form elemanının adına karşılık gelen formDataRegister içindeki değeri günceller.
         {firstName: 'adsads', lastName: 'adsads', username: 'adsads', password: 'adad'} seklinde bir cıktı alınır.
         */
      };

      const createAccount = (event) => {
        handleLoading(true)//spinner show
        event.preventDefault(); // Formun otomatik gönderilmesini engeller
        const { firstName,  username, password } = formDataRegister;
        // Burada kullanıcıyı kaydetmek için yapılacak işlemleri yazabilirsiniz
        console.log('Yeni kullanıcı oluşturuldu:', { firstName,  username, password });

        //veriler alındı istek baslatılıyor

        // sendRequest(getApiUrl(),"AuthManagement","CreateUser",'POST',null,{ "Name":firstName,  "Email":username,"Password" :password })
        const requestBody=new SignUpDTO(firstName,username,password);
         sendRequest(getApiUrl(),"AuthManagement","CreateUser",'POST',null,requestBody).then((_result=>{
             console.log(_result)
             if(_result===false){
                alert("İlgili Kayıt Zaten Mevcut!!!")
                setisLogin(false);
                handleLoading(false)//spinner hide
                return 
             }
             else{
                alert("Kayıt Başarılı... Giriş Paneline Yönlendiriliyorsunuz... ")
                setisLogin(true);
                handleLoading(false)//spinner hide
             }
         })).catch((err)=>{
            alert(err)
            handleLoading(false)//spinner hide
         })


      };
      const loginStart=(event)=>{
        handleLoading(true)//spinner hide
        console.log("------");
        event.preventDefault(); 
        const { username, password } = formDataLogin;
        console.log({username,password});
        const requestBody=new Login(username,password);
        // sendRequest(getApiUrl(),"AuthManagement","LoginUser",'POST',null,requestBody).then((_result=>{
        //     console.log(_result)
        //     if(_result===null || _result===undefined){
        //         alert("Bir sorun oluştu")
        //        return 
        //     }
        //     else{
        //         console.log(_result.accessToken);
        //         handleJWT(_result.accessToken);
        //         localStorage.setItem("token", _result.accessToken); 
        //     }
        // })).catch((err)=>{
        //    alert(err)
        // })
        login('POST',requestBody).then((_result=>{ //jwt icin istek yapılıyor
            console.log(_result)
            if(_result===null || _result===undefined){
                alert("Bir sorun oluştu")
                handleLoading(false)//spinner hide
               return 
            }
            else{
                console.log(_result.accessToken);
                handleJWT(_result.accessToken);
                localStorage.setItem("token", _result.accessToken); 
                handleJWT(_result.accessToken)
                handleLoading(false)//spinner hide
            }
        })).catch((err)=>{
               alert(err)
               handleJWT("");
            //    localStorage.setItem("token", ""); 
                  handleLoading(false)//spinner hide
            })
      }


  return (
    <>
        {isLogin?(
                <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="d-flex align-items-center min-vh-100">
                            <div className="w-100 d-block bg-white shadow-lg rounded my-5">
                                <div className="row">
                                    <div className="col-lg-5 d-none d-lg-block bg-login rounded-left">
                                        <img src="../assets/logo.png" alt="" className="w-100"/>
                                    </div>
                                    <div className="col-lg-7">
                                        <div className="p-5">
                                            <div className="text-center mb-5">
                                                <a href="/Default/Index/" className="text-dark font-size-22 font-family-secondary">
                                                    <i className="mdi mdi-alpha-x-circle"></i> <b>Başarsoft Task 3- Authentication</b>
                                                </a>
                                            </div>
                                            <h1 className="h5 mb-1">Tekrar Hoş Geldin!</h1>
                                            <p className="text-muted mb-4">Harita sayfasına erişim için bilgilerinizi giriniz.</p>
                                            <form className="user" method="post">
                                                <div className="form-group">
                                                    {/* <input type="text" className="form-control form-control-user" id="exampleInputEmail" placeholder="Kullanıcı Adınız-Email" asp-for="Username" #loginMail/> */}
                                                    <input type="text" className="form-control form-control-user" id="exampleInputEmail" placeholder="Kullanıcı Adınız-Email"
                                                    name='username'onChange={handleChange} />
                                                </div> <br />
                                                <div className="form-group">
                                                    {/* <input type="password" className="form-control form-control-user" id="exampleInputPassword" placeholder="Şifreniz" asp-for="Password" #loginPassword> */}
                                                    <input type="password" className="form-control form-control-user" id="exampleInputPassword" placeholder="Şifreniz" 
                                                    name='password' onChange={handleChange}/>
                                                </div> <br/>
                                                {/* <button className="btn btn-success btn-block waves-effect waves-light" (click)="loginAccountStart({email:loginMail.value,password:loginPassword.value})"> Giriş Yap </button> */}
                                                <button className="btn btn-success btn-block waves-effect waves-light" onClick={loginStart} > Giriş Yap </button>
                                            </form>
                                            <div className="row mt-4">
                                                <div className="col-12 text-center">
                                                    {/* <p className="text-muted mb-0">Bir hesabınız yok mu? <a className="text-muted font-weight-medium ml-1" (click)="changeState()"
                                                        style="cursor: pointer;"><b>Bir Hesap Oluştur</b></a></p> */}
                                                        <p className="text-muted mb-0">Bir hesabınız yok mu? <a  className="text-muted font-weight-medium ml-1" 
                                                        style={{"cursor":"pointer"}} onClick={handleSetisLogin}><b>Bir Hesap Oluştur</b></a></p>
                                                </div> 
                                            </div>
                                        </div> 
                                    </div> 
                                </div> 
                            </div> 
                        </div> 
                    </div>
                </div> 
            </div>
        ):(
            <div>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="d-flex align-items-center min-vh-100">
                                <div className="w-100 d-block bg-white shadow-lg rounded my-5">
                                    <div className="row">
                                        <div className="col-lg-5 d-none d-lg-block bg-register rounded-left">
                                            {/* <img src="../../../assets/Başlıksız.png" className="w-100"/> */}
                                            <img src="../assets/logo.png" className="w-100"/>
                                        </div>
                                        <div className="col-lg-7">
                                            <div className="p-5">
                                                <div className="text-center mb-5">
                                                    <a href="/Default/Index/" className="text-dark font-size-22 font-family-secondary">
                                                        <i className="mdi mdi-alpha-x-circle"></i> <b>
                                                            Başarsoft Task 3- Authentication
                                                        </b>
                                                    </a>
                                                </div>
                                                <h1 className="h5 mb-1">Kayıt Olun!</h1>
                                                <p className="text-muted mb-4">Bir hesabınız yok mu, 1 dakika içinde hesabınızı oluşturun!</p>
                                                <form className="user" method="post" >
                                                    <div className="form-group row">
                                                        <div className="col-sm-6 mb-3 mb-sm-0">
                                                            <input type="text" className="form-control form-control-user" id="exampleFirstName" placeholder="Adınız" 
                                                            name='firstName'onChange={handleChange}/>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <input type="text" className="form-control form-control-user" id="exampleLastName" placeholder="Soyadınız"
                                                            name='lastName'onChange={handleChange} />
                                                        </div>
                                                    </div> <br/>
                                                    <div className="form-group row">
                                                        <div className="col-sm-6 mb-3 mb-sm-0">
                                                            <input type="text" className="form-control form-control-user" id="exampleInputUsername" placeholder="Kullanıcı Adınız veya Email" 
                                                            name='username'onChange={handleChange}/>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <input type="password" className="form-control form-control-user" id="exampleRepeatPassword" placeholder="Şifreniz"
                                                            name='password' onChange={handleChange}/>
                                                        </div>
                                                    </div> <br/>
                                                    <button className="btn btn-success btn-block waves-effect waves-light" onClick={createAccount}> Hesabı Oluştur </button>
                                                </form>
                                                <div className="row mt-4">
                                                    <div className="col-12 text-center">
                                                        {/* <p className="text-muted mb-0">Bir hesabın var mı? <a style="cursor: pointer;" className="  text-muted font-weight-medium ml-1" 
                                                            (click)="changeState()"><b>Giriş Yap</b></a></p> */}
                                                            <p className="text-muted mb-0">Bir hesabın var mı? <a style={{"cursor": "pointer"}} className="  text-muted font-weight-medium ml-1" 
                                                            onClick={handleSetisLogin}><b>Giriş Yap</b></a></p>
                                                    </div> 
                                                </div>
                                            </div> 
                                        </div> 
                                    </div> 
                                </div> 
                            </div> 
                        </div> 
                    </div> 
                </div>
            </div>
        )}
    </>
  )
}

export default LoginAndRegister