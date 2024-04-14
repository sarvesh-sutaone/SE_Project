import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsChevronLeft } from "react-icons/bs";
import '../views/view_applied.css';
import Navbar from "./NavbarHandlers.js";
import '../views/global.css';
import {ToastContainer, toast} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const ViewMyAppliedProjects = () => {
  const navigate = useNavigate();
  const id = localStorage.getItem('idToken');
  const [projects, setProjects] = useState([]);
  const [rejects, setRejects] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading projects
  const [rejLoad, setRejLoading] = useState(true);

  const goBack = () => {
    navigate('/home');
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    displayDetails();
      }, []);

  const deletePendingApplication =(projectId) =>{

    axios
      .delete(`${process.env.REACT_APP_BACKEND_URL}/deleteApplication/${projectId}`,
        { headers: { authorization: `${id}` } })
      .then((response) => {
        displayDetails();
        toast.success('Successfully Retracted Application', { position: "top-center", autoClose: 1000, hideProgressBar: true, closeOnClick: true, pauseOnHover: false, draggable: false, progress: undefined, theme: "dark" });
      })
      .catch((error) => {
        toast.error('Oh ohhh. Sorry! ', { position: "top-center", autoClose: 1000, hideProgressBar: true, closeOnClick: true, pauseOnHover: false, draggable: false, progress: undefined, theme: "dark" });
      });
  };

  const displayDetails=()=>{
    axios
    .get(`${process.env.REACT_APP_BACKEND_URL}/myAppliedProjects`, {
      headers: {
        authorization: `${id}`,
      },
    })
    .then((response) => {
      console.log(response.data);
      setProjects(response.data);
      setLoading(false); // Turn off loading spinner when projects are fetched
    })
    .catch((error) => {
      setLoading(false); // Turn off loading spinner in case of error
      if (error.response.status === 401) {
        console.log("Unauth");
        localStorage.clear();
        navigate("/");
      }
      console.error("Error fetching projects:", error);
    });

    axios
    .get(`${process.env.REACT_APP_BACKEND_URL}/myRejectedProjects`, {
      headers: {
        authorization: `${id}`,
      },
    })
    .then((response) => {
      console.log(response.data);
      setRejects(response.data);
      setRejLoading(false); // Turn off loading spinner when projects are fetched
    })
    .catch((error) => {
      setRejLoading(false); // Turn off loading spinner in case of error
      if (error.response.status === 401) {
        console.log("Unauth");
        localStorage.clear();
        navigate("/");
      }
      console.error("Error fetching projects:", error);
    });

  };

  return (
    <div>
      <Navbar />
      <div className="apply-form3">
        <div className="row justify-content-between align-items-center mb-5 left-margin">
          <div className="col-auto">
            <button className="btn btn-link" onClick={goBack}>
              <BsChevronLeft size={24} />
            </button>
          </div>
        </div>
  
        <h1 className="with-margin1">Your Pending Applications</h1>
  
        <div>
          {loading ? ( // Render spinner while loading is true
            <div className="spinner-container">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="project-container">
              <ul className="project-list">
                {projects.length > 0 ? (
                  projects.map((prj) => (
                    <div key={prj._id} className="project-item" style={{minWidth: "350px"}}>
                      <div className="project-item-content">
                        <h3>{prj.title}</h3>
                        <p style={{ fontSize: "1.2rem"}}>{prj.description}</p>
                        <p style={{ fontSize: "1.2rem"}}>
                          <b>Pay</b>: {prj.pay?(<><b>Rs {prj.pay}</b></>):(<>Experience</>)} &nbsp; <b>Duration</b>: {prj.duration} weeks
                        </p>
  
                        {prj.skills.length > 0 ? (
                          <div className="skills">
                            {prj.skills.map((skill, index) => (
                              <p
                                key={index}
                                className="badge"
                                style={{
                                  backgroundColor: '#F5F2F7',
                                  borderRadius: '30px',
                                  color: '#64556D',
                                  fontSize: '1.2rem',
                                  fontWeight: 'lighter',
                                  display: 'inline-block'
                                }}
                              >
                                {skill}
                              </p>
                            ))}
                          </div>
                        ) : (
                          "No specific skill requirement"
                        )}
                      </div>
                      <div className="project-actions">
                        {/* Add Delete button */}
                        <button className="apply-btn1" onClick={() => deletePendingApplication(prj._id)}>Retract</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>You have not applied to any projects yet. Keep searching for your passion :)</p>
                )}
              </ul>
            </div>
          )}
        </div>
  
        <h1 className="with-margin1">Your Rejected Applications</h1>
  
        <div>
          {rejLoad ? ( // Render spinner while loading is true
            <div className="spinner-container">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="project-container">
              <ul className="project-list">
                {rejects.length > 0 ? (
                  rejects.map((prj) => (
                    <div key={prj._id} className="project-item" style={{minWidth: "350px"}}>
                      <div className="project-item-content">
                        <h3>{prj.title}</h3>
                        <p style={{ fontSize: "1.2rem"}}>{prj.description}</p>
                        <p style={{ fontSize: "1.2rem"}}>
                          <b>Pay</b>: {prj.pay} &nbsp; <b>Duration</b>: {prj.duration} weeks
                        </p>
  
                        {prj.skills.length > 0 ? (
                          <div className="skills">
                            <ul className="list-inline">
                            {prj.skills.map((skill, index) => (
                              <li
                                key={index}
                                className="badge me-1"
                                style={{
                                  backgroundColor: '#F5F2F7',
                                  borderRadius: '30px',
                                  color: '#64556D',
                                  fontSize: '1.2rem',
                                  fontWeight: 'lighter',
                                }}
                              >
                                {skill}
                              </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          "No specific skill requirement"
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>You have not been rejected from any projects yet. Yay!</p>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
  export default ViewMyAppliedProjects;
  