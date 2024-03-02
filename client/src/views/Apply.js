import React,{useState} from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import axios from "axios";
import { BsChevronLeft } from "react-icons/bs";
import '../views/apply.css';


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
    <div className="apply-form">
    <div className="d-flex justify-content-between align-items-left mb-3">
        <div className="col-auto">
          <button className="btn btn-link" onClick={goBack}>
            <BsChevronLeft size={24} />
          </button>
        </div>
        {/* <div className="col-auto">
          <button className="btn btn-danger" onClick={logout}>
            Logout
          </button>
        </div>*/}
      </div> 
      <form onSubmit={handleSubmit} className="apply-form2">
  <h1>Apply for the Project {title}</h1>
  <div>
    <label className="form-label2">SOP: Your Proposal to help your candidature:</label>
    <textarea
      value={proposal}
      onChange={(e) => setProposal(e.target.value)}
      className="form-control2"
    ></textarea>
  </div>
  <button type="submit" className="btn2">
    Submit
  </button>
</form>

    </div>
  )
}

export default Apply
