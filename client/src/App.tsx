import { useEffect, useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Tasks from "./Tasks";

function App() {
  const [signIn, setSignIn] = useState(false);
  
  if(!localStorage.getItem("token") || localStorage.getItem("token") === "") return (
    <div className="app">
      <div style={{display: signIn ? "none" : "block"}} className="form-container">
        <Login /> <br/>
        <button onClick={() => setSignIn(true)} className="primary-button">Register</button>
      </div>
    
      <div style={{display: signIn ? "block" : "none"}} className="form-container">
        <Register /> <br/>
        <button onClick={() => setSignIn(false)} className="primary-button">Sign in</button>
      </div>
    </div>
  );
  return (
    <div className="app">
      <div className="logo">{localStorage.getItem("token") ? "Leaf Manager" : ""}</div>
      
      <Tasks />
    </div>
  );
}

export default App;
