import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/HomePage.css';
import Navbar from '../components/Navbar';

function Home() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const id = localStorage.getItem("idToken");

  useEffect(() => {
    // Fetch projects when the component mounts
    axios
      .get("http://localhost:3001/projects", {
        headers: {
          authorization: `${id}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        // Set the fetched projects to state
        setProjects(response.data);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  }, []);



  const apply = (id,title) => {
    console.log("Title clicked: ", title);
    // navigate to Apply page with Id as params
    navigate(`/apply/${id}/${title}`);
  };
  return (
    <div className= "home"> 
    <Navbar />
    <h1 className="homeTitle">Discover BITSConnect</h1>     
      <div className="projectList">
      
        {projects.length > 0
          ? projects.map((prj) => (
              <div className ="projectItem" key={prj._id}>
                <h3>{prj.title}</h3>
                <p>{prj.description}</p>
                <p>
                  <b>Pay</b>: {prj.pay} &nbsp; <b>Duration</b>: {prj.duration}
                </p>

                {prj.skills.length > 0
                  ? prj.skills.map((skill, index) => (
                      <p key={index}>{skill} </p>
                    ))
                  : "No specific skill-requirement"}
                <button onClick={() => apply(prj._id,prj.title)}>Apply!</button>
              </div>
            ))
          : "No Projects Available"}
      </div>
    </div>
  );
}
export default Home;
