import axios from 'axios';
import React,{useEffect,useState} from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

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
        <Navbar />
        <button onClick={goBack}>Back Button</button>
        <button onClick={logout}>Logout</button>
        <h1>Your Current Projects</h1>
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
              : "Sorry ! You have not been spotted yet."}
          </div>
    </div>
  )
}

export default ViewMySelectedProjects
