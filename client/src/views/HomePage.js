import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import '../views/HomePage.css';
import '../views/nav.css';
import Navbar from "./NavbarHandlers.js";
import '../views/global.css';


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

  const scrollToProjects = () => {
    document.getElementById("projects-section").scrollIntoView({ behavior: "smooth" });
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const CreateOpening = () => {
    navigate("/create");
  };

  const apply = (id, title) => {
    console.log("Title clicked: ", title);
    // navigate to Apply page with Id as params
    navigate(`/apply/${id}/${title}`);
  };

  const ViewApplications = () => {
    console.log("View Applications clicked");
    navigate("/applications");
  };

  const ViewAppliedProjects = () => {
    console.log("View Applied Projects clicked");
    navigate("/applied-projects");
  };

  const ViewSelectedProjects = () => {
    console.log("View Selected Projects clicked");
    navigate("/selected-projects");
  };

  const Profile = () => {
    console.log("View Profile");
    navigate("/profile");
  };



  return (
    <div>
      <Navbar
        CreateOpening={CreateOpening}
        ViewApplications={ViewApplications}
        ViewAppliedProjects={ViewAppliedProjects}
        ViewSelectedProjects={ViewSelectedProjects}
        Profile={Profile}
        logout={logout}
      />
      <div className="hero-container">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div h1 className="hero-heading">
          <span style={{ fontWeight: 400 }}>UNLOCKING</span> 
          <span style={{ display: 'block' ,fontWeight: 600, }}>OPPORTUNITIES</span> 
          <span style={{fontWeight: 400 }}>BUILDING</span> 
          <span style={{ fontWeight: 600 }}> FUTURES</span>
       </div>
          <button onClick={scrollToProjects} className="view-projects-button">
            View Projects
          </button>
        </div>
      </div>

      <div className="container mt-4 text-center" id="projects-section" style={{ margin: 'auto', maxWidth: '1200px' }}>
      <div className="projects-heading-container" style={{ padding: '40px' }}>
  <h1 style={{ fontWeight: 600, fontFamily: 'Clash Display Variable', fontSize: '60px' }}>PROJECTS</h1>
</div>
  <div className="project-container"> 
    <ul className="project-list">
      {projects.length > 0 ? (
        projects.map((prj) => (
          <li key={prj._id} className="project-item">
            <div className="project-item-content">
              <h3>{prj.title}</h3>
              <p>{prj.description}</p>
              <p>
                <b>Pay</b>: {prj.pay} &nbsp; <b>Duration</b>: {prj.duration}
              </p>
              {prj.skills.length > 0 ? (
                <div className="skills">
                  <ul className="list-inline">
                    {prj.skills.map((skill, index) => (
                      <li key={index} className="badge me-1" style={{ backgroundColor: '#F5F2F7', borderRadius: '160px', color:'#64556D', fontSize:'1.5rem', fontWeight:'lighter'}}>{skill}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No specific skill requirement</p>
              )}
            </div>
            <div className="apply-btn-container">
              <button className="apply-btn1" onClick={() => apply(prj._id, prj.title)}>Apply</button>
            </div>
           </li>
        ))
      ) : (
        <div className="alert alert-warning" role="alert">No Projects Available</div>
      )}
    </ul>
  </div>
</div>



    </div>
  );
}

export default Home;
