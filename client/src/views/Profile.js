import axios from 'axios';
import React,{useEffect,useState} from 'react';
import { useNavigate } from 'react-router-dom';
import '../views/profile.css';
import Upload from '../components/Upload';
import { BsChevronLeft } from "react-icons/bs";
import Navbar from "./NavbarHandlers.js";
import '../views/global.css';

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState([]);
  const [tempUserData, setTempUserData] = useState({});
  const [newResumeUrl, setNewResumeUrl] = useState('');
  const [Save_active, setDisable] = useState(false);
  const [loading, setLoading] = useState(true); // State for loading user data
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      const id = localStorage.getItem("idToken");
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/getUserByID/`, {
          headers: {
            authorization: `${id}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          setUserData(response.data);
          setTempUserData(response.data);
          setNewResumeUrl(response.data.resume_link);
          setLoading(false); // Turn off loading spinner when user data is fetched
        })
        .catch((error) => {
          setLoading(false); // Turn off loading spinner in case of error
          if (error.response.status === 401) {
            console.log("Unauth");
            localStorage.clear();
            navigate("/");
          }
          console.error("Error fetching user data:", error);
        });
    } else {
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
    setDisable(true); // Disable Save Button
    const id = localStorage.getItem("idToken");
    axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}/updateDetails`,
        { name: tempUserData.name, resume_link: newResumeUrl },
        {
          headers: {
            authorization: `${id}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        tempUserData.resume_link = newResumeUrl;
        setUserData(tempUserData); // Update user data with edited values
        setEditMode(false);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          console.log("Unauth");
          localStorage.clear();
          navigate("/");
        }
        console.error("Error fetching data:", error);
        setDisable(false); // Enable Save Button
      });
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
          <div className="col-auto" style={{ paddingRight: '10rem', backgroundColor: '#fff' }}>
            <button className="btn btn-link" onClick={goBack}>
              <BsChevronLeft size={24} />
            </button>
          </div>
          <div className="profile-container">
            <h2>Profile Page</h2>
            {loading ? (
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <>
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
                <div>
                  {editMode ? (
                    <span>
                      <Upload handleUpload={handleUpload} saveBtn_State={setDisable}/>
                    </span>
                  ) : (
                    <button onClick={() => window.open(userData.resume_link, '_blank')}>Resume</button>
                  )}
                </div>
                {editMode ? (
                  <div>
                    <button onClick={handleSave} disabled={Save_active}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                  </div>
                ) : (
                  <button onClick={handleEdit}>Edit</button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
