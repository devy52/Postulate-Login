import React, { useState } from "react";
import axios from "axios";
import {useHistory} from "react-router-dom";

const Signup = () => {
  const [data,setData] = useState({
    email:"",
    password:""
  });

const history = useHistory();

const handleChange = ({currentTarget:input})=>{
  setData({...data,[input.name]:input.value});
}

const handleSubmit = async(e) => {
  e.preventDefault();
  try{
    const url = "http://localhost:8080/api/user"
    const {data:res} =await axios.post(url,data);
    history.push("./index");
    console.log(res.message);
  }
  catch(error){

  }
}

  return (
    <div>
      <h1>Signup Page</h1>
      <form onSubmit={handleSubmit}>
                {/* Labels and inputs for form data */}
 
        <label className="label">Email</label>
        <input type="email" />
        {/* <input name='email' onChange={handleEmail} className="input"
            value={data.email} type="email" /> */}
 
        <label className="label">Password</label>
        <input type="password" />
        {/* <input name='password' onChange={handlePassword} className="input"
            value={data.password} type="password" /> */}
        <button
                type="submit">
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
