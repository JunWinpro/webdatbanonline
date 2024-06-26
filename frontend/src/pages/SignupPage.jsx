import React from 'react';
import { Link } from 'react-router-dom';

export const SignupPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="text-center m-5-auto">
      <h2>Join us</h2>
      <h5>Create your personal account</h5>
      <form onSubmit={handleSubmit}>
        <p>
          <label htmlFor="username">Username</label><br/>
          <input type="text" id="username" name="username" required />
        </p>
        <p>
          <label htmlFor="email">Email address</label><br/>
          <input type="email" id="email" name="email" required />
        </p>
        <p>
          <label htmlFor="password">Password</label><br/>
          <input type="password" id="password" name="password" required />
        </p>
        <p>
          <input type="checkbox" id="terms" name="terms" required />
          <label htmlFor="terms"> I agree all statements in <a href="https://google.com" target="_blank" rel="noopener noreferrer">terms of service</a></label>
        </p>
        <p>
          <button id="sub_btn" type="submit">Register</button>
        </p>
      </form>
      <footer>
        <p><Link to="/">Back to Homepage</Link>.</p>
      </footer>
    </div>
  );
};