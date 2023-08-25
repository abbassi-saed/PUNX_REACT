import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css';
import SignIn from './components/Auth/Login';
import SignUp from './components/Auth/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import CircleChart from './components/Dashboard/CircleChart';

function App() {
  
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<SignIn/>}/>
          <Route exact path="/signup" element={<SignUp/>}/>
          <Route exact path="/dashboard" element={<Dashboard/>} />
          <Route exact path="/chart" element={<CircleChart/>} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
