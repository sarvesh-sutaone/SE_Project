import React from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsChevronLeft } from "react-icons/bs";
import "../views/styles.css";
import Navbar from "./NavbarHandlers.js";
import "../views/global.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Upload from "../components/Upload";
import "../views/create.css";

const Create = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // State for loading spinner
  const [title, setTitle] = useState("");
  const [pay, setPay] = useState(0);
  const [duration, setDuration] = useState(0);
  const [desc, setDesc] = useState("");
  const [skills, setSkills] = useState([]);
  const [deadline, setDeadline] = useState(""); // State for deadline
  const [jobDescription, setJD] = useState("");
  const [Save_active, setDisable] = useState(false);

  const handleUpload = (url) => {
    setJD(url);
  };

  const handleSkillChange = (index, value) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
  };

  const handleAddSkill = () => {
    setSkills([...skills, ""]);
  };

  const handleRemoveSkill = (index) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
  };

  const handleDeadlineChange = (e) => {
    setDeadline(e.target.value);
    console.log("Dead date: ", e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Show spinner on submit
    // Filter out empty skills
    if (!title) {
      toast.error("Please add title", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
      });
      setLoading(false);
      return;
    }

    if (!duration) {
      toast.error("Please enter duration", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
      });
      setLoading(false);
      return;
    }

    if (!deadline) {
      toast.error("Please enter deadline", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
      });
      setLoading(false);
      return;
    }

    if (title.length < 3) {
      toast.error("Title must be at least 3 characters long", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
      });
      setLoading(false);
      return;
    }
    
    // Check if either job description is provided
    if (!jobDescription) {
      toast.error("Please provide Job Description.", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
      });
      setLoading(false);
      return;
    }
    // Check if either job description or description is provided
    if (!jobDescription && !desc) {
      toast.error("Please provide either Job Description or Description.", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
      });
      setLoading(false);
      return;
    }

    // Check if description is at least 10 characters long
    if (desc.length < 10) {
      toast.error("Description must be at least 10 characters long", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
      });
      setLoading(false);
      return;
    }

    if (pay && pay < 0) {
      
      setPay("");
      toast.error("Pay cannot be negative", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
      });
      setLoading(false);
      return;
    }

    // Duration check
    if (!duration || duration <= 0) {
      setDuration("");
      toast.error("Duration must be greater than 0", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
      });
      setLoading(false);
      return;
    }

    const filteredSkills = skills.filter((skill) => skill.trim() !== "");
    const id = localStorage.getItem("idToken");

    // Handle form submission here
    //console.log({ title, pay, duration, desc, skills: filteredSkills });
    if (id) {
      axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/newProject`,
          {
            title,
            pay,
            duration,
            description: desc,
            skills: filteredSkills,
            deadline,
            jobDescription,
          },
          {
            headers: {
              authorization: `${id}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data); // Logging the response data to console
          toast.success("Project Posted Successfully", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "dark",
          });
          navigate("/home");
        })
        .catch((error) => {
          if (error.response.status === 401) {
            console.log("Unauth");
            toast.error("Logged Out", {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
              theme: "dark",
            });
            localStorage.clear();
            navigate("/");
          }
          console.error("Error fetching data:", error);

          toast.error("Error Fetching Data", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "dark",
          });
        }).finally(()=>{
          setLoading(false);
        });
    } else {
      console.error("idToken is null or undefined");
      setLoading(false);
    }

  };

  const goBack = () => {
    setPay("");
    setDuration("");
    setDesc("");
    setSkills([]);
    navigate("/home");
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
      <Navbar />
      <div className="apply-form6">
        <div className="row justify-content-between align-items-center mb-3">
          <div className="col-auto">
            <button className="btn btn-link" onClick={goBack}>
              <BsChevronLeft size={24} />
            </button>
          </div>
        </div>
        <div>
          <div className="mb-3">
            <label className="form-label">
              Title <span style={{ color: "red" }}>*</span>:
            </label>
            <input
              type="text"
              className="form-control title-textarea"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter at least 3 characters"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description:</label>
            <textarea
              className="form-control desc-textarea"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Enter at least 10 characters"
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Job Description <span style={{ color: "red" }}>*</span>:</label>

            <Upload handleUpload={handleUpload} saveBtn_State={setDisable} />
          </div>

          <div className="mb-3">
            <div className="d-flex">
              <div className="me-3">
                <label className="form-label">Pay (Rs):</label>
                <input
                  style={{ width: "80%" }}
                  type="number"
                  className="form-control pay-textarea"
                  min="0"
                  value={pay}
                  onChange={(e) => setPay(e.target.value)}
                  placeholder="Enter pay in INR"
                />
              </div>
              <div>
                <label className="form-label">
                  Duration(weeks) <span style={{ color: "red" }}>*</span>:
                </label>
                <input
                  style={{ width: "80%" }}
                  type="number"
                  className="form-control duration-textarea"
                  value={duration}
                  min="0"
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Enter duration in weeks"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">
              {" "}
              Application Deadline <span style={{ color: "red" }}>*</span>:
            </label>
            <input
              type="date"
              className="form-control4"
              value={deadline}
              onChange={handleDeadlineChange}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label skills-textarea">Skills:</label>
            {skills.map((skill, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <input
                  type="text"
                  className="form-control me-2"
                  value={skill}
                  onChange={(e) => handleSkillChange(index, e.target.value)}
                  placeholder="Enter skill"
                />
                <button
                  type="button"
                  className="btn1"
                  onClick={() => handleRemoveSkill(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mb-3">
            <button type="button" className="btn1" onClick={handleAddSkill}>
              Add Skill
            </button>

            {loading ? (
        <div className="text-center mt-4">
          <div
            className="spinner-border"
            style={{ width: "3rem", height: "3rem" }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
            <button type="submit" className="btn2" onClick={handleSubmit}>
              Submit
            </button>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
