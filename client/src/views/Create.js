import React from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsChevronLeft } from "react-icons/bs";
import '../views/create.css';




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
          "https://se-project-backend-one.vercel.app/newProject",
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
          if(error.response.status===401)
                {
                    console.log("Unauth")
                    localStorage.clear();
                    navigate("/");
                }
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
 
        <div>
      <div className="row justify-content-between align-items-center mb-3">
        <div className="col-auto">
          <button className="btn btn-link" onClick={goBack}>
            <BsChevronLeft size={24} />
          </button>
        </div>
        {/* <div className="col-auto">
          <button className="btn btn-danger" onClick={logout}>
            Logout
          </button>
        </div> */}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title:</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description:</label>
          <textarea
            className="form-control"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Pay:</label>
          <input
            type="number"
            className="form-control"
            value={pay}
            onChange={(e) => setPay(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Duration:</label>
          <input
            type="number"
            className="form-control"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Skills:</label>
          {skills.map((skill, index) => (
            <div key={index} className="d-flex align-items-center mb-2">
              <input
                type="text"
                className="form-control me-2"
                value={skill}
                onChange={(e) => handleSkillChange(index, e.target.value)}
              />
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => handleRemoveSkill(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={handleAddSkill}
          >
            Add Skill
          </button>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
    
  );
};

export default Create;