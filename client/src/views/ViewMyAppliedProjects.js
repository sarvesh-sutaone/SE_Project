import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsChevronLeft } from "react-icons/bs";
import '../views/view_applied.css';
import Navbar from "./NavbarHandlers.js";
import '../views/global.css';



const ViewMyAppliedProjects = () => {
  const navigate = useNavigate();
  const id = localStorage.getItem('idToken');
  const [projects, setProjects] = useState([]);

  const goBack = () => {
    navigate('/home');
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/myAppliedProjects", {
        headers: {
          authorization: `${id}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setProjects(response.data);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  }, []);

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
        {/* <div className="col-auto">
          <button className="btn btn-danger" onClick={logout}>
            Logout
          </button>
        </div> */}
      </div>

      <h1 class="with-margin1">Your Applied Projects</h1>

      <div>
        {projects.length > 0 ? (
          projects.map((prj) => (
            <div key={prj._id} className="project-item2">
              <div className="project-item-content1">
                <h3>{prj.title}</h3>
                <p>{prj.description}</p>
                <p>
                  <b>Pay</b>: {prj.pay} &nbsp; <b>Duration</b>: {prj.duration}
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
            </div>
          ))
        ) : (
          <p>You have not applied to any projects yet. Keep searching for your passion :)</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default ViewMyAppliedProjects;