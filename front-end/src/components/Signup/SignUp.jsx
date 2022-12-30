import React from 'react';
import "./SignUp.css";
import "./responsive.css";
import { Link, useNavigate } from 'react-router-dom';

function SignUp() {
  let navigate = useNavigate();

  return (
    <section className='container_signup'>
      <main className='container_main'>
        <h2 className='h2_form'>Incription</h2>
        <form action="" className='form_signup'>
          <div className='input_box_label'>
            <input type="text" name="nom" id="nom" required="required"/>
            <label>Nom</label>
          </div>
          <div className='input_box_label'>
            <input type="text" name="nom" id="prenom" required="required"/>
            <label>Prénom</label>
          </div>
          <div className='input_box_label'>
            <input type="text" name="nom" id="mail" required="required"/>
            <label>Email</label>
          </div>
          <div className='input_box_label'>
            <input type="password" name="nom" id="passwords" required="required"/>
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

export default SignUp
