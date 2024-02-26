import React from "react"
import Logo from "../assets/BITSCONNECT_logo.png"
import {Link} from "react-router-dom"
import ReorderIcon from '@mui/icons-material/Reorder';
import '../styles/Navbar.css';
// import { Button} from 'react-bootstrap';

function Navbar() {
  
  const logout = () => {
    localStorage.clear();
  };

  return (
    <div className="navbar">
        <div className="leftSide">
            <img src={Logo} />
        </div>
        <div className="rightSide"></div>
        <Link to="/home">Home</Link>
        <Link to="/create">Create Opening</Link>
        <Link to="/applications">Owned Projects' Applications</Link>
        <Link to="/applied-projects">Applied Projects</Link>
        <Link to="/selected-projects">Projects Selected For</Link>
      <Link to="/" onClick={logout}>Logout</Link>

        {/* <Button>
          <ReorderIcon />
        </Button> */}
    </div>

  )
}

export default Navbar