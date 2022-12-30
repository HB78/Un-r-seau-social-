import React from 'react'
import "./login.css";
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  let navigate = useNavigate();

  return (
    <section className='container__form'>
      <main className='container__form__box'>
        <form action="" className='form'>
          <h2>Connectez-vous</h2>
          <div className='input_box'>
            <input type="email" name="nom" id="firstname" required="required"/>
            <span>Email</span>
            <i></i>
          </div>
          <div className='input_box'>
            <input type="password" name="nom" id="password" required="required"/>
            <span>Mot de passe</span>
            <i></i>
          </div>
          <div className='link'>
            <Link to ="/signup">Pas encore inscrit ?</Link>
          </div>
          <input type="submit" value="Submit" />
        </form>
      </main>
    </section>
  )
}

export default Login
