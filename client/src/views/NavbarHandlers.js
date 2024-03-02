import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import '../views/styles.css';
import '../views/global.css';



const Navbar = () => {
  const navigate = useNavigate();

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
    <nav id="navbar" className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#130525' }}>
      <div className="container-fluid">
      <a className="navbar-brand" href="#" onClick={() => navigate('/home')}>
          <span style={{
            fontFamily: 'SpaceQuest',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '36px',
            lineHeight: '43px',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            marginLeft: '20px' // Adjust margin-left as needed
          }}>
            BITSCONNECT...
          </span>
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <button className="nav-link btn btn-primary mx-2" onClick={CreateOpening}>Post</button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-primary mx-2" onClick={ViewApplications}>Applications</button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-primary mx-2" onClick={ViewAppliedProjects}>Applied</button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-primary mx-2" onClick={ViewSelectedProjects}>Selected Projects</button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-primary mx-2 rounded-circle profile-button" onClick={Profile}>
                <FontAwesomeIcon icon={faUser} style={{ width: '25px', height: '25px' }} />
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-primary mx-2" onClick={logout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
