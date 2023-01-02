import React, { useState } from 'react';
import "./SignUp.css";
import "./responsive.css";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignUp() {
  const [lastName, setLastName] = useState("")
  const [firstName, setFirstName] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")

  let dataFromForm = {
    lastname: lastName,
    firstname: firstName,
    password: password,
    email: email
  }
  console.log('dataFromForm:', dataFromForm)

  async function sendForm(e)  {
    try {
      e.preventDefault()
      const response = await axios.post(`http://localhost:3000/users/signup`, dataFromForm)
      console.log("response du try", response)
    } catch (error) {
      console.log(error)
      if(error.response.status === 400) {
        console.log("---> error status", error.response.status)
        alert(error.response.data)
      }
    }
  }
  const getLastName = (e) => {
    setLastName(e.target.value)
  }
  const getFirstName = (e) => {
    setFirstName(e.target.value)
  }
  const getPassword = (e) => {
    setPassword(e.target.value)
  }
  const getEmail = (e) => {
    setEmail(e.target.value)
  }

  let navigate = useNavigate();

  return (
    <section className='container_signup'>
      <main className='container_main'>
        <h2 className='h2_form'>Incription</h2>
        <form action="" className='form_signup' onSubmit={sendForm}>
          <div className='input_box_label'>
            <input 
            type="text" 
            name="nom" id="nom" 
            required="required"
            onChange={getLastName}/>
            <label>Nom</label>
          </div>
          <div className='input_box_label'>
            <input 
            type="text" 
            name="nom" 
            id="prenom" 
            required="required"
            onChange={getFirstName}/>
            <label>Prénom</label>
          </div>
          <div className='input_box_label'>
            <input 
            type="text" 
            name="nom" 
            id="mail" 
            required="required"
            onChange={getEmail}/>
            <label>Email</label>
          </div>
          <div className='input_box_label'>
            <input 
            type="password" 
            name="nom" 
            id="passwords" 
            required="required"
            onChange={getPassword}/>
            <label>Mot de passe</label>
          </div>
          <div className='link'>
            <Link to ="/login">Déjà insrit ?</Link>
          </div>
          <input type="submit" value="Submit" />
        </form>
      </main>
    </section>
  )
}

export default SignUp;
