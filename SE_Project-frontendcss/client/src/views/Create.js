import React from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Create.css";
import Navbar from '../components/Navbar';

const Create = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [pay, setPay] = useState("");
  const [duration, setDuration] = useState("");
  const [desc, setDesc] = useState("");
  const [skills, setSkills] = useState([]);

  // HATAYA NAHI HAI INCASE YOU NEED A TEMPLATE
  //const onSubmit =(e) =>{
  //    console.log('Submit pressed')
  //    e.preventDefault()
  //
  //
  //
  //    const id = localStorage.getItem("idToken");
  //    console.log(id);
  //    // Check if idToken is null or undefined before making the request
  //    if (id) {
  //      axios.put('http://localhost:3001/updateDetails', { "name":name, "batch_year": gradYear }, {
  //        headers: {
  //          "authorization": `${id}`
  //        }
  //      })
  //        .then(response => {
  //          console.log(response.data); // Logging the response data to console
  //          navigate('/home');
  //        })
  //        .catch(error => {
  //          console.error('Error fetching data:', error);
  //        });
  //    } else {
  //      console.error('idToken is null or undefined');
  //    }
  //
  //
  //    setName('')
  //    setYear('')
  //}

  const handleSkillChange = (index, value) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
  };

  const handleAddSkill = () => {
    setSkills([...skills, ""]);
  };

  const handleRemoveSkill = (index) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Filter out empty skills
    if (!title) {
      alert("Please add title");
      return;
    }
    const filteredSkills = skills.filter((skill) => skill.trim() !== "");
    const id = localStorage.getItem("idToken");

    // Handle form submission here
    //console.log({ title, pay, duration, desc, skills: filteredSkills });
    if (id) {
      axios
        .post(
          "http://localhost:3001/newProject",
          { title, pay, duration, description: desc, skills: filteredSkills },
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
    alert("Project Posted");

    setPay("");
    setDuration("");
    setDesc("");
    setSkills([]);
  };

  const goBack = () => {
    setPay("");
    setDuration("");
    setDesc("");
    setSkills([]);
    navigate("/home");
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="createappl">
      <Navbar />
      <button onClick={goBack}>Back Button</button>
      <button onClick={logout}>Logout</button>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label>Pay:</label>
          <input
            type="number"
            value={pay}
            onChange={(e) => setPay(e.target.value)}
          />
        </div>
        <div>
          <label>Duration:</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        <div>
          <label>Skills:</label>
          {skills.map((skill, index) => (
            <div key={index}>
              <input
                type="text"
                value={skill}
                onChange={(e) => handleSkillChange(index, e.target.value)}
              />
              <button type="button" onClick={() => handleRemoveSkill(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddSkill}>
            Add Skill
          </button>
        </div>
        <button className="submitbutton" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Create;
