import axios from 'axios';
import React,{useEffect,useState} from 'react'
import { useNavigate } from 'react-router-dom';
import '../views/view_selected.css';
import { BsChevronLeft } from "react-icons/bs";
import Navbar from "./NavbarHandlers.js";
import '../views/global.css';





const ViewMySelectedProjects = () => {
    // View all the projects that I got selected for
    const navigate = useNavigate();
    const id=localStorage.getItem('idToken');
    const [projects, setProjects] = useState([]);

    useEffect(() => {
      // Fetch projects when the component mounts
      axios
        .get("http://localhost:3001/mySelectedProjects", {
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

    const goBack = ()=>{ 
        navigate('/home');
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




