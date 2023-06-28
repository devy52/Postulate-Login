import React, { useState } from "react";
//import axios from "axios";
import {useHistory} from "react-router-dom";

const Signup = () => {
  const history = useHistory()
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')

  async function registeruser(event) {
    event.preventDefault()
    const response = await fetch('http://localhost:2000/api/register',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body:JSON.stringify({
        email,
        password
      }),
    })

    const data =await response.json()
    
    if(data.status === 'ok'){
      history.push('/index')
    }
  }

  return (
    <div>
      <h1>Signup Page</h1>
      <form onSubmit={registeruser}>
                {/* Labels and inputs for form data */}
 
        <label className="label">Email</label>
        <input 
          type="email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />
        {/* <input name='email' onChange={handleEmail} className="input"
            value={data.email} type="email" /> */}
 
        <label className="label">Password</label>
        <input 
          type="password" 
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />
        {/* <input name='password' onChange={handlePassword} className="input"
            value={data.password} type="password" /> */}
        <button
                type="submit" value="Register">
            Submit
        </button>
        {/* <button onClick={handleSubmit} className="btn"
                type="submit">
            Submit
        </button> */}
      </form>
    </div>
  );
};

export default Signup;
