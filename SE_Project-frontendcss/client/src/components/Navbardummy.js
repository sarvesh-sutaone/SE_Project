import React from "react"
import Logo from "../assets/BITSCONNECT_logo.png"
import {Link} from "react-router-dom"
import ReorderIcon from '@mui/icons-material/Reorder';
import '../styles/Navbar.css';
// import { Button} from 'react-bootstrap';

function Navbardummy() {
  
  const logout = () => {
    localStorage.clear();
  };

  return (
    <div className="navbar">
        <div className="leftSide">
            <img src={Logo} />
        </div>
        <div className="rightSide"></div>


        {/* <Button>
          <ReorderIcon />
        </Button> */}
    </div>

  )
}

export default Navbardummy