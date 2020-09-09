import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {

  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    emails: '',
    password: '',
    photo: ''
  })
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        const { displayName, photoURL, email } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
        }
        setUser(signedInUser);
        console.log(displayName, email, photoURL);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message)
      })
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(res => {
        const signedOutUser = {
          isSignedIn: false,
          name: '',
          photo: '',
          email: '',
          error: '',
          success: false
        }
        setUser(signedOutUser);
        console.log(res);
      })
      .catch(err => {

      })
  }
  const handleBlur = (e) => {
    let isFieldValid = true;
    if (e.target.name === 'email') {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === 'password') {
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber;
    }
    if (isFieldValid) {
      //[...cart, newItem]
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }

  const handleSubmit = (e) => {
    // console.log(user.email, user.password)
    if(user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.mail, user.password)
      .then (res => {
        const newUserInfo = { ...user };
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
      })
      .catch( error => {
        const newUserInfo ={...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
      });
    }
    e.preventDefault();
  }
  return (
    <div className="App">
      <h1>Testing</h1>
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sing out</button> :
          <button onClick={handleSignIn}>Sing in</button>
      }

      {
        user.isSignedIn && <div>
          <p>Welcome, {user.name}</p>
          <p>Your email:  {user.email}</p>
          <img src={user.photo} alt=""></img>
        </div>
      }
      <h1>Our Own Authentication</h1>
      
      <form onSubmit={handleSubmit}>
        <input name="name" type="text" onBlur={handleBlur} placeholder="Your name"/>
        <br/>
        <input type="text" onBlur={handleBlur} name="email" placeholder="Your Email address" required />
        <br />
        <input type="password" onBlur={handleBlur} name="password" placeholder="Your Password" required />
        <br />
        <input type="submit" value="Submit" />
      </form>
      <p style={{color: 'red'}}>{user.error}</p>
      { user.success && <p style={{color: 'green'}}>User Created Successfully</p>}
    </div>
  );
}

export default App;
