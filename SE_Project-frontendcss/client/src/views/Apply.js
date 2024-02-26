import React,{useState} from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import axios from "axios";
import Navbar from '../components/Navbar';

const Apply = () => {
    const {prj_id,title} = useParams();
    const navigate = useNavigate();
    const [proposal,setProposal] =useState('');

    // fetch project details using id... so that details can be confirmed
    const goBack = ()=>{
        
        navigate('/home');
      };
  
      const logout = () => {
        localStorage.clear();
        navigate("/");
      };

      const handleSubmit =(e)=>{
        e.preventDefault();
        // Filter out empty skills
        if(!proposal)
        {
          alert('Please add SOP');
          return;
        }

        console.log('Submit button clicked');
        // Add user id to applied_users in Project Table
        // Add project_id(id) and proposal(desc) to User Table
        const id = localStorage.getItem("idToken");

          // Handle form submission here
          //console.log({prj_id,proposal});
          if (id) {
            axios
              .post(
                "http://localhost:3001/apply",
                { project_id:prj_id, proposal},
                {
                  headers: {
                    authorization: `${id}`,
                  },
                }
              )
              .then((response) => {
                alert('Successfully applied for project ID');
                console.log(response.data); // Logging the response data to console
                navigate("/home");
              })
              .catch((error) => {
                console.error("Error fetching data:", error);
              });
          } else {
            console.error("idToken is null or undefined");
          }

      }

  return (
    <div>
    <Navbar />
    <button onClick={goBack}>Back Button</button>
    <button onClick={logout}>Logout</button>
    <form onSubmit={handleSubmit}>
      
      <h1> Are you sure you want to apply for Project: {title}</h1>
      <div>
        <label>SOP: Your Proposal to help your candidature :</label>
        <textarea value={proposal} onChange={(e) => setProposal(e.target.value)}></textarea>
      </div>
      <button type="submit">Submit</button>
    </form>
    </div>
  )
}

export default Apply
