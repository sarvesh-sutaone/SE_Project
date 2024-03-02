import React,{useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import '../views/profile.css';
import Upload from '../components/Upload';
import { BsChevronLeft } from "react-icons/bs";
import Navbar from "./NavbarHandlers.js";


const Profile = () => {
    const [editMode,setEditMode] =useState(false);
    const [userData, setUserData] = useState([]);
    const [tempUserData, setTempUserData] = useState({});
    const [newResumeUrl, setNewResumeUrl] = useState('');
    const [Save_active,setDisable] =useState(false);
      const navigate = useNavigate();

      useEffect(() => {
        const email = localStorage.getItem("email");
        if (email) {
            // logged in
            const id=localStorage.getItem("idToken");
            
            axios
            .get("https://se-project-backend-fard.onrender.com/getUserByID/", {
              headers: {
                authorization: `${id}`,
              },
            })
            .then((response) => {
                
                console.log(response.data);
                // Set the fetched projects to state
                setUserData(response.data);
                setTempUserData(response.data);
                console.log(response.data.resume_link);
                setNewResumeUrl(response.data.resume_link);
            })
            .catch((error) => {
                if(error.response.status===401)
                {
                    console.log("Unauth")
                    localStorage.clear();
                    navigate("/");
                }
              console.error("Error fetching projects:", error);
            });
            
        }
        else
        {
          localStorage.clear();
          navigate("/");
        }
      }, []);

      const handleEdit = () => {
        setTempUserData(userData); // Save current data before editing
        setEditMode(true);
      };

      const handleCancel = () => {
        setTempUserData(userData); // Restore original data
        setEditMode(false);
      };
      
      const handleSave = () => {

        // Disable Save Button
        setDisable(true);

        console.log(tempUserData);
        const id=localStorage.getItem("idToken");

        axios
        .put(
          "https://se-project-backend-fard.onrender.com/updateDetails",
          { name: tempUserData.name, resume_link: newResumeUrl },
          {
            headers: {
              authorization: `${id}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data); // Logging the response data to console
          tempUserData.resume_link=newResumeUrl;
          setUserData(tempUserData); // Update user data with edited values
          setEditMode(false);
        })
        .catch((error) => {
          if(error.response.status===401)
                {
                    console.log("Unauth")
                    localStorage.clear();
                    navigate("/");
                }
          console.error("Error fetching data:", error);
          setDisable(false);
        });

        // Enable Save Button
        setDisable(false);
        
      };

      const handleChange = (e) => {
        const { name, value } = e.target;
        setTempUserData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };

      const handleUpload = (url) => {
        setNewResumeUrl(url);
      };

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
    <div className='apply-form3'>
    <div className="d-flex justify-content-between align-items-left mb-3">
    <div className="col-auto"  style={{ paddingRight: '800px', backgroundColor: '#fff' }}>
     <button className="btn btn-link" onClick={goBack}>
        <BsChevronLeft size={24} />
     </button>

     
     </div>

    <div className="profile-container">

      <h2>Profile Page</h2>
      <div>
        <label>Name:</label>
        {editMode ? (
          <input
            type="text"
            name="name"
            value={tempUserData.name}
            onChange={handleChange}
          />
        ) : (
          <span>{userData.name}</span>
        )}
      </div>


      <div>
        <label>Email:</label>
        <span>{userData.email}</span>
        
      </div>
      <div>
        <label>Batch Year:</label>
        <span>{userData.batch_year}</span>
        </div>

        <div className="button-container">
  {editMode ? (
    <span>
      <Upload handleUpload={handleUpload} saveBtn_State={setDisable}/>
    </span>
  ) : (
    <button onClick={() => window.open(userData.resume_link, '_blank')}>Resume</button>
  )}
  
  {editMode ? (
    <div className="right">
      <button onClick={handleSave} disabled={Save_active}>Save</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  ) : (
    <button onClick={handleEdit}>Edit</button>
  )}
</div>

    </div>
    </div>
    </div>
    </div>
    
  )
}

export default Profile