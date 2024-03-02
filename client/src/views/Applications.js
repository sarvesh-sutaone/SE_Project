import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsChevronLeft } from "react-icons/bs";
import '../views/applications.css';




const Applications = () => {
  const navigate = useNavigate();
  const id = localStorage.getItem("idToken");
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelProId] = useState();
  const [selectedProjectTitle, setSelPro] = useState();
  const [proposals, setProposals] = useState([]);
  const [selectedProposals, setSelectedProposals] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/myProjects", {
        headers: {
          authorization: `${id}`,
        },
      })
      .then((response) => {
        setProjects(response.data);
      })
      .catch((error) => {
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

  const getApplications = (e) => {
    const project_id = e.currentTarget.value;
    setSelPro(e.currentTarget.title);
    setSelProId(project_id);
    const user_id = localStorage.getItem("idToken");

    axios
      .get(`http://localhost:3001/getApplicationsByProject/${project_id}`, {
        headers: {
          authorization: `${user_id}`,
        },
      })
      .then((response) => {
        setProposals(response.data);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });

    axios
      .get(`http://localhost:3001/getSelectedApplicationsByProject/${project_id}`, {
        headers: {
          authorization: `${user_id}`,
        },
      })
      .then((response) => {
        setSelectedProposals(response.data);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  };

  const SelectUser = (user_id) => {
    const id = localStorage.getItem("idToken");

    if (id) {
      axios
        .post(
          "http://localhost:3001/applyUser",
          { user_id, project_id: selectedProjectId },
          {
            headers: {
              authorization: `${id}`,
            },
          }
        )
        .then((response) => {
          axios
            .get(`http://localhost:3001/getApplicationsByProject/${selectedProjectId}`, {
              headers: {
                authorization: `${id}`,
              },
            })
            .then((response) => {
              setProposals(response.data);
            })
            .catch((error) => {
              console.error("Error fetching projects:", error);
            });

          axios
            .get(`http://localhost:3001/getSelectedApplicationsByProject/${selectedProjectId}`, {
              headers: {
                authorization: `${id}`,
              },
            })
            .then((response) => {
              setSelectedProposals(response.data);
            })
            .catch((error) => {
              console.error("Error fetching projects:", error);
            });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } else {
      console.error("idToken is null or undefined");
    }
  };

  return (
    <div className="apply-form3">
      <div className="d-flex justify-content-between align-items-left mb-3">
        <button className="btn btn-link" onClick={goBack}>
          <BsChevronLeft size={24} />
        </button>
        {/* <button className="btn btn-danger" onClick={logout}>Logout</button> */}
      </div>
      <div className="heading">
        <h1>Applications Page</h1>
      </div>
      {projects.length > 0 ? (
        <div className="select-container">
          <div>
            <select className="form-select mt-3 custom-select" onClick={getApplications}>
              {projects.map((prj) => (
                <option value={prj._id} key={prj._id} title={prj.title}>
                  {prj.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <h2>{selectedProjectTitle}</h2>
            <div className="sel">
              <h3>Selected Proposals</h3>
              {selectedProposals.length > 0 ? (
                <div>
                  {selectedProposals.map((selProp) => (
                    <div key={selProp._id} className="card mb-2">
                      <div className="card-body">
                      <p>Name: {selProp.name}</p>
                      <p>Email: {selProp.email}</p>
                      <p>Graduation Year: {selProp.batch_year}</p>
                      <p>Resume link: {selProp.resume_link}</p>
                    </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No Selected Applications Found</p>
              )}
            </div>
            <div className="sel">
              <h3>Active Applications</h3>
              {proposals.length > 0 ? (
                <div>
                  {proposals.map((propo) => (
                    <div key={propo._id} className="card mb-2">
                      <div className="card-body">
                        <p>Name: {propo.name} &nbsp; Email: {propo.email}</p>
                        <p>Graduation Year: {propo.batch_year} &nbsp; Resume link: {propo.resume_link}</p>
                        <button className="btn btn-success" onClick={() => SelectUser(propo._id)}>Yes</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No Applications Found</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p>No projects found</p>
      )}
    </div>
  );
};

export default Applications