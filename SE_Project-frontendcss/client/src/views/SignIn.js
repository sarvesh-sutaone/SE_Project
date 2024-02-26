import React, { useEffect, useState } from "react";
import { auth, provider } from "../components/config";
import { signInWithPopup } from "firebase/auth";
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import BannerImage from '../assets/BITSHAudi.jpg';
import Logo from '../assets/BITSCONNECT_logo.png';
import "../styles/SignIn.css";
import Navbardummy from "../components/Navbardummy";

function SignIn() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      setUser(email);
      navigate('/home');
    }
  }, []);

  const handleClick = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        const { displayName, email } = user;
        user.getIdToken().then((idToken) => {
          localStorage.setItem("idToken",idToken);
          setUser(email);
          localStorage.setItem("email", email);
          sendUserDataToBackend(displayName, email, idToken);
        });
        // localStorage.setItem("idToken",id);
      })
      .catch((error) => {
        console.error("Sign-in failed:", error);
      });
  };

  const sendUserDataToBackend = (name, email, idToken) => {
    axios.post("http://localhost:3001/auth", {
      name,
      email,
      idToken
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`
      },
      mode: "cors"
    })
    .then((response) => {
      if (response.status === 200) {
        navigate('/home'); // Use history.push to redirect
      } else if (response.status === 201) {
        navigate('/register'); // Use history.push to redirect
      }
      console.log("User data sent to backend successfully");
    })
    .catch((error) => {
      console.error("Error sending user data to backend:", error);
    });
  };

  return (
    <div className="SignIn">
      <Navbardummy />
      <div className="SignInTop" style={{backgroundImage: `url(${BannerImage})`}}> </div>
      <div className="SignInBottom"> 
      <h1>Welcome to BITSConnect</h1>      
      {user ? (
        <></>
      ) : (
        <button onClick={handleClick}>Sign in With Google</button>
      )}
      </div>
    </div>
  );
      }

export default SignIn;
