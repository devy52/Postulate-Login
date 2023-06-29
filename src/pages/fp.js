import React, { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { useHistory, Link } from "react-router-dom";



const FP = () => {
  const history = useHistory();
  const [quote, setQuote] = useState('');
  const [tempQuote, setTempQuote] = useState('');
  const [isLoggedIn,setIsLoggedIn] = useState(false)

  async function populateQuote() {
    const req = await fetch('http://localhost:2000/api/quote', {
      headers: {
        'x-access-token': localStorage.getItem('token')
      }
    });

    const data = await req.json();
    if (data.status === 'ok') {
      setQuote(data.quote);
    } else {
      alert(data.error);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      history.replace('/index');
    } else {
      const user = jwt.decode(token);
      if (!user) {
        localStorage.removeItem('token');
        history.replace('/index');
      } else {
        populateQuote();
      }
    }
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    history.replace('/index');

    
  };

  async function updateQuote(event) {
    event.preventDefault();
    const req = await fetch('http://localhost:2000/api/quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      },
      body: JSON.stringify({
        quote: tempQuote,
      })
    });

    const data = await req.json();
    if (data.status === 'ok') {
      setQuote(tempQuote);
      setTempQuote('');
    } else {
      alert(data.error);
    }
  }

  return (
    <div>
      <h1>
        Your quote: {quote || 'no quote found'}
        <br />
        Welcome
      </h1>
      <form onSubmit={updateQuote}>
        <input
          type="text"
          placeholder="Quote"
          value={tempQuote}
          onChange={(e) => setTempQuote(e.target.value)}
        />
        <input type="submit" value="Update quote" />
      </form>
      <button onClick={handleLogout}>Logout</button>
      <Link to="/make">make</Link>
      <Link to="/cards">cards</Link>
    </div>
  );
};

export default FP;