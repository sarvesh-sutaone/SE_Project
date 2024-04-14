import React, { useState, useEffect, startTransition } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BsChevronLeft } from "react-icons/bs";
import "../views/apply.css";
import Navbar from "./NavbarHandlers.js";
import "../views/global.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Apply = () => {
  const { prj_id, title } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState("");
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // State for tracking form submission
  const id = localStorage.getItem("idToken");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/project/${prj_id}`, {
        headers: {
          authorization: `${id}`,
        },
      })
      .then((response) => {
        console.log("Project details: ", response.data);
        setProject(response.data);
        setLoading(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
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
        console.error("Error fetching projects:", error);
        setLoading(false);
        toast.error("Error Fetching Projects", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "dark",
        });
      });
  }, []);

  const goBack = () => {
    navigate("/home");
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!proposal) {
      alert("Please add SOP");
      return;
    }

    console.log("Submit button clicked");
    const id = localStorage.getItem("idToken");

    if (id) {
      setSubmitting(true); // Set submitting to true when form is being submitted
      axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/apply`,
          { project_id: prj_id, proposal },
          {
            headers: {
              authorization: `${id}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          toast.success("Applied Successfully", {
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
          toast.error("Already Applied", {
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
        .finally(() => {
          setSubmitting(false); // Set submitting to false when form submission is completed
        });
    } else {
      console.error("idToken is null or undefined");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="apply-form3" style={{ paddingLeft: "10%" }}>
        <div className="d-flex justify-content-between align-items-left mb-3">
          <div className="col-auto">
            <button className="btn btn-link" onClick={goBack}>
              <BsChevronLeft size={24} />
            </button>
          </div>
        </div>
        <div className="apply-details" style={{ marginBottom: "0" }}>
          {project !== null ? (
            <div>
              <h1 style={{ marginLeft: '1rem' }}>{title}</h1>
              <div>
                <p style={{ margin: '1rem' }}>Owner: <b>{project.alumni_name}</b> </p>
                <p style={{ margin: '1rem' }}>Email: {project.alumni_email}</p>
              </div>


              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div className="shape" style={{ flex: 1, marginRight: '1rem' }}>
                  <h3>Description</h3>
                  <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{project.description}</p>
                  <h2>
                    <button
                      className="btn2 btn-success" style={{ backgroundColor: 'transparent', color: 'black', border: '1px solid black', fontSize: '16px' }}
                      onClick={() => window.open(project.jobDescription, '_blank')}
                    >
                      Job Description
                    </button>
                  </h2>
                </div>
                <div className="shape2">
                  <div className="shape" style={{ marginRight: '1rem' }}>
                    <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                      <h3>Pay</h3>
                      <b>{project.pay === 0 ? (<><b>Rs {project.pay}</b></>) : (<>Experience</>)}</b>
                    </p>
                  </div>
                  <div className="shape" style={{ marginRight: '1rem' }}>
                    <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                      <h3>Duration</h3>
                      <b>{project.duration} weeks</b>
                    </p>
                  </div>
                  <div className="shape">
                    <h3>Skills</h3>

                    <div className="skills">
                      {project.skills.map((skill, index) => (
                        <p
                          key={index}
                          className="badge"
                          style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '30px',
                            color: '#64556D',
                            fontSize: '1.25rem',
                            fontWeight: 'lighter',
                            display: 'inline-block',
                            marginBottom: '0.5rem',
                            marginRight: '0.5rem',

                          }}
                        >
                          {skill}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
        </div>
        <form
          onSubmit={handleSubmit}
          className="apply-form2"
          style={{ marginTop: "0" }}
        >

          <div>
            <label className="form-label2" style={{ marginLeft: '1rem' }}>
              SOP: Your Proposal to help your candidature:
            </label>
            <textarea
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              className="form-control2"
            ></textarea>
          </div>
          {submitting ? ( // Render loading spinner if submitting state is true
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            <button type="submit" className="btn2">
              Apply
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Apply;