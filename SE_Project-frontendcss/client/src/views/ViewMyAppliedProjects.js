import axios from 'axios';
import React,{useEffect,useState} from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ViewMyAppliedProjects = () => {
    // View all my applied projects

    ////REQUIREMENTS: We need to show proposal submitted as well
    const navigate = useNavigate();
    const id=localStorage.getItem('idToken');
    const [projects, setProjects] = useState([]);

    const goBack = ()=>{ 
        navigate('/home');
      };
  
      const logout = () => {
        localStorage.clear();
        navigate("/");
      };


      useEffect(() => {
        // Fetch projects when the component mounts
        axios
          .get("http://localhost:3001/myAppliedProjects", {
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

  return (
    <div>
      <Navbar />
      <button onClick={goBack}>Back Button</button>
      <button onClick={logout}>Logout</button>
      <h1>Your Applied Projects</h1>

      <div>
      {projects.length > 0
          ? projects.map((prj) => (
              <div key={prj._id}>
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
              </div>
            ))
          : "You have not applied in any projects yet. Keep searching for your passion :)"}
      </div>
    </div>
  )
}

export default ViewMyAppliedProjects
