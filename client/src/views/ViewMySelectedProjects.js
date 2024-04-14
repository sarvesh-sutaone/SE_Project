import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsChevronLeft } from "react-icons/bs";
import Navbar from "./NavbarHandlers.js";
import '../views/global.css';
import '../views/view_selected.css';

const ViewMySelectedProjects = () => {
  const navigate = useNavigate();
  const id = localStorage.getItem("idToken");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading projects

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/mySelectedProjects`, {
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
  }, []);

  const goBack = () => {
    navigate("/home");
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
      <Navbar/>
      <div className="apply-form3">
        <div className="row justify-content-between align-items-center mb-5 left-margin">
          <div className="col-auto">
            <button className="btn btn-link" onClick={goBack}>
              <BsChevronLeft size={24} />
            </button>
          </div>
        </div>    
        
        <h1 className="with-margin2">Your Current Projects</h1>
        <div>
          {loading ? ( // Render spinner while loading is true
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : projects.length > 0 ? (
            projects.map((prj) => (
              <div key={prj._id} className="project-item2" style={{padding:"1rem"}}>
                <div className="project-item-content2">
                  <h2>{prj.title}</h2>
                  <p>{prj.description}</p>
                  <button
                      className="btn2 btn-success" style={{ backgroundColor: 'transparent', color: 'black', border: '1px solid black', fontSize: '16px' }}
                      onClick={() => window.open(prj.jobDescription, '_blank')}
                    >
                      Job Description
                    </button>
                  <p>
                    <b>Pay</b>: {prj.pay} &nbsp; <b>Duration</b>: {prj.duration} weeks
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
                            fontSize: '1.5rem',
                            fontWeight: 'lighter',
                            display: 'inline-block',
                            marginRight: '0.5rem',
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
              </div>
            ))
          ) : (
            <p>Sorry! You have not been spotted yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewMySelectedProjects;