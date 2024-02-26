import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbardummy from "../components/Navbardummy";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [gradYear, setYear] = useState("");
  const [res_link, setResume] = useState("resume_link");

  const onSubmit = (e) => {
    console.log("Submit pressed");
    e.preventDefault();

    if (!setYear) {
      alert("Please add a Graduation year");
      return;
    }

    // Handle format issues for batch year

    const id = localStorage.getItem("idToken");
    console.log(id);
    // Check if idToken is null or undefined before making the request
    if (id) {
      axios
        .put(
          "http://localhost:3001/updateDetails",
          { name: name, batch_year: gradYear },
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
          console.error("Error fetching data:", error);
        });
    } else {
      console.error("idToken is null or undefined");
    }

    setName("");
    setYear("");
  };

  return (

    <form className="add-form form-Padding" onSubmit={onSubmit}>
      <div className="form-control">
        <label>Your description</label>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-control">
        <label>Graduation Year</label>
        <input
          type="number"
          placeholder="XXXX"
          value={gradYear}
          onChange={(e) => setYear(e.target.value)}
        />
      </div>
      <input type="submit" value="Save Details" className="btn btn-block" />
    </form>
  );
};

export default Register;
