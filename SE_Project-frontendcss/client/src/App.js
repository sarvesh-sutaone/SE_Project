import React from 'react'
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './views/HomePage';
import Register from './views/Register';
import SignIn from './views/SignIn';
import Create from './views/Create';
import Apply from './views/Apply';
import Applications from './views/Applications';
import ViewMyAppliedProjects from './views/ViewMyAppliedProjects';
import ViewMySelectedProjects from './views/ViewMySelectedProjects';

const App = () => {
  return (
    <div className="App">
        
          {/* <Navbar /> */}
          <Routes>
              <Route exact path='/' element={<SignIn/>}/>
              <Route exact path='/home' element={<Home/>} />
              <Route exact path='/register' element={<Register/>} />
              <Route exact path='/create' element={<Create/>} />
              <Route exact path='/apply/:prj_id/:title' element={<Apply/>} />
              <Route exact path='/applications' element={<Applications/>}/>
              <Route exact path='/applied-projects' element={<ViewMyAppliedProjects/>}/>
              <Route exact path='/selected-projects' element={<ViewMySelectedProjects/>} />
          </Routes>
        
    </div>
  )
}

export default App
