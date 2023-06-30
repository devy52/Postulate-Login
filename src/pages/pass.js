import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";

const Pass = () => {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Extract the email from the query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    setEmail(emailParam);
  }, [location.search]);
  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Send the password reset request to the server
    axios
      .post('/api/reset-password', { email: email, password })
      .then((response) => {
        // Password reset successful
        setSuccess(response.data.message);
      })
      .catch((error) => {
        // Error occurred during password reset
        setError('An error occurred. Please try again later.');
      });
  };


  return (
    <div>
      <h2>Reset Password</h2>
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
      <form onSubmit={handleSubmit}>
      <label>New Password</label>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
      <label>Confirm New Password</label>
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default Pass;
