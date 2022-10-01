import { Link } from 'react-router-dom';
import { useState } from 'react';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const { username, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="container container--sm flex items-center">
      <div className="flex flex-col flex-grow border border-black space-y-6 p-4 rounded-2xl">
        <h1 className="text-h3 capitalize text-center">Log in</h1>
        <form className="form w-full space-y-3" id="login">
          <div className="form__input">
            <label htmlFor="username">Username</label>
            <input
              value={username}
              onChange={onChange}
              type="text"
              id="username"
              name="username"
              required
            />
          </div>
          <div className="form__input">
            <label htmlFor="password">Password</label>
            <input
              value={password}
              onChange={onChange}
              type="password"
              id="password"
              name="password"
              required
            />
          </div>
        </form>
        <button
          className="btn mx-auto"
          type="submit"
          form="login"
          value="Log in">
          Log in
        </button>
        <div className="text-center">
          <p>Don't have an account?</p>
          <Link to={'/register'} className="underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
