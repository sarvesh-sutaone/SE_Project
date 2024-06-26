import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Upload from '../components/Upload';
import "../views/Register.css";
import '../views/global.css';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [res_link, setResume] = useState("");
  const [Save_active,setDisable] =useState(false);

  const handleUpload = (url) => {
    setResume(url);
  };

  const onSubmit = (e) => {
    setDisable(true);
    console.log("Submit pressed Submit disabled");
    e.preventDefault();

    if(res_link!=='')
    {
      const id = localStorage.getItem("idToken");
      console.log(id);
      // Check if idToken is null or undefined before making the request
      if (id) {
        axios
          .put(
            `${process.env.REACT_APP_BACKEND_URL}/updateDetails`,
            { name: name,resume_link: res_link },
            {
              headers: {
                authorization: `${id}`,
              },
            }
          )
          .then((response) => {
            console.log(response.data); // Logging the response data to console
            navigate("/home");
          })
          .catch((error) => {
            if(error.response.status===401)
                {
                    console.log("Unauth")
                    localStorage.clear();
                    navigate("/");
                }
            console.error("Error fetching data:", error);
            setDisable(false);
          });
      } else {
        console.error("idToken is null or undefined");
        setDisable(false);
      }
    }
    else
    {
      alert('Resume Not Found. Please confirm that you have clicked the Upload Button')

      setDisable(false);
    }
    
  };

  return (
    <div className="BG">
      <div className="add-form form-Padding">
      <div className="form-control1">
        <label>Your Name: </label>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-control1">
        <Upload handleUpload={handleUpload} saveBtn_State={setDisable}/>
      </div>
      <button onClick={onSubmit} value="Save Details" className="btn btn-block" disabled={Save_active}>Submit</button>
      </div>
    </div>
  );
};

export default Register;
