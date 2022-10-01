import { Link } from 'react-router-dom';
import { useState } from 'react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const { username, password, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="container container--sm flex items-center">
      <div className="flex flex-col flex-grow border border-black space-y-6 p-4 rounded-2xl">
        <h1 className="text-h3 capitalize text-center">Register</h1>
        <form className="form w-full space-y-3" id="login">
          <div className="form__input">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              value={username}
							onChange={onChange}
            />
          </div>
          <div className="form__input">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
							onChange={onChange}
            />
          </div>
          <div className="form__input">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              value={confirmPassword}
							onChange={onChange}
            />
          </div>
        </form>
        <button
          className="btn mx-auto"
          type="submit"
          form="login"
          value="Register">
          Register
        </button>
        <div className="text-center">
          <p>Already have an account?</p>
          <Link to={'/login'} className="underline">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
