import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from '../components/Navbar';

const Applications = () => {
  // Should have a select bar for projects posted
  // Based on selected project - Show applications
  const id = localStorage.getItem("idToken");
  const [projects, setProjects] = useState([]);
  const [selectedProjectId,setSelProId]=useState();
  const [selectedProjectTitle,setSelPro]=useState();
  const [proposals,setProposals]=useState([]);
  const [selectedProposals,setSelectedProposals]=useState([]);




  useEffect(() => {
    // Fetch projects when the component mounts
    axios
      .get("http://localhost:3001/myProjects", {
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




  const navigate = useNavigate();
  const goBack = () => {
    navigate("/home");
  };



  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  
  
  const getApplications=(e)=>{
    const project_id = e.currentTarget.value; // Use currentTarget to get value from select element
    console.log(project_id);
    setSelPro(e.currentTarget.title);
    setSelProId(project_id);
    const user_id = localStorage.getItem("idToken");
    //console.log(user_id);

    // Fetch Active Proposals Applications
    axios
    .get(`http://localhost:3001/getApplicationsByProject/${project_id}`, {
      headers: {
        authorization: `${user_id}`,
      },
    })
    .then((response) => {
      console.log("Response for Active:",response.data);
      // Set the fetched projects to state
      setProposals(response.data);
    })
    .catch((error) => {
      console.error("Error fetching projects:", error);
    });

    // Fetch Selected Proposals /getSelectedApplicationsByProject/:project_id
    axios
    .get(`http://localhost:3001/getSelectedApplicationsByProject/${project_id}`, {
      headers: {
        authorization: `${user_id}`,
      },
    })
    .then((response) => {
      console.log("Response for Selected:",response.data);
      // Set the fetched projects to state
      setSelectedProposals(response.data);
    })
    .catch((error) => {
      console.error("Error fetching projects:", error);
    });
  };




  const SelectUser=(user_id)=>{
    console.log('User Id selected: ',user_id);

    const id = localStorage.getItem("idToken");

    // Handle form submission here
    //console.log({ title, pay, duration, desc, skills: filteredSkills });
    if (id) {
      axios
        .post(
          "http://localhost:3001/applyUser",
          { user_id,project_id:selectedProjectId},
          {
            headers: {
              authorization: `${id}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data); // Logging the response data to console
          
          // Fetch Active Proposals Applications
          axios
          .get(`http://localhost:3001/getApplicationsByProject/${selectedProjectId}`, {
            headers: {
              authorization: `${id}`,
            },
          })
          .then((response) => {
            console.log("Response for Active:",response.data);
            // Set the fetched projects to state
            setProposals(response.data);
          })
          .catch((error) => {
            console.error("Error fetching projects:", error);
          });
        
          // Fetch Selected Proposals /getSelectedApplicationsByProject/:project_id
          axios
          .get(`http://localhost:3001/getSelectedApplicationsByProject/${selectedProjectId}`, {
            headers: {
              authorization: `${id}`,
            },
          })
          .then((response) => {
            console.log("Response for Selected:",response.data);
            // Set the fetched projects to state
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

  }

  return (
    // Select box for your posted projects
    // All applied users and proposals should populate for selected project

    // Controller ka KAAM
    // After addition to Team, toh selected_users should be added to Project list
    // And specific user entry should update selected_projects

    <div>
      <Navbar />
      <button onClick={goBack}>Back Button</button>
      <button onClick={logout}>Logout</button>
      <h1>Applications Page</h1>
      {projects.length>0 ?
        <div>
            <select onClick={getApplications}>
              {
                projects.map((prj) => (
                  <option value={prj._id} key={prj._id} title={prj.title}>{prj.title}</option>
                ))
              }
              </select>

              <div>
                <h2>{selectedProjectTitle}</h2>
                <div>
                  <h3>Selected Proposals</h3>
                  {
                    selectedProposals.length>0 ?
                    <div>
                        {selectedProposals.map((selProp) => (
                        <div>
                          <p>Name: {selProp.name} &nbsp; Email: {selProp.email}</p>
                          <p>Graduation Year: {selProp.batch_year} &nbsp; Resume link: {selProp.resume_link}</p>


                        </div>
                      ))}
                    </div>
                    :
                    'No Selected Applications Found'
                  }
                </div>
                <div>
                  <h3>Active Applications</h3>
                  {
                    proposals.length>0 ?
                    <div>
                      {proposals.map((propo) => (
                        <div>
                          <p>Name: {propo.name} &nbsp; Email: {propo.email}</p>
                          <p>Graduation Year: {propo.batch_year} &nbsp; Resume link: {propo.resume_link}</p>
                          
                          

                          <button onClick={() => SelectUser(propo._id)}>Yes</button>

                        </div>
                      ))}
                    </div>
                    :
                    'No Applications Found'
                  }
                </div>
              </div>
                
                
                
            <div>
                
            </div>
                
           


        </div>
        : 'No projects found'
      }
      
    </div>
  );
};

export default Applications;
