import React from 'react';
import { Link } from 'react-router-dom';

export const SigninPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="text-center m-5-auto">
      <h2>Sign in to us</h2>
      <form onSubmit={handleSubmit}>
        <p>
          <label htmlFor="username">Username or email address</label><br/>
          <input type="text" id="username" name="username" required />
        </p>
        <p>
          <label htmlFor="password">Password</label>
          <Link to="/forget-password" className="right-label">Forget password?</Link>
          <br/>
          <input type="password" id="password" name="password" required />
        </p>
        <p>
          <button id="sub_btn" type="submit">Login</button>
        </p>
      </form>
      <footer>
        <p>First time? <Link to="/signup">Create an account</Link>.</p>
        <p><Link to="/">Back to Homepage</Link>.</p>
      </footer>
    </div>
  );
};