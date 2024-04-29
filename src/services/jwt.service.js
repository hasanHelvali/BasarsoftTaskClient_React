import { decodeToken, useJwt } from "react-jwt";
import React, { useState } from 'react'
import { useMyContext } from "../context/DataContext";
export default async  function JWTDecode(handleRole,handleName,handleIdentifier) {
    // const {handleRole,handleName,handleIdentifier}=useMyContext()
    let token= await localStorage.getItem('token');
    let user =decodeToken(token)["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
    handleRole(decodeToken(token)["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"])
    handleName(user)
    handleIdentifier(decodeToken(token)["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"])
    return ;
}
